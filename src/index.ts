import produce from 'immer';
import { isPlainObject, toArray } from './utils';
import { createDevtool } from './createDevtool';
import { run, createExecutableAction, createExecutableMutation } from './executable';
import {
  Options,
  AppListener,
  Reaction,
  Context,
  ConfigurationAny,
  ResolvedConfiguration,
  Executable,
  REACTION_TYPE,
} from './types';

export { withModules } from './withModules';
export { reaction } from './reaction';

export { createConnect, StoreProvider } from './createConnect';

export function createStore<Config extends ConfigurationAny>(config: Config = {} as any, options: Options = {}) {
  const conf = {
    setup: toArray(config.setup),
    reactions: toArray(config.reactions),
    mutations: Object.assign({}, config.mutations),
    actions: Object.assign({}, config.actions),
    state: Object.assign({}, config.state || {}),
    statics: Object.assign({}, config.statics || {}),
  };

  const optionsResolved = {
    devtool: !!options.devtool,
    openDevtool: !!options.openDevtool,
  };

  const statics = conf.statics;

  const devtool = createDevtool({ disabled: !optionsResolved.devtool });

  if (optionsResolved.openDevtool) {
    devtool.open();
  }

  let state = conf.state;
  let prevState = state;

  let listeners: Array<AppListener<Config>> = [];
  let isStabilizing = false;
  //In case of infinite loop, we blacklist reactions to limit the damages
  let blacklistedReactions: Array<Reaction<Config>> = [];

  const actions = createAction<Config>(conf.actions, []);
  const mutations = createMutation<Config>(conf.mutations, []);
  const reactions = validateReactions<Config>(conf.reactions, []);

  function getState() {
    return state;
  }

  function subscribe(listener: AppListener<Config>) {
    listeners.push(listener);
    return () => {
      const listenerIndex = listeners.indexOf(listener);
      if (listenerIndex >= 0) {
        listeners.splice(listenerIndex, 1);
      }
    };
  }

  function flush(ctx: Context<Config>, async: boolean) {
    const name = (async ? '(async) ' : '') + ctx.origin.join(' > ');
    devtool.pushStep({
      name: name,
      value: null,
      state,
      prevState,
    });
    prevState = state;
    listeners.forEach(listener => {
      listener(state, statics);
    });
  }

  function runReaction(reaction: Reaction<Config>, origin: Array<string>) {
    const reactionResult = reaction.reaction({
      state,
      getState,
      statics,
      mutations,
      actions,
    });
    return storeRun(reactionResult, [...origin]);
  }

  /**
   *
   */
  function onRunEnd(ctx: Context<Config>, async: boolean) {
    // console.log({ origin: ctx.origin, async, isStabilizing, stateChanged: ctx.stateChanged })
    if (isStabilizing) {
      return;
    }
    if (!ctx.stateChanged) {
      return;
    }
    isStabilizing = true;
    let passed = 0;
    let safe = 100;
    const safeInitit = safe; // for error log only
    let index = 0;
    let stack = [...ctx.origin];
    let lastReactionWithChange: Reaction<Config> | null = null;
    while (passed < reactions.length && safe > 0) {
      safe--;
      const modIndex = index % reactions.length;
      const reaction = reactions[modIndex];
      const result = runReaction(reaction, stack);
      const blacklisted = blacklistedReactions.indexOf(reaction) >= 0;
      if (result.stateChanged && !blacklisted) {
        passed = 0;
        stack.push('REACTION: ' + reaction.name);
        lastReactionWithChange = reaction;
      } else {
        passed = passed + 1;
      }
      index++;
    }
    if (safe <= 0) {
      console.error(
        [
          `The store Stabilizer hit the safe limit`,
          `The stabilizer run each reaction one after the other in loop until none of them return a synchronous mutation`,
          `At which point we consider the state "stable" and we flush the changes (execute the state listeners)`,
          `Hitting the safe limit mean that more than ${safeInitit} reactions where called`,
          `so we stoped the execution to prevent infinit loop and blacklisted the last reaction that return an statechange`,
          `To fix this you need to find the reaction(s) responsible for this loop`,
          `Below you can see the stack of reactions that where called`,
        ].join('\n')
      );
      console.error(stack.join('\n > '));
      if (lastReactionWithChange) {
        blacklistedReactions.push(lastReactionWithChange);
      }
    }
    isStabilizing = false;

    flush(ctx, async);
  }

  function createContext(origin: Array<string> = []): Context<Config> {
    return {
      path: [],
      origin,
      stateChanged: false,
      error: null,
      runAction: (name, action, value, ctx) => {
        console.log(`Run action ${name}`, ctx);
        return action({ state, getState, statics, mutations, actions, value });
      },
      runMutation: (name, mutation, value, ctx) => {
        console.log(`Run mutation ${name}`, ctx);
        const prevState = state;
        const produced = produce(state, draft => {
          mutation({ state: draft, value });
        });
        state = produced;
        const stateChanged = state !== prevState;
        return stateChanged;
      },
    };
  }

  function storeRun(executable: Executable, origin: Array<string>) {
    return run(executable, createContext(origin), {
      onAsync: result => {
        onRunEnd(result, true);
      },
      onSync: result => {
        onRunEnd(result, false);
      },
    });
  }

  const callableActions: ResolvedConfiguration<Config>['callableActions'] = createCallable(
    actions,
    storeRun,
    'ACTION: '
  );
  const callableMutations: ResolvedConfiguration<Config>['callableMutations'] = createCallable(
    mutations,
    storeRun,
    'MUTATION: '
  );

  const store = {
    actions: callableActions,
    mutations: callableMutations,
    getState,
    subscribe,
    devtool,
  };

  function callSetups(setups: ResolvedConfiguration<Config>['setup']) {
    setups.forEach(setup => {
      setup({ actions: callableActions, mutations: callableMutations, state, getState, statics });
    });
  }

  callSetups(conf.setup);

  devtool.afterInit(getState());

  // Trigger reactions
  // Call onRunEnd with a ctx with stateChanged: true
  onRunEnd(
    {
      ...createContext([]),
      stateChanged: true,
    },
    false
  );

  return store;
}

function createAction<Config extends ConfigurationAny>(
  action: any,
  path: Array<string>
): ResolvedConfiguration<Config>['executableActions'] {
  if (isPlainObject(action)) {
    return Object.keys(action).reduce(
      (acc, key) => {
        acc[key] = createAction(action[key], [...path, key]);
        return acc;
      },
      {} as any
    ) as any;
  }
  return ((value: any) => createExecutableAction(path.join('.'), action, value)) as any;
}

function createMutation<Config extends ConfigurationAny>(
  mutation: any,
  path: Array<string>
): ResolvedConfiguration<Config>['executableMutations'] {
  if (isPlainObject(mutation)) {
    return Object.keys(mutation).reduce(
      (acc, key) => {
        acc[key] = createMutation(mutation[key], [...path, key]);
        return acc;
      },
      {} as any
    ) as any;
  }
  return ((value: any) => createExecutableMutation(path.join('.'), mutation, value)) as any;
}

export function validateReactions<Config extends ConfigurationAny>(
  reactions: Array<Reaction<Config>>,
  path: Array<string | number>
) {
  reactions.forEach((reaction, index) => {
    if (!isPlainObject(reaction) || reaction.type !== REACTION_TYPE) {
      throw new Error(`Reaction at ${[...path, index].join('.')} is invalid, make sure to use the reaction() function`);
    }
  });
  return reactions;
}

function createCallable(action: any, storeRun: any, prefix: string): any {
  if (isPlainObject(action)) {
    return Object.keys(action).reduce(
      (acc, key) => {
        acc[key] = createCallable(action[key], storeRun, prefix);
        return acc;
      },
      {} as any
    );
  }
  return (value: any) => {
    const theAction = action(value);
    return storeRun(theAction, [prefix + theAction.name]);
  };
}

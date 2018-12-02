import { isPromise, isPlainObject } from './utils';
import { Context, Exit, Action, ConfigurationAny, HandlerAny, Mutation, Exits, Executable, Handler } from './types';

function createNextContext<Config extends ConfigurationAny>(
  ctx: Context<Config>,
  part: string | null | number,
  stateChanged = false,
  error = null
) {
  const nextPath = part === null ? ctx.path : [...ctx.path, part];
  return {
    ...ctx,
    path: nextPath,
    stateChanged: ctx.stateChanged || stateChanged,
    error: error || ctx.error,
  };
}

function onError<Config extends ConfigurationAny>(exit: Exit<Config>, error: any, context: Context<Config>) {
  console.error(error);
  return exit(null, createNextContext(context, null, false, error));
}

/**
 * Handlers
 *
 * Handlers are function with signature:
 * (executable, ctx, exits) => nextCtx
 * exits are { ignore, handle, handleAsync } and have all the same signature:
 * (executable, ctx) => newCtx
 * ctx is a object taht keep track of information about the current execution
 */

const handleNull: HandlerAny = (executable, ctx, { ignore }) => {
  if (ctx.error) {
    return ignore(executable, ctx);
  }
  if (executable === null) {
    return createNextContext(ctx, 'null');
  }
  return ignore(executable, ctx);
};

const handlePromise: HandlerAny = (executable, ctx, { handleAsync, ignore }) => {
  if (ctx.error) {
    return ignore(executable, ctx);
  }
  if (isPromise(executable)) {
    const promiseCtx = createNextContext(ctx, 'promise');
    executable
      .then(val => handleAsync(val, createNextContext(promiseCtx, 'resolved')))
      .catch(err => onError(handleAsync, err, createNextContext(promiseCtx, 'rejected')));
    return promiseCtx;
  }
  return ignore(executable, ctx);
};

const handleArray: HandlerAny = (executable, ctx, { handle, ignore }) => {
  if (Array.isArray(executable)) {
    const arrContext = createNextContext(ctx, 'array');
    const contexts = executable.map((exec, index) => handle(exec, createNextContext(arrContext, index)));
    return contexts.reduce((acc, ctx) => createNextContext(acc, null, ctx.stateChanged, ctx.error), arrContext);
  }
  return ignore(executable, ctx);
};

const ACTION_TYPE = 'ACTION_TYPE';

export type ExecutableAction<Value> = {
  type: typeof ACTION_TYPE;
  name: string;
  action: Action<ConfigurationAny, Value>;
  value: Value;
};

export function createExecutableAction<Value>(
  name: string,
  action: Action<ConfigurationAny, Value>,
  value: Value
): ExecutableAction<Value> {
  return {
    type: ACTION_TYPE,
    name,
    action,
    value,
  };
}

function isExecutableAction(maybe: any): maybe is ExecutableAction<any> {
  return isPlainObject(maybe) && maybe.type === ACTION_TYPE;
}

const handleAction: HandlerAny = (executable, ctx, { handle, ignore }) => {
  if (ctx.error) {
    return ignore(executable, ctx);
  }
  if (isExecutableAction(executable)) {
    let actionResult = null;
    try {
      actionResult = ctx.runAction(executable.name, executable.action, executable.value, ctx);
    } catch (error) {
      return onError(handle, error, ctx);
    }
    return handle(actionResult, createNextContext(ctx, executable.name));
  }
  return ignore(executable, ctx);
};

const MUTATION_TYPE = 'MUTATION_TYPE';

export type ExecutableMutation<Config extends ConfigurationAny, Value> = {
  type: typeof MUTATION_TYPE;
  name: string;
  mutation: Mutation<Config, Value>;
  value: Value;
};

export function createExecutableMutation<Config extends ConfigurationAny, Value>(
  name: string,
  mutation: Mutation<Config, Value>,
  value: Value
): ExecutableMutation<Config, Value> {
  return {
    type: MUTATION_TYPE,
    name,
    mutation,
    value,
  };
}

function isExecutableMutation<Config extends ConfigurationAny>(maybe: any): maybe is ExecutableMutation<Config, any> {
  return isPlainObject(maybe) && maybe.type === MUTATION_TYPE;
}

const handleMutation: HandlerAny = (executable, ctx, { handle, ignore }) => {
  if (ctx.error) {
    return ignore(executable, ctx);
  }
  if (isExecutableMutation(executable)) {
    let stateChanged = false;
    try {
      stateChanged = ctx.runMutation(executable.name, executable.mutation, executable.value, ctx);
    } catch (error) {
      return onError(handle, error, ctx);
    }
    return createNextContext(ctx, executable.name, stateChanged);
  }
  return ignore(executable, ctx);
};

/**
 *
 */

function pipe(...handlers: Array<HandlerAny>): HandlerAny {
  return (executable, context, exits) => {
    let ctx = context;
    const createExits = (nextOperatorIndex: number, exits: Exits<ConfigurationAny>): Exits<ConfigurationAny> => {
      const nextHandler = handlers[nextOperatorIndex];
      return {
        handle: exits.handle,
        handleAsync: exits.handleAsync,
        ignore: (nextExec, nextCtx) => {
          if (nextHandler) {
            return nextHandler(nextExec, nextCtx, createExits(nextOperatorIndex + 1, exits));
          }
          return exits.ignore(nextExec, nextCtx);
        },
      };
    };
    return handlers[0](executable, ctx, createExits(1, exits));
  };
}

const handlers = pipe(
  handleNull,
  handlePromise,
  handleArray,
  handleAction,
  handleMutation
);

type RunOptions<Config extends ConfigurationAny> = {
  onSync: (ctx: Context<Config>) => any;
  onAsync: (ctx: Context<Config>) => any;
};

export function run<Config extends ConfigurationAny>(
  executable: Executable,
  context: Context<Config>,
  { onSync, onAsync }: RunOptions<Config>
) {
  const handle = (exec: Executable, ctx: Context<Config>): Context<Config> => {
    return ((handlers as any) as Handler<Config>)(exec, ctx, {
      handle: handle,
      handleAsync: (exec, ctx) => {
        const asyncResult = handle(exec, ctx);
        onAsync(asyncResult);
        return asyncResult;
      },
      ignore: (exec, ctx) => {
        if (ctx.error) {
          throw ctx.error;
        }
        const name = (ctx.origin || []).join(' > ');
        if (exec === undefined) {
          console.error(
            [
              `Error while running ${name} :`,
              `The store received undefined and can't handle it`,
              `This is most likely cause by an action, or a reaction not returning anything`,
              `If you want to "do nothing" you can return null`,
              `Note that this might be caused by the indirect result of an action`,
              `For example if an action, return a promise that resolve(undefined) you would get this error`,
              `You might find more information in the context bellow:`,
            ].join('\n')
          );
          console.log(ctx);
        } else {
          console.error(
            [
              `Error while running ${name}`,
              `You probably returned something that is not handled by the store`,
              `The store supports only "executable" type, executables are:`,
              `null, Promise<Executable>, Array<Executable>, action(), mutation()`,
              `Note that this might be caused by the indirect result of an action`,
              `For example if an action, return a promise that resolve("a string") you would get this error`,
              `The invalid executable is log bellow :`,
            ].join('\n')
          );
          console.log(exec);
          console.error(`And here is the context that might give you more infirmation :`);
          console.log(ctx);
        }

        // Ignore the exec
        return ctx;
      },
    });
  };
  const result = handle(executable, context);
  onSync(result);
  return result;
}

import { ExecutableAction } from './executable';
import { Devtool } from './createDevtool';

/**
 * Executable
 */

declare type SECRET = symbol;

export const REACTION_TYPE = 'REACTION_TYPE';

export type ExecutableObfuscated = {
  type: SECRET;
};

export type ExecutableNoCircular = null | ExecutableObfuscated | ExecutableAction<any>;

export type ArrayOfExecutable = Array<ExecutableNoCircular | Promise<ExecutableNoCircular>>;

export type PromiseExecutable = Promise<ExecutableNoCircular | Array<ExecutableNoCircular>>;

export type Executable = ExecutableNoCircular | ArrayOfExecutable | PromiseExecutable;

/**
 * Action
 */

export type ActionContext<Config extends ConfigurationAny, Value> = {
  value: Value;
  state: ResolvedState<Config>;
  getState: () => ResolvedState<Config>;
  statics: ResolvedStatics<Config>;
  mutations: ResolvedConfiguration<Config>['executableMutations'];
  actions: ResolvedConfiguration<Config>['executableActions'];
};

export type Action<Config extends ConfigurationAny, Value> = (context: ActionContext<Config, Value>) => Executable;

export type ActionsObject<Config extends ConfigurationAny> = {
  [key: string]: Actions<Config>;
};

export type Actions<Config extends ConfigurationAny> = Action<Config, any> | ActionsObject<Config>;

export type CallableActions<Acts extends Actions<ConfigurationAny>> = Acts extends ActionsObject<ConfigurationAny>
  ? { [K in keyof Acts]: CallableActions<Acts[K]> }
  : Acts extends (context: { value: infer Value }) => any
  ? Callable<Value, void>
  : never;

export type ExecutableActions<Acts extends Actions<ConfigurationAny>> = Acts extends ActionsObject<ConfigurationAny>
  ? { [K in keyof Acts]: ExecutableActions<Acts[K]> }
  : Acts extends (context: { value: infer Value }) => any
  ? Callable<Value, Executable>
  : never;

/**
 * Mutations
 */

export type MutationContext<Value, State> = {
  value: Value;
  state: State;
};

export type Mutation<Value, State> = (context: MutationContext<Value, State>) => void;
export type AppMutation<Config extends ConfigurationAny, Value> = Mutation<Value, ResolvedState<Config>>;

type MutationsObject<State> = {
  [key: string]: Mutations<State>;
};

export type Mutations<State> = Mutation<any, State> | MutationsObject<State>;

export type CallableMutations<Mutats extends Mutations<any>> = Mutats extends MutationsObject<any>
  ? { [K in keyof Mutats]: CallableMutations<Mutats[K]> }
  : Mutats extends Mutation<infer Value, any>
  ? Callable<Value, void>
  : never;

export type ExecutableMutations<Mutats extends Mutations<any>> = Mutats extends MutationsObject<any>
  ? { [K in keyof Mutats]: ExecutableMutations<Mutats[K]> }
  : Mutats extends Mutation<infer Value, any>
  ? Callable<Value, Executable>
  : never;

/**
 * Reaction
 */

export type ReactionContext<Config extends ConfigurationAny> = {
  state: ResolvedState<Config>;
  getState: () => ResolvedState<Config>;
  statics: ResolvedStatics<Config>;
  actions: ResolvedConfiguration<Config>['executableActions'];
  mutations: ResolvedConfiguration<Config>['executableMutations'];
};

export type Reaction<Config extends ConfigurationAny> = {
  type: typeof REACTION_TYPE;
  name: string;
  reaction: (context: ReactionContext<Config>) => Executable;
};
export type Reactions<Config extends ConfigurationAny> = Reaction<Config> | Array<Reaction<Config>>;

/**
 * Setup
 */

export type SetupContext<Config extends ConfigurationAny> = {
  state: ResolvedState<Config>;
  getState: () => ResolvedState<Config>;
  statics: ResolvedStatics<Config>;
  actions: ResolvedConfiguration<Config>['callableActions'];
  mutations: ResolvedConfiguration<Config>['callableMutations'];
};

export type Setup<Config extends ConfigurationAny> = (context: SetupContext<Config>) => any;
export type Setups<Config extends ConfigurationAny> = Setup<Config> | Array<Setup<Config>>;

/**
 * Configuration
 */

export type Configuration<
  State,
  Statics,
  Acts extends Actions<Configuration<State, Statics, any, Mutas>>,
  Mutas extends Mutations<State>
> = {
  state: any;
  actions: Acts;
  mutations: Mutations<State>;
  statics: Statics;
  reactions: Reactions<Configuration<State, Statics, any, Mutas>>;
  setup: Setups<Configuration<State, Statics, any, Mutas>>;
};

export type ConfigurationAny = Configuration<any, any, any, any>;

/**
 * Store
 */

export type Store<Config extends ConfigurationAny> = {
  actions: ResolvedConfiguration<Config>['callableActions'];
  mutations: ResolvedConfiguration<Config>['callableMutations'];
  getState: () => ResolvedConfiguration<Config>['state'];
  subscribe: (listener: AppListener<Config>) => () => void;
  devtool: Devtool;
};

export type StoreAny = Store<ConfigurationAny>;

/**
 * Other
 */

export type Callable<Value, Output> = Value extends void ? () => Output : (value: Value) => Output;

export type Options = {
  devtool?: boolean;
  openDevtool?: boolean;
};

export type Listener<State, Statics> = (state: State, statics: Statics) => any;

export type AppListener<Config extends ConfigurationAny> = Listener<ResolvedState<Config>, ResolvedStatics<Config>>;

export type ResolvedConfiguration<Config extends ConfigurationAny> = {
  state: Config['state'] extends void ? {} : Config['state'];
  statics: Config['statics'] extends void ? {} : Config['statics'];
  executableMutations: Config['mutations'] extends void ? {} : ExecutableMutations<Config['mutations']>;
  executableActions: Config['actions'] extends void ? {} : ExecutableActions<Config['actions']>;
  callableMutations: Config['mutations'] extends undefined ? {} : CallableMutations<Config['mutations']>;
  callableActions: Config['actions'] extends undefined ? {} : CallableActions<Config['actions']>;
  setup: Array<Setup<Config>>;
  reactions: Array<Reaction<Config>>;
};

export type ResolvedState<Config extends ConfigurationAny> = ResolvedConfiguration<Config>['state'];
export type ResolvedStatics<Config extends ConfigurationAny> = ResolvedConfiguration<Config>['statics'];

export type StateChanged = boolean;

export type Context<Config extends ConfigurationAny> = {
  path: Array<string | number>;
  origin: Array<string>;
  stateChanged: StateChanged;
  error: null | any;
  runAction: <Value>(name: string, action: Action<Config, Value>, value: Value, ctx: Context<Config>) => Executable;
  runMutation: <Value>(
    name: string,
    mutation: AppMutation<Config, Value>,
    value: Value,
    ctx: Context<Config>
  ) => StateChanged;
};
export type ContextAny = Context<ConfigurationAny>;

export type Exit<Config extends ConfigurationAny> = (executable: Executable, ctx: Context<Config>) => Context<Config>;
export type Exits<Config extends ConfigurationAny> = {
  ignore: Exit<Config>;
  handle: Exit<Config>;
  handleAsync: Exit<Config>;
};

export type Handler<Config extends ConfigurationAny> = (
  executable: Executable,
  ctx: Context<Config>,
  exits: Exits<Config>
) => Context<Config>;
export type HandlerAny = Handler<ConfigurationAny>;

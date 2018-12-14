export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export namespace ExecutableType {
  export type Any<Async = any, Dynamic = any> = {
    // does it return a Promise ?
    __async: Async extends boolean ? Async : never;
    // does it need an input value ?
    __dynamic: Dynamic extends boolean ? Dynamic : never;
  };

  export type AsyncDynamic = Any<true, true>;
  export type AsyncStatic = Any<true, false>;

  export type SyncDynamic = Any<false, true>;
  export type SyncStatic = Any<false, false>;

  export type Static<Async = any> = Any<Async, false>;
  export type Dynamic<Async = any> = Any<Async, true>;

  export type Sync<Dynamic = any> = Any<false, Dynamic>;
  export type Async<Dynamic = any> = Any<true, Dynamic>;
}

export type ExecutableInternal<State, Effects, Input, Output, Async, Dynamic> = {
  [IS_EXECUTABLE]: {
    __state: State;
    __effects: Effects;
    __input: Input;
    __output: Output;
    __async: Async extends boolean ? Async : never;
    __dynamic: Dynamic extends boolean ? Dynamic : never;
  };
  (input: Input): any;
};

export type Executable<State, Effects, Input, Output, Type extends ExecutableType.Any> = null | ExecutableInternal<
  State,
  Effects,
  Input,
  Output,
  Type['__async'],
  Type['__dynamic']
>;

export type ExecutableInfered<State, Effects, Input, Output, Dynamic = Input extends void ? false : true> = [
  Output
] extends [Promise<infer U>]
  ? ExecutableInternal<State, Effects, Input, U, true, Dynamic>
  : ExecutableInternal<State, Effects, Input, Output, false, Dynamic>;

export type CallableInternal<State, Effects, Input, Output, Async, Dynamic> = ExecutableInternal<
  State,
  Effects,
  Input,
  Output,
  Async,
  Dynamic
> &
  (Dynamic extends false
    ? { (): ExecutableInternal<State, Effects, any, Output, Async, false> }
    : { (input: Input): ExecutableInternal<State, Effects, any, Output, Async, false> });

export type Callable<State, Effects, Input, Output, Type extends ExecutableType.Any> = CallableInternal<
  State,
  Effects,
  Input,
  Output,
  Type['__async'],
  Type['__dynamic']
>;

export type CallableInfered<State, Effects, Input, Output> = [Output] extends [Promise<infer U>]
  ? CallableInternal<State, Effects, Input extends void ? any : Input, U, true, Input extends void ? false : true>
  : CallableInternal<
      State,
      Effects,
      Input extends void ? any : Input,
      Output,
      false,
      Input extends void ? false : true
    >;

export function createExecutableAny<State, Effects, Input, Output, Type extends ExecutableType.Any, Metadata>(
  data: Metadata
): ExecutableInternal<State, Effects, Input, Output, Type['__async'], Type['__dynamic']> {
  return {
    [IS_EXECUTABLE]: data as any,
  } as any;
}

export function isExecutableAny<State, Effects>(
  maybe: any
): maybe is ExecutableInternal<State, Effects, any, any, any, any> {
  return !!maybe[IS_EXECUTABLE];
}

export function extractExecutableMetadata<State, Effects>(
  executable: ExecutableInternal<State, Effects, any, any, any, any>
): any {
  return executable[IS_EXECUTABLE];
}

export type Context<State, Effects, Value> = Effects & {
  value: Value;
  state: State;
};

export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny<State, Effects, Input, Output, Async, NeedImput> = {
  [IS_EXECUTABLE]: {
    __state: State;
    __effects: Effects;
    __input: Input;
    __output: Output;
    __async: Async extends boolean ? Async : never;
    __needInput: NeedImput extends boolean ? NeedImput : never;
  };
};

export type Executable<State, Effects, Input, Output, Async, NeedImput> = ExecutableAny<
  State,
  Effects,
  Input,
  Output,
  Async,
  NeedImput
>;

export type CallableInternal<State, Effects, Input, Output, Async, NeedImput> = Executable<
  State,
  Effects,
  Input,
  Output,
  Async,
  NeedImput
> &
  (NeedImput extends false
    ? { (): Executable<State, Effects, any, Output, Async, false> }
    : { (input: Input): Executable<State, Effects, any, Output, Async, false> });

export type Callable<State, Effects, Input, Output> = Output extends Promise<infer U>
  ? CallableInternal<State, Effects, Input, U, true, Input extends void ? false : true>
  : CallableInternal<State, Effects, Input, Output, false, Input extends void ? false : true>;

export function createExecutableAny<State, Effects, Input, Output, Async, NeedImput, Metadata>(
  data: Metadata
): ExecutableAny<State, Effects, Input, Output, Async, NeedImput> {
  return {
    [IS_EXECUTABLE]: data as any,
  };
}

export function isExecutableAny<State, Effects>(
  maybe: any
): maybe is ExecutableAny<State, Effects, any, any, any, any> {
  return !!maybe[IS_EXECUTABLE];
}

export function extractExecutableMetadata<State, Effects>(
  executable: ExecutableAny<State, Effects, any, any, any, any>
): any {
  return executable[IS_EXECUTABLE];
}

export type Context<State, Effects, Value> = Effects & {
  value: Value;
  state: State;
};

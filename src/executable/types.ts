import { State } from '../state';

export const IS_EXECUTABLE = Symbol('IS_EXECUTABLE');

export type ExecutableAny<Input, Output, Async, NeedImput> = {
  [IS_EXECUTABLE]: {
    __input: Input;
    __output: Output;
    __async: Async extends boolean ? Async : never;
    __needInput: NeedImput extends boolean ? NeedImput : never;
  };
};

export type Executable<Input, Output, Async, NeedImput> = ExecutableAny<Input, Output, Async, NeedImput>;

export type CallableInternal<Input, Output, Async, NeedImput> = Executable<Input, Output, Async, NeedImput> &
  (NeedImput extends false
    ? { (): Executable<any, Output, Async, false> }
    : { (input: Input): Executable<any, Output, Async, false> });

export type Callable<Input, Output> = Output extends Promise<infer U>
  ? CallableInternal<Input, U, true, Input extends void ? false : true>
  : CallableInternal<Input, Output, false, Input extends void ? false : true>;

export function createExecutableAny<Input, Output, Async, NeedImput, Metadata>(
  data: Metadata
): ExecutableAny<Input, Output, Async, NeedImput> {
  return {
    [IS_EXECUTABLE]: data as any,
  };
}

export function isExecutableAny(maybe: any): maybe is ExecutableAny<any, any, any, any> {
  return !!maybe[IS_EXECUTABLE];
}

export function extractExecutableMetadata(executable: ExecutableAny<any, any, any, any>): any {
  return executable[IS_EXECUTABLE];
}

export type Context<Value> = {
  value: Value;
  state: State;
};

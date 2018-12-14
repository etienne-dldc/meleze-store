import { Executable, Callable, ExecutableType, CallableInfered } from './types';

export { createOperators } from './factories';

export function execute<State, Effects, Output, Type extends ExecutableType.Static>(
  _exec: Executable<State, Effects, null, Output, Type>
): Type['__async'] extends true ? Promise<Output> : Output {
  return {} as any;
}

export { Executable, Callable, ExecutableType, CallableInfered };

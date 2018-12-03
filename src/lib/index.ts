import { Executable } from './types';

export { createOperators } from './factories';

export function execute<State, Effects, Output, Async extends boolean>(
  _exec: Executable<State, Effects, null, Output, Async, false>
): Async extends true ? Promise<Output> : Output {
  return {} as any;
}

import { Executable } from './types';

export { pipe, map, value, action, mutation, parallel, run } from './factories';

export function execute<Output, Async extends boolean>(
  exec: Executable<null, Output, Async, false>
): Async extends true ? Promise<Output> : Output {
  return {} as any;
}

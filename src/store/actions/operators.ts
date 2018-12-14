import {
  createOperators,
  Executable as TExecutable,
  Callable as TCallable,
  ExecutableType,
  CallableInfered as TCallableInfered,
} from '../../lib';
import * as effects from '../effects';
import { State } from '../state';

export const { pipe, map, inject, action, mutation, parallel, run } = createOperators<State, typeof effects>();

export type Executable<Input, Output, Type extends ExecutableType.Any> = TExecutable<
  State,
  typeof effects,
  Input,
  Output,
  Type
>;

export type Callable<Input, Output, Type extends ExecutableType.Any> = TCallable<
  State,
  typeof effects,
  Input,
  Output,
  Type
>;

export type CallableInfered<Input, Output> = TCallableInfered<State, typeof effects, Input, Output>;

export { ExecutableType };

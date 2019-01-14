import { createOperators } from '../lib/actions/operators';
import * as effects from './effects';
import state from './state';

type Effects = typeof effects;

export const {
  pipe,
  run,
  action,
  attempt,
  branch,
  callable,
  execute,
  forEach,
  ignoreOutput,
  inject,
  inputType,
  map,
  mergeWith,
  mutate,
  noop,
  parallel,
  validate,
  withValue,
} = createOperators<Effects, typeof state>();

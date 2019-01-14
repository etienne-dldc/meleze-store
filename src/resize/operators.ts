import { createOperators } from '../lib';
import * as effects from './effects';
import state from './state';

// prettier-ignore
export const {
  pipe, run, action, attempt, branch, callable, execute, forEach, ignoreOutput, inject, inputType,
  map, mergeWith, mutate, noop, parallel, validate, withValue,
} = createOperators<typeof effects, typeof state>();

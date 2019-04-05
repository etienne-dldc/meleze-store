import { createManager } from '../../lib';
import { State, initialState } from './state';

export const manager = createManager<State>(initialState);

export const fragment = manager.fragment;

export const useFragment = manager.createUseFragment(manager);
export const useExecutables = manager.createUseExecutables(manager);

export const {
  map,
  mutate,
  pipe,
  withValue,
  inject,
  execute,
  parallel,
  callable,
  action,
  attempt,
  run,
  ignoreOutput,
  noop,
  forEach,
  branch,
  inputType,
  mergeWith,
  filter,
} = manager.createOperators();

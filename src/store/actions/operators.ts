import { createOperators } from '../../lib';
import * as effects from '../effects';
import { State } from '../state';

export const { pipe, map, value, action, mutation, parallel, run } = createOperators<State, typeof effects>();

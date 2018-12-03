import { createOperators } from '../lib';
import * as effects from './effects';
import { State } from './state';

const { pipe, map, value, action, mutation, parallel, run } = createOperators<State, typeof effects>();

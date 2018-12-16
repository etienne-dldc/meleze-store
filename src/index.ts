import { map, mutate, pipe, withValue, inject, execute, parallel, callable } from './lib';
import { number } from 'prop-types';

type State = {
  num: number;
  str: string;
  obj: {
    foo: string;
  };
};

const state: State = {} as any;

const setNum = mutate<number>(({ value }) => {
  state.num = value;
});

const double = map<number, number>(({ value }) => value * 2);

const doubleAll = map<Array<number>, Array<number>>(({ value }) => value);

const setStr = mutate(() => {
  state.str = 'foo';
});

const mut1 = mutate<{ str: string }>(() => {
  state.str = 'foo';
});

const mut2 = mutate<{ num: number }>(() => {
  state.str = 'foo';
});

const myAction = pipe(
  setStr,
  setStr,
  setStr,
  setNum
);

const runAll = parallel(
  mut1,
  mut2
  // myAction,
  // double
);

const result = callable(runAll)({ str: 'hello', num: 43 });

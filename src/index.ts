import { map, mutate, pipe, withValue, inject, execute, parallel, callable, action, Executable } from './lib';

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

const setStrIfTrue = action<boolean, Executable<void, { str: string }, false, true, false>>(({ value }) => {
  if (value) {
    const res = withValue(mut1, { str: 'hello' });
    return res;
  }
  return inject({ str: 'hello' });
});

const myAction = pipe(
  setStrIfTrue,
  setStr,
  map<{ str: string }, number>(({ value }) => value.str.length),
  setNum
);

const test = pipe(
  inject({ num: 43, str: 'hello' }),
  map<{ num: number }, { num: number }>(({ value }) => value)
);

const runAll = parallel(
  mut1,
  mut2,
  // myAction,
  pipe(
    map<{ num: number }, number>(({ value }) => value.num),
    double
  )
);

const result1 = callable(runAll)({ str: 'hello', num: 43 });
const result2 = execute(runAll, { str: 'hello', num: 43 });
const result3 = execute(setStr);

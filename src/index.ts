import {
  map,
  mutate,
  pipe,
  withValue,
  inject,
  execute,
  parallel,
  callable,
  action,
  validate,
  attempt,
  run,
  ignoreOutput,
  noop,
} from './lib';

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

const setStrIfTrue = action<boolean, { str: string }>(({ value }) => {
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

const testMap = map<{ num: number }, { str: string }>(({ value }) => ({ str: value.num + '' }));

const test = pipe(
  inject({ num: 43, str: 'hello' }),
  testMap
);

const onError = action<Error, void>(({ value }) => {
  console.log(value);

  return {} as any;
});

const onErrorBis = run<Error>(({ value }) => {
  console.log(value);
});

const attemptStuff = attempt(ignoreOutput(test), onErrorBis);

const paraPart = pipe(
  map<{ num: number }, number>(({ value }) => value.num),
  double
);

const runAll = parallel(
  mut1,
  // mut2,
  // myAction,
  map<void, number>(() => 42),
  paraPart
);

const paraPara = parallel(mut1, runAll);

const result1 = callable(paraPara)({ str: 'hello', num: 43 });
const result2 = execute(paraPara, { str: 'hello', num: 43 });
const result3 = execute(setStr);

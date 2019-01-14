import { State, Ctx, Post } from './state';
import { createOperators } from '../lib';

const {
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
} = createOperators<Ctx, State>();

const setNum = mutate<number>(({ value, state }) => {
  state.num = value;
});

const double = map<number, number>(({ value }) => value * 2);

const doubleAll = map<Array<number>, Array<number>>(({ value }) => value.map(v => v * 2));

const betterDoubleAll = forEach(double);

execute(doubleAll, [1, 4, 8]);

execute(betterDoubleAll, [4, 7, 9]);

const setStr = mutate(({ state }) => {
  state.str = 'foo';
});

const mut1 = mutate<{ str: string }>(({ state }) => {
  state.str = 'foo';
});

const mut2 = mutate<{ num: number }>(({ state }) => {
  state.str = 'foo';
});

const multi = branch<{ str: string; num: number }>()({
  mut1,
  mut1bis: mut1,
  mut2,
  asyncStuff: map<{ str: string }, Promise<number>>(() => Promise.resolve(42)),
  noop,
});

execute(multi, { str: 'he', num: 43 }).then(res => {
  console.log(res.asyncStuff);
  console.log(res.noop);
  console.log(res.mut2);
});

const setStrIfTrue = action<boolean, { str: string }>(({ value }) => {
  if (value) {
    const res = withValue(mut1, { str: 'hello' });
    return res;
  }
  return inject({ str: 'hello' });
});

const sameAsRun = action<boolean, { str: string }>(({ value }) => {
  if (value) {
    return setStrIfTrue;
  }
  const res = pipe(
    inputType<boolean>(),
    inject({ str: 'hello' })
  );
  return res;
});

execute(sameAsRun, true);

const myAction = pipe(
  setStrIfTrue,
  setStr,
  map<{ str: string }, number>(({ value }) => value.str.length),
  setNum
);

execute(myAction, true);

const actionNoOut = action<void, void>(() => {
  return pipe(setStr);
});

execute(actionNoOut);

const testMap = map<{ num: number }, { str: string }>(({ value }) => ({ str: value.num + '' }));

const test = pipe(
  inject({ num: 43, str: 'hello' }),
  testMap
);

const onError = action<Error, { num: number; str: string }>(({ value }) => {
  console.log(value);

  return {} as any;
});

const attemptStuff = attempt(test, onError);

execute(attemptStuff);

const onErrorBis = run<Error>(({ value }) => {
  console.log(value);
});

const attemptStuffBis = attempt(ignoreOutput(test), onErrorBis);

execute(attemptStuffBis);

const paraPart = pipe(
  map<{ num: number }, number>(({ value }) => value.num),
  double
);

const getPostIds = map<string, Promise<string[]>>(({ value: query, api }) => {
  return api.getPostIds(query);
});

const getPost = map<string, Promise<Post>>(({ value: postId, api }) => api.getPost(postId));

const getLikeSum = map<Array<Post>, number>(({ value: posts }) => {
  return posts.reduce((acc, post) => acc + post.likes, 0);
});

const onQuery = pipe(
  map<{ query: string }, string>(({ value }) => value.query),
  getPostIds,
  forEach(getPost),
  mergeWith(getLikeSum, (posts, sum) => ({ posts, sum }))
);

execute(onQuery, { query: 'demo' }).then(res => {
  res.sum;
});

const runAll = parallel(
  mut1,
  // mut2,
  // myAction,
  map<void, number>(() => 42),
  paraPart
);

const paraPara = parallel(mut1, runAll);

callable(paraPara)({ str: 'hello', num: 43 });
execute(paraPara, { str: 'hello', num: 43 });
execute(setStr);

const demoAction = pipe(
  inputType<{ foo: string; bar: string }>(),
  map<{ foo: string }, { foo: string; baz: string }>(() => ({} as any)),
  run<{ foo: string; bar: string; baz: string }>(({ value }) => {
    console.log(value.bar, value.foo, value.baz);
  })
);

execute(demoAction, { foo: 'hey', bar: 'yolo' });

const doSomeStateChange = mutate<void>(({ state }) => {
  state.str = 'bar';
});

const setInput = pipe(
  doSomeStateChange,
  mutate<string>(({ value: input, state }) => {
    state.str = input;
  })
);

execute(setInput, 'hello');

type User = {
  isAwesome: boolean;
  name: string;
};

export const filterAwesomeUser = filter<{ isAwesome: boolean }>(({ value: somethingAwesome }) => {
  return somethingAwesome.isAwesome;
});

export const clickedUser = pipe(
  inputType<User>(),
  filterAwesomeUser,
  action<User, void>(({ value: user }) => {
    console.log(user);
    return noop;
  })
);

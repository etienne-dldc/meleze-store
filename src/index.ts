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
  forEach,
  branch,
} from './lib';
import { string } from 'prop-types';

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

const multi = branch<{ str: string; num: number }>()({
  mut1,
  mut1bis: mut1,
  mut2,
  asyncStuff: map<{ str: string }, Promise<number>>(() => Promise.resolve(42)),
});

const res = execute(multi, { str: 'he', num: 43 }).then(res => {
  res.asyncStuff;
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

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
};

const Api = {
  getPostIds: (query: string): Promise<Array<string>> => ({} as any),
  getPost: (postId: string): Promise<Post> => ({} as any),
};

const getPostIds = map<string, Promise<Array<string>>>(({ value: query }) => {
  return Api.getPostIds(query);
});

const getPost = map<string, Promise<Post>>(({ value: postId }) => Api.getPost(postId));

const getLikeSum = map<Array<Post>, number>(({ value: posts }) => {
  return posts.reduce((acc, post) => acc + post.likes, 0);
});

const onQuery = pipe(
  map<{ query: string }, string>(({ value }) => value.query),
  getPostIds,
  forEach(getPost)
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

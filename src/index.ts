import { map, mutate, pipe, withValue, inject, execute } from './lib';

type State = {
  num: number;
  str: string;
  obj: {
    foo: string;
  };
};

const state: State = {} as any;

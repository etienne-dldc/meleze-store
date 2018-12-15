import { map, mutate, pipe, withValue, inject, execute } from './lib';

const mapStaticSync = map<void, number>(() => 42);
const mapStaticAsync = map<void, Promise<number>>(() => Promise.resolve(42));
const mapSync = map<number, number>(({ value }) => value * 42);
const mapNumToStr = map<number, string>(({ value }) => value + '');
const mapNumToStrAsync = map<number, Promise<string>>(({ value }) => Promise.resolve(value + ''));

const mutStatic = mutate<void>(() => {});
const mutNum = mutate<number>(() => {});
const mutStr = mutate<string>(() => {});

const res1 = pipe(mapStaticSync);
const res2 = pipe(mapStaticAsync);
const res3 = pipe(mapSync);
const res4 = pipe(
  mutNum,
  mapNumToStrAsync,
  mutStr
);
const res5 = pipe(
  mutStatic,
  mutNum,
  map<number, number>(({ value }) => value * 2)
);

const res6 = pipe(
  mutStatic,
  res4,
  withValue(mutNum, 34)
  // inject(43),
  // mutNum,
);

const res7 = pipe(
  mutStatic,
  inject(Promise.resolve(34)),
  map<number, number>(({ value }) => value * 3)
);

pipe(res6);

const out1 = execute(res4, 45);

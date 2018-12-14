export const yolo = {};

type Context<Value> = { value: Value };

type Executable<Input, Output, In, Out> = {
  input: Input;
  output: Output;
  in: In;
  out: Out;
};

type ExecAny = Executable<any, any, any, any>;

function map<Input, Output>(
  _mapper: (ctx: Context<Input>) => Output
): Executable<Input, Output, [Input] extends [void] ? false : true, true> {
  return {} as any;
}

function mutation<Input = void>(
  _act: (ctx: Context<Input>) => void
): Executable<Input, Input, [Input] extends [void] ? false : true, false> {
  return {} as any;
}

type Merge<
  Current extends Executable<any, any, any, any>,
  Added extends Executable<any, any, any, any>,
  level
> = Current extends Executable<infer A, infer B, infer AA, infer BB>
  ? (Added extends Executable<infer C, infer D, infer CC, infer DD>
      ? ([AA, BB, CC, DD] extends [true, true, true, true]
          ? (C extends B ? Executable<A, D, true, true> : { level: level; C: C; B: B; error: 'C must extends B' })
          : [AA, BB, CC, DD] extends [true, true, false, true]
          ? Executable<A, D, true, true>
          : [AA, BB, CC, DD] extends [true, true, true, false]
          ? (C extends B ? Executable<A, C, true, true> : { level: level; C: C; B: B; error: 'C must extends B' })
          : [AA, BB, CC, DD] extends [true, true, false, false]
          ? Executable<A, B, true, true>
          : [AA, BB, CC, DD] extends [false, true, true, true]
          ? (C extends B ? Executable<A, C, false, true> : { level: level; C: C; B: B; error: 'C must extends B' })
          : [AA, BB, CC, DD] extends [false, true, false, true]
          ? Executable<A, D, false, true>
          : [AA, BB, CC, DD] extends [false, true, true, false]
          ? (C extends B ? Executable<A, C, false, true> : { level: level; C: C; B: B; error: 'C must extends B' })
          : [AA, BB, CC, DD] extends [false, true, false, false]
          ? Executable<A, B, false, true>
          : [AA, BB, CC, DD] extends [true, false, true, true]
          ? (C extends A ? Executable<A, D, true, true> : { level: level; C: C; A: A; error: 'C must extends A' })
          : [AA, BB, CC, DD] extends [true, false, false, true]
          ? Executable<A, D, true, true>
          : [AA, BB, CC, DD] extends [true, false, true, false]
          ? (C extends A ? Executable<A, C, true, true> : { level: level; C: C; A: A; error: 'C must extends A' })
          : [AA, BB, CC, DD] extends [true, false, false, false]
          ? Executable<A, A, true, false>
          : [AA, BB, CC, DD] extends [false, false, true, true]
          ? Executable<C, D, true, true>
          : [AA, BB, CC, DD] extends [false, false, false, true]
          ? Executable<A, D, false, true>
          : [AA, BB, CC, DD] extends [false, false, true, false]
          ? Executable<C, C, true, false>
          : [AA, BB, CC, DD] extends [false, false, false, false]
          ? Executable<A, D, false, false>
          : never)
      : never)
  : never;

function pipe<E1 extends ExecAny>(exec1: E1): E1;
function pipe<E1 extends ExecAny, E2 extends ExecAny>(exec1: E1, exec2: E2): Merge<E1, E2, 1>;
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny>(
  exec1: E1,
  exec2: E2,
  exec3: E3
): Merge<Merge<E1, E2, 1>, E3, 2>;

function pipe(..._operators: Array<any>): any {
  return {} as any;
}

const mapStaticSync = map<void, number>(() => 42);
const mapStaticAsync = map<void, Promise<number>>(() => Promise.resolve(42));
const mapSync = map<number, number>(({ value }) => value * 42);
const mapNumToStr = map<number, string>(({ value }) => value + '');
const mapNumToStrAsync = map<number, Promise<string>>(({ value }) => Promise.resolve(value + ''));

const mutStatic = mutation<void>(() => {});
const mutNum = mutation<number>(() => {});
const mutStr = mutation<string>(() => {});

const res1 = pipe(mapStaticSync);
const res2 = pipe(mapStaticAsync);
const res3 = pipe(mapSync);
const res4 = pipe(
  mutNum,
  mapNumToStr,
  mutStr
);
const res5 = pipe(
  mutStatic,
  mutNum,
  map<number, number>(({ value }) => value * 2)
);

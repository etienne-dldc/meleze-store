export const yolo = {};

type Context<Value> = { value: Value };

type Executable<Input, Output, In, Out, Async> = {
  input: Input;
  output: Output;
  in: In;
  out: Out;
  async: Async;
};

type ExecAny = Executable<any, any, any, any, any>;

function map<Input, Output>(
  _mapper: (ctx: Context<Input>) => Output
): Executable<
  Input,
  [Output] extends [Promise<infer U>] ? U : Output,
  [Input] extends [void] ? false : true,
  true,
  [Output] extends [Promise<any>] ? true : false
> {
  return {} as any;
}

function mutation<Input = void>(
  _act: (ctx: Context<Input>) => void
): Executable<Input, Input, [Input] extends [void] ? false : true, false, false> {
  return {} as any;
}

function inject<Value>(
  _val: Value
): Executable<
  [Value] extends [Promise<infer U>] ? U : Value,
  [Value] extends [Promise<infer U>] ? U : Value,
  false,
  true,
  [Value] extends [Promise<any>] ? true : false
> {
  return {} as any;
}

type Or<A, B> = A extends true ? true : (B extends true ? true : false);

// type Test = Or<true, true>

type Merge<Current extends ExecAny, Added extends ExecAny, level> = Current extends Executable<
  infer A,
  infer B,
  infer AA,
  infer BB,
  infer CAsync
>
  ? (Added extends Executable<infer C, infer D, infer CC, infer DD, infer AAsync>
      ? ([AA, BB, CC, DD] extends [true, true, true, true]
          ? (C extends B
              ? Executable<A, D, true, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [true, true, false, true]
          ? Executable<A, D, true, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [true, true, true, false]
          ? (C extends B
              ? Executable<A, C, true, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [true, true, false, false]
          ? Executable<A, B, true, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, true, true, true]
          ? (C extends B
              ? Executable<A, C, false, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [false, true, false, true]
          ? Executable<A, D, false, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, true, true, false]
          ? (C extends B
              ? Executable<A, C, false, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [false, true, false, false]
          ? Executable<A, B, false, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [true, false, true, true]
          ? (C extends A
              ? Executable<A, D, true, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [true, false, false, true]
          ? Executable<A, D, true, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [true, false, true, false]
          ? (C extends A
              ? Executable<A, C, true, true, Or<CAsync, AAsync>>
              : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
          : [AA, BB, CC, DD] extends [true, false, false, false]
          ? Executable<A, A, true, false, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, false, true, true]
          ? Executable<C, D, true, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, false, false, true]
          ? Executable<A, D, false, true, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, false, true, false]
          ? Executable<C, C, true, false, Or<CAsync, AAsync>>
          : [AA, BB, CC, DD] extends [false, false, false, false]
          ? Executable<A, D, false, false, Or<CAsync, AAsync>>
          : never)
      : never)
  : never;

// prettier-ignore
function pipe<E1 extends ExecAny>(exec1: E1): E1;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny>(exec1: E1, exec2: E2): Merge<E1, E2, 2>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3): Merge<Merge<E1, E2, 2>, E3, 3>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>;

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
  inject(43),
  mutNum
);

type Context<Value> = { value: Value };

type Executable<Input, Output, In, Out, Async> = {
  input: Input;
  output: Output;
  requireInput: In;
  transformInput: Out;
  async: Async;
};

type ExecAny = Executable<any, any, boolean, boolean, boolean>;

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

// prettier-ignore
function withValue<Input, Output, Async>(executable: Executable<Input, Output, true, false, Async>, input: Input): Executable<Input, Output, false, false, Async>;
// prettier-ignore
function withValue<Input, Output, Async>(executable: Executable<Input, Output, true, true, Async>, input: Input): Executable<Input, Output, false, true, Async>;

function withValue<Input, Output, Async extends boolean>(
  executable: Executable<Input, Output, true, boolean, Async>,
  input: Input
): Executable<Input, Output, false, boolean, Async> {
  return pipe(
    inject(input),
    executable
  ) as any;
}

type Or<A, B> = A extends true ? true : (B extends true ? true : false);

// prettier-ignore
type Merge<Current extends ExecAny, Added extends ExecAny, level> = (
  Current extends Executable<infer A, infer B, infer AA, infer BB, infer CAsync>
  ? (Added extends Executable<infer C, infer D, infer CC, infer DD, infer AAsync>
      ? (
          [AA, BB, CC, DD] extends [true, true, true, true] ? (C extends B ? Executable<A, D, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, true, false, true] ? Executable<A, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, true, true, false] ? (C extends B ? Executable<A, C, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, true, false, false] ? Executable<A, B, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, true, true, true] ? (C extends B ? Executable<A, C, false, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [false, true, false, true] ? Executable<A, D, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, true, true, false] ? (C extends B ? Executable<A, C, false, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' }) : [AA, BB, CC, DD] extends [false, true, false, false] ? Executable<A, B, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, false, true, true] ? (C extends A ? Executable<A, D, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, false, false, true] ? Executable<A, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, false, true, false] ? (C extends A ? Executable<A, C, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, false, false, false] ? Executable<A, A, true, false, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, true, true] ? Executable<C, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, false, true] ? Executable<A, D, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, true, false] ? Executable<C, C, true, false, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, false, false] ? Executable<A, D, false, false, Or<CAsync, AAsync>>
        : never
      )
      : never)
  : never
);

/*
  var range = num => Array(num).fill(null).map((v, i) => i + 1);
  var types = range(10).map(i => [
    `// prettier-ignore\n`,
    `function pipe<${range(i).map(j => `E${j} extends ExecAny`).join(', ')}>`,
    `(${range(i).map(j => `exec${j}: E${j}`).join(', ')}): `,
    `${range(i-1).map(j => `Merge<`).join('')}E1${range(i-1).map(j => `, E${j+1}, ${j+1}>`).join('')};`
  ].join('')).join('\n');
  copy(types);
  console.log(types);
*/

// prettier-ignore
function pipe<E1 extends ExecAny>(exec1: E1): E1;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny>(exec1: E1, exec2: E2): Merge<E1, E2, 2>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3): Merge<Merge<E1, E2, 2>, E3, 3>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5): Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6): Merge<Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7): Merge<Merge<Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8): Merge<Merge<Merge<Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9): Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>;
// prettier-ignore
function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny, E10 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10): Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>;

function pipe(..._operators: Array<any>): any {
  return {} as any;
}

// prettier-ignore
function execute<Input, Output, Async>(executable: Executable<Input, Output, false, false, Async>): Async extends true ? Promise<void> : void;
// prettier-ignore
function execute<Input, Output, Async>(executable: Executable<Input, Output, false, true, Async>): Async extends true ? Promise<Output> : Output;
// prettier-ignore
function execute<Input, Output, Async>(executable: Executable<Input, Output, true, false, Async>, input: Input): Async extends true ? Promise<Input> : Input;
// prettier-ignore
function execute<Input, Output, Async>(executable: Executable<Input, Output, true, true, Async>, input: Input): Async extends true ? Promise<Output> : Output;

function execute<Input, Output>(_executable: Executable<Input, Output, boolean, boolean, boolean>, _input?: any) {
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

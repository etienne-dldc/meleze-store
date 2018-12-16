type Context<Value> = { value: Value };

export type Executable<Input, Output, In, Out, Async> = {
  input: Input;
  output: Output;
  requireInput: In;
  transformInput: Out;
  async: Async;
};

type ExecAny = Executable<any, any, boolean, boolean, boolean>;

export function map<Input, Output>(
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

export function mutate<Input = void>(
  _act: (ctx: Context<Input>) => void
): Executable<Input, Input, [Input] extends [void] ? false : true, false, false> {
  return {} as any;
}

export function inject<Value>(
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

// prettier-ignore
type PipeMerge<Current extends ExecAny, Added extends ExecAny, level> = (
  Current extends Executable<infer A, infer B, infer AA, infer BB, infer CAsync>
  ? (Added extends Executable<infer C, infer D, infer CC, infer DD, infer AAsync>
      ? (
          [AA, BB, CC, DD] extends [true, true, true, true] ? (C extends B ? Executable<A, D, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, true, false, true] ? Executable<A, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, true, true, false] ? (C extends B ? Executable<A, C, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, true, false, false] ? Executable<A, B, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, true, true, true] ? (C extends B ? Executable<void, C, false, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [false, true, false, true] ? Executable<void, D, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, true, true, false] ? (C extends B ? Executable<void, C, false, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: B; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [false, true, false, false] ? Executable<void, B, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, false, true, true] ? (C extends A ? Executable<A, D, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, false, false, true] ? Executable<A, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [true, false, true, false] ? (C extends A ? Executable<A, C, true, true, Or<CAsync, AAsync>> : { argument: level; Input: C; Output: A; error: 'Invalid Output => Input' })
        : [AA, BB, CC, DD] extends [true, false, false, false] ? Executable<A, void, true, false, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, true, true] ? Executable<C, D, true, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, false, true] ? Executable<void, D, false, true, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, true, false] ? Executable<C, void, true, false, Or<CAsync, AAsync>>
        : [AA, BB, CC, DD] extends [false, false, false, false] ? Executable<void, void, false, false, Or<CAsync, AAsync>>
        : never
      )
      : never)
  : never
);

/*
  var range = num => Array(num).fill(null).map((v, i) => i + 1);
  var types = range(10).map(i => [
    `// prettier-ignore\n`,
    `export function pipe<${range(i).map(j => `E${j} extends ExecAny`).join(', ')}>`,
    `(${range(i).map(j => `exec${j}: E${j}`).join(', ')}): `,
    `${range(i-1).map(j => `PipeMerge<`).join('')}E1${range(i-1).map(j => `, E${j+1}, ${j+1}>`).join('')};`
  ].join('')).join('\n');
  copy(types);
  console.log(types);
*/

// prettier-ignore
export function pipe<E1 extends ExecAny>(exec1: E1): E1;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny>(exec1: E1, exec2: E2): PipeMerge<E1, E2, 2>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3): PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5): PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6): PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7): PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8): PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9): PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>;
// prettier-ignore
export function pipe<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny, E10 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10): PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<PipeMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>;

export function pipe(..._operators: Array<any>): any {
  return {} as any;
}

type ParallelExecutable<Input, Output extends Array<any>, In, Out, Async> = Executable<
  Input,
  Output,
  In,
  Out,
  Async
> & { parallel: true };

type ParallelInput<AA, A, CC, C> = AA extends true ? (CC extends true ? (A & C) : A) : CC extends true ? C : void;

export type IsFinite<Tuple extends any[], Finite, Infinite> = {
  empty: Finite;
  nonEmpty: ((..._: Tuple) => any) extends ((_: infer _First, ..._1: infer Rest) => any)
    ? IsFinite<Rest, Finite, Infinite>
    : never;
  infinite: Infinite;
}[Tuple extends []
  ? 'empty'
  : Tuple extends (infer Element)[]
  ? Element[] extends Tuple
    ? 'infinite'
    : 'nonEmpty'
  : never];

export type Prepend<Tuple extends any[], Addend> = ((_: Addend, ..._1: Tuple) => any) extends ((
  ..._: infer Result
) => any)
  ? Result
  : never;

export type Reverse<Tuple extends any[], Prefix extends any[] = []> = {
  empty: Prefix;
  nonEmpty: ((..._: Tuple) => any) extends ((_: infer First, ..._1: infer Next) => any)
    ? Reverse<Next, Prepend<Prefix, First>>
    : never;
  infinite: {
    ERROR: 'Cannot reverse an infinite tuple';
    CODENAME: 'InfiniteTuple';
  };
}[Tuple extends [any, ...any[]] ? IsFinite<Tuple, 'nonEmpty', 'infinite'> : 'empty'];

type Append<Tuple extends any[], Addend> = Reverse<Prepend<Reverse<Tuple>, Addend>>;

// prettier-ignore
type ParallelMerge<Current extends ExecAny, Added extends ExecAny, _level> = (
  Current extends ParallelExecutable<infer A, infer B, infer AA, infer _BB, infer CAsync>
  ? (Added extends Executable<infer C, infer D, infer CC, infer _DD, infer AAsync>
      ? ParallelExecutable<ParallelInput<AA, A, CC, C>,B extends [...any[]] ? Append<B, D> : never,Or<AA, CC>,true,Or<CAsync, AAsync>>
      : never)
  : Current extends Executable<infer A, infer B, infer AA, infer _BB, infer CAsync>
  ? (Added extends Executable<infer C, infer D, infer CC, infer _DD, infer AAsync>
      ? ParallelExecutable<ParallelInput<AA, A, CC, C>, [B, D], Or<AA, CC>, true, Or<CAsync, AAsync>>
      : never)
  : never
);

/*
  var range = num => Array(num).fill(null).map((v, i) => i + 1);
  var types = range(10).map(i => [
    `// prettier-ignore\n`,
    `export function pipe<${range(i).map(j => `E${j} extends ExecAny`).join(', ')}>`,
    `(${range(i).map(j => `exec${j}: E${j}`).join(', ')}): `,
    `${range(i-1).map(j => `PipeMerge<`).join('')}E1${range(i-1).map(j => `, E${j+1}, ${j+1}>`).join('')};`
  ].join('')).join('\n');
  copy(types);
  console.log(types);
*/

// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny>(exec1: E1, exec2: E2): ParallelMerge<E1, E2, 2>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3): ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny, E10 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>;
// prettier-ignore
export function parallel<E1 extends ExecAny, E2 extends ExecAny, E3 extends ExecAny, E4 extends ExecAny, E5 extends ExecAny, E6 extends ExecAny, E7 extends ExecAny, E8 extends ExecAny, E9 extends ExecAny, E10 extends ExecAny, E11 extends ExecAny>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10, exec11: E11): ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<ParallelMerge<E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>, E11, 11>;

export function parallel(..._operators: Array<any>): any {
  return {} as any;
}

// prettier-ignore
export function execute<Input, Output, Async>(executable: Executable<Input, Output, false, false, Async>): Async extends true ? Promise<void> : void;
// prettier-ignore
export function execute<Input, Output, Async>(executable: Executable<Input, Output, false, true, Async>): Async extends true ? Promise<Output> : Output;
// prettier-ignore
export function execute<Input, Output, Async>(executable: Executable<Input, Output, true, false, Async>, input: Input): Async extends true ? Promise<Input> : Input;
// prettier-ignore
export function execute<Input, Output, Async>(executable: Executable<Input, Output, true, true, Async>, input: Input): Async extends true ? Promise<Output> : Output;

export function execute<Input, Output>(
  _executable: Executable<Input, Output, boolean, boolean, boolean>,
  _input?: any
) {
  return {} as any;
}

// prettier-ignore
export function withValue<Input, Output, Async>(executable: Executable<Input, Output, true, false, Async>, input: Input): Executable<Input, Output, false, false, Async>;
// prettier-ignore
export function withValue<Input, Output, Async>(executable: Executable<Input, Output, true, true, Async>, input: Input): Executable<Input, Output, false, true, Async>;

export function withValue<Input, Output, Async extends boolean>(
  executable: Executable<Input, Output, true, boolean, Async>,
  input: Input
): Executable<Input, Output, false, boolean, Async> {
  return pipe(
    inject(input),
    executable
  ) as any;
}

// prettier-ignore
export function callable<Input, Output, Async>(executable: Executable<Input, Output, false, false, Async>): () => (Async extends true ? Promise<void> : void);
// prettier-ignore
export function callable<Input, Output, Async>(executable: Executable<Input, Output, false, true, Async>): () => (Async extends true ? Promise<Output> : Output);
// prettier-ignore
export function callable<Input, Output, Async>(executable: Executable<Input, Output, true, false, Async>): (input: Input) => (Async extends true ? Promise<Input> : Input);
// prettier-ignore
export function callable<Input, Output, Async>(executable: Executable<Input, Output, true, true, Async>): (input: Input) => (Async extends true ? Promise<Output> : Output);

export function callable<Input, Output>(
  _executable: Executable<Input, Output, boolean, boolean, boolean>,
  _input?: any
) {
  return {} as any;
}

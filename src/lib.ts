export type Context<UserContext, State, Value> = Omit<UserContext, 'state' | 'value'> & { value: Value; state: State };

type EAsync = 'sync' | 'async';
type EType = '>->' | '>--' | '---' | '-->';

type InferAsync<Output> = [Output] extends [Promise<any>] ? 'async' : 'sync';

// prettier-ignore
type BuildType<In extends boolean, Out extends boolean> = (
    [In, Out] extends [false, false] ? '---' :
    [In, Out] extends [false, true] ? '-->' :
    [In, Out] extends [true, false] ? '>--' :
    [In, Out] extends [true, true] ? '>->' :
    never
)

// prettier-ignore
type HasValue<T extends EType> = (
  T extends '>->' ? true :
  T extends '>--' ? true :
  T extends '-->' ? false :
  T extends '---' ? false :
  never
);

// prettier-ignore
type InferType<Input, Output> = (
  [Input, Output] extends [void, void] ? '---' :
  [Input, Output] extends [void, any] ? '-->' :
  [Input, Output] extends [any, void] ? '>--' :
  '>->'
);

// prettier-ignore
type ExecOutput<C, S, E extends ExecAny<C, S>> = (
  E['type'] extends '>->' ? E['output'] :
  E['type'] extends '>--' ? E['input'] :
  E['type'] extends '-->' ? E['output'] :
  E['type'] extends '---' ? void :
  never
);

// prettier-ignore
type WithoutOutput<T extends EType> = (
  T extends '>->' ? '>--' :
  T extends '>--' ? '>--' :
  T extends '-->' ? '---' :
  T extends '---' ? '---' :
  never
);

export type Executable<C, S, Input, Output, Type extends EType, Async extends EAsync> = {
  input: Input;
  output: Output;
  type: Type;
  async: Async;
  context: C;
  state: S;
};

type ExecAny<C, S> = Executable<C, S, any, any, EType, EAsync>;

type AsyncOr<A, B> = [A, B] extends ['sync', 'sync'] ? 'sync' : 'async';

type Or<A, B> = [A, B] extends [false, false] ? false : true;

// can pass A when require B
type Compat<A, B> = A extends B ? true : false;

type IncompatError = 'Received type is not compatible with Required type';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type MergeInOut<In, Out> = [In, Out] extends [object, object] ? Omit<In, keyof Out> & Out : Out;

// prettier-ignore
type PipeMerge<Ctx, S, Current extends ExecAny<Ctx, S>, Added extends ExecAny<Ctx, S>, level> = (
  Current extends Executable<any, any, infer A, infer B, infer T1, infer CAsync>
  ? (Added extends Executable<any, any, infer C, infer D, infer T2, infer AAsync>
      ? (
          [T1, T2] extends ['>->', '>->'] ? (Compat<B, C> extends true ? Executable<Ctx, S, A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: B })
        : [T1, T2] extends ['>->', '-->'] ? Executable<Ctx, S, A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>->', '>--'] ? (Compat<B, C> extends true ? Executable<Ctx, S, A, MergeInOut<A, C>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: B })
        : [T1, T2] extends ['>->', '---'] ? Executable<Ctx, S, A, MergeInOut<A, B>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['-->', '>->'] ? (Compat<B, C> extends true ? Executable<Ctx, S, void, MergeInOut<B, D>, '-->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: B })
        : [T1, T2] extends ['-->', '-->'] ? Executable<Ctx, S, void, D, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['-->', '>--'] ? (Compat<B, C> extends true ? Executable<Ctx, S, void, C, '-->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: B })
        : [T1, T2] extends ['-->', '---'] ? Executable<Ctx, S, void, B, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>--', '>->'] ? (Compat<A, C> extends true ? Executable<Ctx, S, A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: A })
        : [T1, T2] extends ['>--', '-->'] ? Executable<Ctx, S, A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>--', '>--'] ? (Compat<A, C> extends true ? Executable<Ctx, S, A, MergeInOut<A, C>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, types: [T1, T2], required: C, received: A })
        : [T1, T2] extends ['>--', '---'] ? Executable<Ctx, S, A, void, '>--', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '>->'] ? Executable<Ctx, S, C, MergeInOut<C, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '-->'] ? Executable<Ctx, S, void, D, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '>--'] ? Executable<Ctx, S, C, void, '>--', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '---'] ? Executable<Ctx, S, void, void, '-->', AsyncOr<CAsync, AAsync>>
        : never
      )
      : never) // { error: 'Invalid added' })
  : never // { error: 'Invalid current', argument: level }
);

// prettier-ignore
type ParallelExecutable<C, S, Input, Output extends Array<any>, T extends EType, Async extends EAsync> = (
  Executable<C, S, Input ,Output ,T ,Async> &
  { parallel: true }
);

// prettier-ignore
type ParallelInput<T1 extends EType, I1, T2 extends EType, I2> = (
  [HasValue<T1>, HasValue<T2>] extends [true, true] ? (I1 & I2) :
  [HasValue<T1>, HasValue<T2>] extends [true, false] ? I1 :
  [HasValue<T1>, HasValue<T2>] extends [false, true] ? I2 :
  [HasValue<T1>, HasValue<T2>] extends [false, false] ? void :
  never
);

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

type ParallelMergeTypes<T1 extends EType, T2 extends EType> = Or<HasValue<T1>, HasValue<T2>> extends true
  ? '-->'
  : '>->';

// prettier-ignore
type ParallelMerge<C, S, Current extends ExecAny<C, S>, Added extends ExecAny<C, S>, _level> = (
  [Current, Added] extends [ParallelExecutable<C, S, infer I1, infer O1, infer T1, infer A1>, Executable<C, S, infer I2, infer O2, infer T2, infer A2>] ? (
    ParallelExecutable<C, S, ParallelInput<T1, I1, T2, I2>, O1 extends [...any[]] ? Append<O1, O2> : never, ParallelMergeTypes<T1, T2>, AsyncOr<A1, A2>>
  ) :
  [Current, Added] extends [Executable<C, S, infer I1, infer O1, infer T1, infer A1>, Executable<C, S, infer I2, infer O2, infer T2, infer A2>] ? (
    ParallelExecutable<C, S, ParallelInput<T1, I1, T2, I2>, [O1, O2], ParallelMergeTypes<T1, T2>, AsyncOr<A1, A2>>
  ) :
  never
);

type BranchObj<C, S> = {
  [key: string]: ExecAny<C, S>;
};

// prettier-ignore
type BranchOutputItem<C, S, Input, E extends ExecAny<C, S>> = (
  E['type'] extends '>->' ? MergeInOut<Input, E['output']> :
  E['type'] extends '>--' ? Input :
  E['type'] extends '-->' ? MergeInOut<Input, E['output']> :
  E['type'] extends '---' ? Input :
  never
);

type BranchOutput<C, S, Input, Execs extends BranchObj<C, S>> = {
  [K in keyof Execs]: BranchOutputItem<C, S, Input, Execs[K]>
};

type BranchAsync<C, S, Execs extends BranchObj<C, S>> = Execs extends {
  [K in keyof Execs]: Executable<C, S, any, any, EType, 'sync'>
}
  ? 'sync'
  : 'async';

type BranchCompat<C, S, Input, Execs extends BranchObj<C, S>> = {
  [K in keyof Execs]: HasValue<Execs[K]['type']> extends false ? true : (Compat<Input, Execs[K]['input']>)
} extends { [K in keyof Execs]: true }
  ? true
  : false;

export function createOperators<UserContext, State>(): Operators<UserContext, State> {
  return {} as any;
}

export type Operators<C, S> = {
  map<Input, Output>(
    _mapper: (ctx: Context<C, S, Input>) => Output
  ): Executable<
    C,
    S,
    Input,
    [Output] extends [Promise<infer U>] ? U : Output,
    [Input] extends [void] ? '-->' : '>->',
    InferAsync<Output>
  >;

  mutate<Input = void>(
    _act: (ctx: Context<C, S, Input>) => void
  ): Executable<C, S, Input, void, [Input] extends [void] ? '---' : '>--', 'sync'>;

  run<Input = void>(
    _act: (ctx: Context<C, S, Input>) => void
  ): Executable<C, S, Input, void, [Input] extends [void] ? '---' : '>--', 'sync'>;

  ignoreOutput<E extends ExecAny<C, S>>(
    _exec: E
  ): Executable<C, S, E['input'], void, WithoutOutput<E['type']>, E['async']>;

  inject<Value>(
    _val: Value
  ): Executable<C, S, void, [Value] extends [Promise<infer U>] ? U : Value, '-->', InferAsync<Value>>;

  inputType<Input>(): Executable<C, S, Input, void, '>--', 'sync'>;

  /*
    var range = num => Array(num).fill(null).map((v, i) => i + 1);
    var types = range(10).map(i => [
      `  // prettier-ignore\n`,
      `  pipe<${range(i).map(j => `E${j} extends ExecAny<C, S>`).join(', ')}>`,
      `(${range(i).map(j => `exec${j}: E${j}`).join(', ')}): `,
      `${range(i-1).map(j => `PipeMerge<C, S, `).join('')}E1${range(i-1).map(j => `, E${j+1}, ${j+1}>`).join('')};`
    ].join('')).join('\n');
    copy(types);
    console.log(types);
  */
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>>(exec1: E1): E1;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>>(exec1: E1, exec2: E2): PipeMerge<C, S, E1, E2, 2>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3): PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>, E9 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>;
  // prettier-ignore
  pipe<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>, E9 extends ExecAny<C, S>, E10 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10): PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, PipeMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>;

  /*
    var range = num => Array(num).fill(null).map((v, i) => i + 1);
    var types = range(10).map(i => [
      `  // prettier-ignore\n`,
      `  parallel<${range(i).map(j => `E${j} extends ExecAny<C, S>`).join(', ')}>`,
      `(${range(i).map(j => `exec${j}: E${j}`).join(', ')}): `,
      `${range(i-1).map(j => `ParallelMerge<C, S, `).join('')}E1${range(i-1).map(j => `, E${j+1}, ${j+1}>`).join('')};`
    ].join('')).join('\n');
    copy(types);
    console.log(types);
  */
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>>(exec1: E1): E1;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>>(exec1: E1, exec2: E2): ParallelMerge<C, S, E1, E2, 2>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3): ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>, E9 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>;
  // prettier-ignore
  parallel<E1 extends ExecAny<C, S>, E2 extends ExecAny<C, S>, E3 extends ExecAny<C, S>, E4 extends ExecAny<C, S>, E5 extends ExecAny<C, S>, E6 extends ExecAny<C, S>, E7 extends ExecAny<C, S>, E8 extends ExecAny<C, S>, E9 extends ExecAny<C, S>, E10 extends ExecAny<C, S>>(exec1: E1, exec2: E2, exec3: E3, exec4: E4, exec5: E5, exec6: E6, exec7: E7, exec8: E8, exec9: E9, exec10: E10): ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, ParallelMerge<C, S, E1, E2, 2>, E3, 3>, E4, 4>, E5, 5>, E6, 6>, E7, 7>, E8, 8>, E9, 9>, E10, 10>;

  mergeWith<Exec extends ExecAny<C, S>, Output>(
    _exec: Exec,
    _merge: (
      input: HasValue<Exec['type']> extends true ? Exec['input'] : void,
      output: ExecOutput<C, S, Exec>
    ) => Output
  ): Executable<C, S, Exec['input'], Output, BuildType<HasValue<Exec['type']>, true>, Exec['async']>;

  // prettier-ignore
  action<Input, Output>(
    _act: (ctx: Context<C, S, Input>) => (
      | Executable<C, S, void, Output extends Promise<infer U> ? U : Output, [Output] extends [void] ? '---' : '-->', InferAsync<Output>>
      | Executable<C, S, Input, Output extends Promise<infer U> ? U : Output, [Output] extends [void] ? '>--' : '>->', InferAsync<Output>>
    )
  ): Executable<C, S, Input, Output, InferType<Input, Output>, InferAsync<Output>>;

  attempt<Exec extends ExecAny<C, S>>(
    _action: Exec,
    _onError: Executable<
      C,
      S,
      any,
      Exec['output'],
      BuildType<true, ExecOutput<C, S, Exec> extends void ? false : true>,
      Exec['async']
    >
  ): Exec;

  forEach<Exec extends ExecAny<C, S>>(
    _exec: Exec
  ): Executable<C, S, Array<Exec['input']>, Array<Exec['output']>, Exec['type'], Exec['async']>;

  noop: Executable<C, S, any, any, '---', 'sync'>;

  // prettier-ignore
  execute<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '---', Async>): Async extends 'async' ? Promise<void> : void;
  // prettier-ignore
  execute<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '-->', Async>): Async extends 'async' ? Promise<Output> : Output;
  // prettier-ignore
  execute<E extends Executable<C, S, any, any, '>--', EAsync>>(executable: E, input: E['input']): E['async'] extends 'async' ? Promise<E['input']> : E['input'];
  // prettier-ignore
  execute<E extends Executable<C, S, any, any, '>->', EAsync>>(executable: E, input: E['input']): E['async'] extends 'async' ? Promise<E['output']> : E['output'];

  withValue<Value, E extends Executable<C, S, any, any, EType, EAsync>>(
    executable: E,
    input: Value
  ): HasValue<E['type']> extends true
    ? (Compat<Value, E['input']> extends true
        ? (Executable<C, S, void, ExecOutput<C, S, E> extends void ? Value : ExecOutput<C, S, E>, '-->', E['async']>)
        : { error: true })
    : Executable<C, S, void, ExecOutput<C, S, E> extends void ? Value : ExecOutput<C, S, E>, '-->', E['async']>;

  validate<E extends ExecAny<C, S>>(exec: E): E;

  // prettier-ignore
  callable<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '---', Async>): () => (Async extends 'async' ? Promise<void> : void);
  // prettier-ignore
  callable<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '-->', Async>): () => (Async extends 'async' ? Promise<Output> : Output);
  // prettier-ignore
  callable<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '>--', Async>): (input: Input) => (Async extends 'async' ? Promise<Input> : Input);
  // prettier-ignore
  callable<Input, Output, Async extends EAsync>(executable: Executable<C, S, Input, Output, '>->', Async>): (input: Input) => (Async extends 'async' ? Promise<Output> : Output);

  // Use _ wen TS 3.3 is out !
  // prettier-ignore
  branch<Input = void>(): (
    <Execs extends BranchObj<C, S>>(_execs: Execs) => (
      BranchCompat<C, S, Input, Execs> extends true
      ? Executable<C, S, Input, BranchOutput<C, S, Input, Execs>, BuildType<[Input] extends [void] ? false : true, true>, BranchAsync<C, S, Execs>>
      : { error: { [K in keyof Execs]: HasValue<Execs[K]['type']> extends false ? true : (Compat<Input, Execs[K]['input']> extends false ? { error: IncompatError; required: Execs[K]['input']; received: Input }: true)}; }
    )
  );
};

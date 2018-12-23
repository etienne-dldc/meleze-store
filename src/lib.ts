export type Context<Value> = { value: Value };

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
type WithValue<T extends EType> = (
  T extends '>->' ? '>->' :
  T extends '>--' ? '>--' :
  T extends '-->' ? '>->' :
  T extends '---' ? '>--'
  : never
);

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
type ExecOutput<E extends ExecAny> = (
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

export type Executable<Input, Output, Type extends EType, Async extends EAsync> = {
  input: Input;
  output: Output;
  type: Type;
  async: Async;
};

type ExecAny = Executable<any, any, EType, EAsync>;

export function map<Input, Output>(
  _mapper: (ctx: Context<Input>) => Output
): Executable<
  Input,
  [Output] extends [Promise<infer U>] ? U : Output,
  [Input] extends [void] ? '-->' : '>->',
  InferAsync<Output>
> {
  return {} as any;
}

export function mutate<Input = void>(
  _act: (ctx: Context<Input>) => void
): Executable<Input, void, [Input] extends [void] ? '---' : '>--', 'sync'> {
  return {} as any;
}

export function run<Input = void>(
  _act: (ctx: Context<Input>) => void
): Executable<Input, void, [Input] extends [void] ? '---' : '>--', 'sync'> {
  return {} as any;
}

export function ignoreOutput<E extends ExecAny>(
  _exec: E
): Executable<E['input'], void, WithoutOutput<E['type']>, E['async']> {
  return {} as any;
}

export function inject<Value>(
  _val: Value
): Executable<void, [Value] extends [Promise<infer U>] ? U : Value, '-->', InferAsync<Value>> {
  return {} as any;
}

export function inputType<Input>(): Executable<Input, void, '>--', 'sync'> {
  return {} as any;
}

type AsyncOr<A, B> = [A, B] extends ['sync', 'sync'] ? 'sync' : 'async';

type Or<A, B> = [A, B] extends [false, false] ? false : true;

// can pass A when require B
type Compat<A, B> = A extends B ? true : false;

type IncompatError = 'Received type is not compatible with Required type';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type MergeInOut<In, Out> = [In, Out] extends [object, object] ? Omit<In, keyof Out> & Out : Out;

// prettier-ignore
type PipeMerge<Current extends ExecAny, Added extends ExecAny, level> = (
  Current extends Executable<infer A, infer B, infer T1, infer CAsync>
  ? (Added extends Executable<infer C, infer D, infer T2, infer AAsync>
      ? (
          [T1, T2] extends ['>->', '>->'] ? (Compat<B, C> extends true ? Executable<A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: B })
        : [T1, T2] extends ['>->', '-->'] ? Executable<A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>->', '>--'] ? (Compat<B, C> extends true ? Executable<A, MergeInOut<A, C>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: B })
        : [T1, T2] extends ['>->', '---'] ? Executable<A, MergeInOut<A, C>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['-->', '>->'] ? (Compat<B, C> extends true ? Executable<void, D, '-->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: B })
        : [T1, T2] extends ['-->', '-->'] ? Executable<void, D, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['-->', '>--'] ? (Compat<B, C> extends true ? Executable<void, C, '-->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: B })
        : [T1, T2] extends ['-->', '---'] ? Executable<void, B, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>--', '>->'] ? (Compat<A, C> extends true ? Executable<A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: A })
        : [T1, T2] extends ['>--', '-->'] ? Executable<A, MergeInOut<A, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['>--', '>--'] ? (Compat<A, C> extends true ? Executable<A, MergeInOut<A, C>, '>->', AsyncOr<CAsync, AAsync>> : { error: IncompatError, argument: level, required: C, received: A })
        : [T1, T2] extends ['>--', '---'] ? Executable<A, void, '>--', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '>->'] ? Executable<C, MergeInOut<C, D>, '>->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '-->'] ? Executable<void, D, '-->', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '>--'] ? Executable<C, void, '>--', AsyncOr<CAsync, AAsync>>
        : [T1, T2] extends ['---', '---'] ? Executable<void, void, '-->', AsyncOr<CAsync, AAsync>>
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

// prettier-ignore
type ParallelExecutable<Input, Output extends Array<any>, T extends EType, Async extends EAsync> = (
  Executable<Input ,Output ,T ,Async> &
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
type ParallelMerge<Current extends ExecAny, Added extends ExecAny, _level> = (
  [Current, Added] extends [ParallelExecutable<infer I1, infer O1, infer T1, infer A1>, Executable<infer I2, infer O2, infer T2, infer A2>] ? (
    ParallelExecutable<ParallelInput<T1, I1, T2, I2>, O1 extends [...any[]] ? Append<O1, O2> : never, ParallelMergeTypes<T1, T2>, AsyncOr<A1, A2>>
  ) :
  [Current, Added] extends [Executable<infer I1, infer O1, infer T1, infer A1>, Executable<infer I2, infer O2, infer T2, infer A2>] ? (
    ParallelExecutable<ParallelInput<T1, I1, T2, I2>, [O1, O2], ParallelMergeTypes<T1, T2>, AsyncOr<A1, A2>>
  ) :
  never
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

type BranchObj = {
  [key: string]: ExecAny;
};

type BranchOutput<Execs extends BranchObj> = { [K in keyof Execs]: ExecOutput<Execs[K]> };

type BranchAsync<Execs extends BranchObj> = Execs extends { [K in keyof Execs]: Executable<any, any, EType, 'sync'> }
  ? 'sync'
  : 'async';

type BranchCompat<Input, Execs extends BranchObj> = {
  [K in keyof Execs]: HasValue<Execs[K]['type']> extends false ? true : (Compat<Input, Execs[K]['input']>)
} extends { [K in keyof Execs]: true }
  ? true
  : false;

type BranchInput<Execs extends BranchObj> = {
  [K in keyof Execs]: HasValue<Execs[K]['type']> extends false ? void : Execs[K]['input']
}[keyof Execs];

// prettier-ignore
export function branch<Input = void>(): (
  <Execs extends BranchObj>(_execs: Execs) => (
    BranchCompat<Input, Execs> extends true
    ? Executable<Input, BranchOutput<Execs>, BuildType<[Input] extends [void] ? false : true, true>, BranchAsync<Execs>>
    : { error: { [K in keyof Execs]: HasValue<Execs[K]['type']> extends false ? true : (Compat<Input, Execs[K]['input']> extends false ? { error: IncompatError; required: Execs[K]['input']; received: Input }: true)}; }
  )
) {
  return {} as any;
}

export function action<Input, Output>(
  _act: (
    ctx: Context<Input>
  ) => Executable<
    void,
    Output extends Promise<infer U> ? U : Output,
    [Output] extends [void] ? '---' : '-->',
    InferAsync<Output>
  >
): Executable<Input, Output, InferType<Input, Output>, InferAsync<Output>> {
  return {} as any;
}

export function attempt<Exec extends ExecAny>(
  _action: Exec,
  _onError: HasValue<Exec['type']> extends true
    ? Executable<any, Exec['output'], WithValue<Exec['type']>, Exec['async']>
    : Executable<any, Exec['output'], '>--', Exec['async']>
): Exec {
  return {} as any;
}

export function forEach<Exec extends ExecAny>(
  _exec: Exec
): Executable<Array<Exec['input']>, Array<Exec['output']>, Exec['type'], Exec['async']> {
  return {} as any;
}

export const noop: Executable<any, any, '---', 'sync'> = {} as any;

// prettier-ignore
export function execute<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '---', Async>): Async extends 'async' ? Promise<void> : void;
// prettier-ignore
export function execute<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '-->', Async>): Async extends 'async' ? Promise<Output> : Output;
// prettier-ignore
export function execute<E extends Executable<any, any, '>--', EAsync>>(executable: E, input: E['input']): E['async'] extends 'async' ? Promise<E['input']> : E['input'];
// prettier-ignore
export function execute<E extends Executable<any, any, '>->', EAsync>>(executable: E, input: E['input']): E['async'] extends 'async' ? Promise<E['output']> : E['output'];

export function execute<Input, Output>(_executable: Executable<Input, Output, EType, EAsync>, _input?: any) {
  return {} as any;
}

export function withValue<Value, E extends Executable<any, any, EType, EAsync>>(
  executable: E,
  input: Value
): HasValue<E['type']> extends true
  ? (Compat<Value, E['input']> extends true
      ? (Executable<void, ExecOutput<E> extends void ? Value : ExecOutput<E>, '-->', E['async']>)
      : { error: true })
  : Executable<void, ExecOutput<E> extends void ? Value : ExecOutput<E>, '-->', E['async']> {
  return pipe(
    inject(input),
    executable
  ) as any;
}

export function validate<E extends ExecAny>(exec: E): E {
  return exec;
}

// prettier-ignore
export function callable<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '---', Async>): () => (Async extends 'async' ? Promise<void> : void);
// prettier-ignore
export function callable<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '-->', Async>): () => (Async extends 'async' ? Promise<Output> : Output);
// prettier-ignore
export function callable<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '>--', Async>): (input: Input) => (Async extends 'async' ? Promise<Input> : Input);
// prettier-ignore
export function callable<Input, Output, Async extends EAsync>(executable: Executable<Input, Output, '>->', Async>): (input: Input) => (Async extends 'async' ? Promise<Output> : Output);

export function callable<Input, Output>(_executable: Executable<Input, Output, EType, EAsync>, _input?: any) {
  return {} as any;
}

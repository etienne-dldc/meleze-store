import { Executable, Context, Callable, CallableInternal } from './types';

export type SomeTrue<Vals extends Array<any>> = Vals extends Array<false> ? false : true;

export function value<Output>(
  value: Output
): Output extends Promise<infer U> ? Executable<any, U, true, false> : Executable<any, Output, false, false> {
  return {} as any;
}

export function map<Input, Output>(mapper: (ctx: Context<Input>) => Output): Callable<Input, Output> {
  return {} as any;
}

export function action<Input, Output>(
  act: (ctx: Context<Input>) => Executable<Input, Output, boolean, boolean>
): Callable<Input, Output> {
  return {} as any;
}

export function run<Input>(act: (ctx: Context<Input>) => void): Callable<Input, Input> {
  return {} as any;
}

export function mutation<Input>(act: (ctx: Context<Input>) => void): Callable<Input, Input> {
  return {} as any;
}

/**
var range = num => Array(num).fill(null).map((v, i) => i);
range(10).map(i => [
  `// prettier-ignore\n`,
  `export function pipe<Input, NeedInput, ${range(i + 1).map(v => v+1).map(j => `O${j}, A${j}`).join(', ')}>`,
  `(${range(i + 1).map(v => v+1).map(j => `exec${j}: Executable<${j === 1 ? 'Input' : `O${j - 1}`}, O${j}, A${j}, ${j === 1 ? `NeedInput` : `any`}>`).join(', ')}): `,
  `CallableInternal<Input, O${i + 1}, SomeTrue<[${range(i + 1).map(v => v+1).map(j => `A${j}`).join(', ')}]>, NeedInput>;`
].join('')).join('\n');
//  **/

// prettier-ignore
export function pipe<Input, NeedInput, O1, A1>(exec1: Executable<Input, O1, A1, NeedInput>): CallableInternal<Input, O1, SomeTrue<[A1]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>): CallableInternal<Input, O2, SomeTrue<[A1, A2]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>): CallableInternal<Input, O3, SomeTrue<[A1, A2, A3]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>): CallableInternal<Input, O4, SomeTrue<[A1, A2, A3, A4]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>): CallableInternal<Input, O5, SomeTrue<[A1, A2, A3, A4, A5]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>, exec6: Executable<O5, O6, A6, any>): CallableInternal<Input, O6, SomeTrue<[A1, A2, A3, A4, A5, A6]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>, exec6: Executable<O5, O6, A6, any>, exec7: Executable<O6, O7, A7, any>): CallableInternal<Input, O7, SomeTrue<[A1, A2, A3, A4, A5, A6, A7]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>, exec6: Executable<O5, O6, A6, any>, exec7: Executable<O6, O7, A7, any>, exec8: Executable<O7, O8, A8, any>): CallableInternal<Input, O8, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8, O9, A9>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>, exec6: Executable<O5, O6, A6, any>, exec7: Executable<O6, O7, A7, any>, exec8: Executable<O7, O8, A8, any>, exec9: Executable<O8, O9, A9, any>): CallableInternal<Input, O9, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>, NeedInput>;
// prettier-ignore
export function pipe<Input, NeedInput, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8, O9, A9, O10, A10>(exec1: Executable<Input, O1, A1, NeedInput>, exec2: Executable<O1, O2, A2, any>, exec3: Executable<O2, O3, A3, any>, exec4: Executable<O3, O4, A4, any>, exec5: Executable<O4, O5, A5, any>, exec6: Executable<O5, O6, A6, any>, exec7: Executable<O6, O7, A7, any>, exec8: Executable<O7, O8, A8, any>, exec9: Executable<O8, O9, A9, any>, exec10: Executable<O9, O10, A10, any>): CallableInternal<Input, O10, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>, NeedInput>;

export function pipe<Input, NeedInput extends boolean>(
  firstOperator: Executable<Input, any, any, NeedInput>,
  ...otherOperators: Array<Executable<any, any, any, any>>
): CallableInternal<Input, any, any, NeedInput> {
  return {} as any;
}

/**
var range = num => Array(num).fill(null).map((v, i) => i);
range(10).map(i => [
  `// prettier-ignore\n`,
  `export function parallel<${range(i + 1).map(v => v+1).map(j => `I${j}, O${j}, A${j}, N${j}`).join(', ')}>`,
  `(${range(i + 1).map(v => v+1).map(j => `exec${j}: Executable<I${j}, O${j}, A${j}, N${j}>`).join(', ')}): `,
  `CallableInternal<(${range(i + 1).map(v => v+1).map(j => `(N${j} extends true ? I${j} : {})`).join(' & ')}), [${range(i + 1).map(v => v+1).map(j => `O${j}`).join(', ')}], SomeTrue<[${range(i + 1).map(v => v+1).map(j => `A${j}`).join(', ')}]>, SomeTrue<[${range(i + 1).map(v => v+1).map(j => `N${j}`).join(', ')}]>>;`
].join('')).join('\n');
//  **/

// prettier-ignore
export function parallel<I1, O1, A1, N1>(exec1: Executable<I1, O1, A1, N1>): CallableInternal<((N1 extends true ? I1 : {})), [O1], SomeTrue<[A1]>, SomeTrue<[N1]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {})), [O1, O2], SomeTrue<[A1, A2]>, SomeTrue<[N1, N2]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {})), [O1, O2, O3], SomeTrue<[A1, A2, A3]>, SomeTrue<[N1, N2, N3]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {})), [O1, O2, O3, O4], SomeTrue<[A1, A2, A3, A4]>, SomeTrue<[N1, N2, N3, N4]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {})), [O1, O2, O3, O4, O5], SomeTrue<[A1, A2, A3, A4, A5]>, SomeTrue<[N1, N2, N3, N4, N5]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5, I6, O6, A6, N6>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>, exec6: Executable<I6, O6, A6, N6>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {}) & (N6 extends true ? I6 : {})), [O1, O2, O3, O4, O5, O6], SomeTrue<[A1, A2, A3, A4, A5, A6]>, SomeTrue<[N1, N2, N3, N4, N5, N6]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5, I6, O6, A6, N6, I7, O7, A7, N7>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>, exec6: Executable<I6, O6, A6, N6>, exec7: Executable<I7, O7, A7, N7>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {}) & (N6 extends true ? I6 : {}) & (N7 extends true ? I7 : {})), [O1, O2, O3, O4, O5, O6, O7], SomeTrue<[A1, A2, A3, A4, A5, A6, A7]>, SomeTrue<[N1, N2, N3, N4, N5, N6, N7]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5, I6, O6, A6, N6, I7, O7, A7, N7, I8, O8, A8, N8>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>, exec6: Executable<I6, O6, A6, N6>, exec7: Executable<I7, O7, A7, N7>, exec8: Executable<I8, O8, A8, N8>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {}) & (N6 extends true ? I6 : {}) & (N7 extends true ? I7 : {}) & (N8 extends true ? I8 : {})), [O1, O2, O3, O4, O5, O6, O7, O8], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8]>, SomeTrue<[N1, N2, N3, N4, N5, N6, N7, N8]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5, I6, O6, A6, N6, I7, O7, A7, N7, I8, O8, A8, N8, I9, O9, A9, N9>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>, exec6: Executable<I6, O6, A6, N6>, exec7: Executable<I7, O7, A7, N7>, exec8: Executable<I8, O8, A8, N8>, exec9: Executable<I9, O9, A9, N9>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {}) & (N6 extends true ? I6 : {}) & (N7 extends true ? I7 : {}) & (N8 extends true ? I8 : {}) & (N9 extends true ? I9 : {})), [O1, O2, O3, O4, O5, O6, O7, O8, O9], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>, SomeTrue<[N1, N2, N3, N4, N5, N6, N7, N8, N9]>>;
// prettier-ignore
export function parallel<I1, O1, A1, N1, I2, O2, A2, N2, I3, O3, A3, N3, I4, O4, A4, N4, I5, O5, A5, N5, I6, O6, A6, N6, I7, O7, A7, N7, I8, O8, A8, N8, I9, O9, A9, N9, I10, O10, A10, N10>(exec1: Executable<I1, O1, A1, N1>, exec2: Executable<I2, O2, A2, N2>, exec3: Executable<I3, O3, A3, N3>, exec4: Executable<I4, O4, A4, N4>, exec5: Executable<I5, O5, A5, N5>, exec6: Executable<I6, O6, A6, N6>, exec7: Executable<I7, O7, A7, N7>, exec8: Executable<I8, O8, A8, N8>, exec9: Executable<I9, O9, A9, N9>, exec10: Executable<I10, O10, A10, N10>): CallableInternal<((N1 extends true ? I1 : {}) & (N2 extends true ? I2 : {}) & (N3 extends true ? I3 : {}) & (N4 extends true ? I4 : {}) & (N5 extends true ? I5 : {}) & (N6 extends true ? I6 : {}) & (N7 extends true ? I7 : {}) & (N8 extends true ? I8 : {}) & (N9 extends true ? I9 : {}) & (N10 extends true ? I10 : {})), [O1, O2, O3, O4, O5, O6, O7, O8, O9, O10], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>, SomeTrue<[N1, N2, N3, N4, N5, N6, N7, N8, N9, N10]>>;

export function parallel(
  ...otherOperators: Array<Executable<any, any, any, any>>
): CallableInternal<any, Array<any>, any, any> {
  return {} as any;
}

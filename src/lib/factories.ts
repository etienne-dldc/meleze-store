import {
  Context,
  CallableInfered,
  Callable,
  ExecutableType,
  ExecutableInfered,
  ExecutableInternal,
  Executable,
  CallableInternal,
} from './types';

export type SomeTrue<Vals extends Array<any>> = Vals extends Array<false> ? false : true;

export function createOperators<State, Effects>() {
  function inject<Output>(_value: Output): ExecutableInfered<State, Effects, any, Output, false> {
    return {} as any;
  }

  function map<Input, Output>(
    _mapper: (ctx: Context<State, Effects, Input>) => Output
  ): CallableInfered<State, Effects, Input, Output> {
    return {} as any;
  }

  function action<Input, Output>(
    _act: (ctx: Context<State, Effects, Input>) => Executable<State, Effects, Input, Output, ExecutableType.Any>
  ): CallableInfered<State, Effects, Input, Output> {
    return {} as any;
  }

  function run<Input = void>(
    _act: (ctx: Context<State, Effects, Input>) => void
  ): CallableInfered<State, Effects, Input, Input> {
    return {} as any;
  }

  function mutation<Input = void>(
    _act: (ctx: Context<State, Effects, Input>) => void
  ): CallableInfered<State, Effects, Input, Input> {
    return {} as any;
  }

  /**
  var range = num => Array(num).fill(null).map((v, i) => i + 1);
  var types = range(10).map(i => [
    `\t// prettier-ignore\n`,
    `\tfunction pipe<S, E, Input, Dynamic, ${range(i).map(j => `O${j}, A${j}`).join(', ')}>`,
    `(${range(i).map(j => `exec${j}: ExecutableInternal<S, E, ${j === 1 ? 'Input' : `O${j - 1}`}, O${j}, A${j}, ${j === 1 ? `Dynamic` : `boolean`}>`).join(', ')}): `,
    `CallableInternal<S, E, Dynamic extends false ? any : Input, O${i}, SomeTrue<[${range(i).map(j => `A${j}`).join(', ')}]>, Dynamic>;`
  ].join('')).join('\n');
  copy(types);
  console.log(types);
  //  **/

  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>): CallableInternal<S, E, Dynamic extends false ? any : Input, O1, SomeTrue<[A1]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O2, SomeTrue<[A1, A2]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O3, SomeTrue<[A1, A2, A3]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O4, SomeTrue<[A1, A2, A3, A4]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O5, SomeTrue<[A1, A2, A3, A4, A5]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>, exec6: ExecutableInternal<S, E, O5, O6, A6, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O6, SomeTrue<[A1, A2, A3, A4, A5, A6]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>, exec6: ExecutableInternal<S, E, O5, O6, A6, boolean>, exec7: ExecutableInternal<S, E, O6, O7, A7, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O7, SomeTrue<[A1, A2, A3, A4, A5, A6, A7]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>, exec6: ExecutableInternal<S, E, O5, O6, A6, boolean>, exec7: ExecutableInternal<S, E, O6, O7, A7, boolean>, exec8: ExecutableInternal<S, E, O7, O8, A8, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O8, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8, O9, A9>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>, exec6: ExecutableInternal<S, E, O5, O6, A6, boolean>, exec7: ExecutableInternal<S, E, O6, O7, A7, boolean>, exec8: ExecutableInternal<S, E, O7, O8, A8, boolean>, exec9: ExecutableInternal<S, E, O8, O9, A9, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O9, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>, Dynamic>;
  // prettier-ignore
  function pipe<S, E, Input, Dynamic, O1, A1, O2, A2, O3, A3, O4, A4, O5, A5, O6, A6, O7, A7, O8, A8, O9, A9, O10, A10>(exec1: ExecutableInternal<S, E, Input, O1, A1, Dynamic>, exec2: ExecutableInternal<S, E, O1, O2, A2, boolean>, exec3: ExecutableInternal<S, E, O2, O3, A3, boolean>, exec4: ExecutableInternal<S, E, O3, O4, A4, boolean>, exec5: ExecutableInternal<S, E, O4, O5, A5, boolean>, exec6: ExecutableInternal<S, E, O5, O6, A6, boolean>, exec7: ExecutableInternal<S, E, O6, O7, A7, boolean>, exec8: ExecutableInternal<S, E, O7, O8, A8, boolean>, exec9: ExecutableInternal<S, E, O8, O9, A9, boolean>, exec10: ExecutableInternal<S, E, O9, O10, A10, boolean>): CallableInternal<S, E, Dynamic extends false ? any : Input, O10, SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>, Dynamic>;

  function pipe<State, Effects, Input, Dynamic>(
    _firstOperator: Executable<State, Effects, Input, any, ExecutableType.Any<boolean, Dynamic>>,
    ..._otherOperators: Array<Executable<State, Effects, any, any, ExecutableType.Any>>
  ): Callable<State, Effects, Input, any, ExecutableType.Any<boolean, Dynamic>> {
    return {} as any;
  }

  type EmptyIfFalse<Dynamic, Value> = Dynamic extends true ? Value : {};

  /**
  var range = num => Array(num).fill(null).map((v, i) => i + 1);
  var types = range(10).map(i => [
    `\t// prettier-ignore\n`,
    `\tfunction parallel<S, E, ${range(i).map(j => `I${j}, O${j}, A${j}, D${j}`).join(', ')}>`,
    `(${range(i).map(j => `exec${j}: ExecutableInternal<S, E, I${j}, O${j}, A${j}, D${j}>`).join(', ')}): `,
    `CallableInternal<S, E, SomeTrue<[${range(i).map(j => `D${j}`).join(', ')}]> extends false ? any : (${range(i).map(j => `EmptyIfFalse<D${j}, I${j}>`).join(' & ')}), [${range(i).map(j => `O${j}`).join(', ')}], SomeTrue<[${range(i).map(j => `A${j}`).join(', ')}]>, SomeTrue<[${range(i).map(j => `D${j}`).join(', ')}]>>;`
  ].join('')).join('\n');
  copy(types);
  console.log(types);
  //  **/

  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>): CallableInternal<S, E, SomeTrue<[D1]> extends false ? any : (EmptyIfFalse<D1, I1>), [O1], SomeTrue<[A1]>, SomeTrue<[D1]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>): CallableInternal<S, E, SomeTrue<[D1, D2]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2>), [O1, O2], SomeTrue<[A1, A2]>, SomeTrue<[D1, D2]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>): CallableInternal<S, E, SomeTrue<[D1, D2, D3]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3>), [O1, O2, O3], SomeTrue<[A1, A2, A3]>, SomeTrue<[D1, D2, D3]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4>), [O1, O2, O3, O4], SomeTrue<[A1, A2, A3, A4]>, SomeTrue<[D1, D2, D3, D4]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5>), [O1, O2, O3, O4, O5], SomeTrue<[A1, A2, A3, A4, A5]>, SomeTrue<[D1, D2, D3, D4, D5]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5, I6, O6, A6, D6>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>, exec6: ExecutableInternal<S, E, I6, O6, A6, D6>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5, D6]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5> & EmptyIfFalse<D6, I6>), [O1, O2, O3, O4, O5, O6], SomeTrue<[A1, A2, A3, A4, A5, A6]>, SomeTrue<[D1, D2, D3, D4, D5, D6]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5, I6, O6, A6, D6, I7, O7, A7, D7>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>, exec6: ExecutableInternal<S, E, I6, O6, A6, D6>, exec7: ExecutableInternal<S, E, I7, O7, A7, D7>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5, D6, D7]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5> & EmptyIfFalse<D6, I6> & EmptyIfFalse<D7, I7>), [O1, O2, O3, O4, O5, O6, O7], SomeTrue<[A1, A2, A3, A4, A5, A6, A7]>, SomeTrue<[D1, D2, D3, D4, D5, D6, D7]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5, I6, O6, A6, D6, I7, O7, A7, D7, I8, O8, A8, D8>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>, exec6: ExecutableInternal<S, E, I6, O6, A6, D6>, exec7: ExecutableInternal<S, E, I7, O7, A7, D7>, exec8: ExecutableInternal<S, E, I8, O8, A8, D8>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5> & EmptyIfFalse<D6, I6> & EmptyIfFalse<D7, I7> & EmptyIfFalse<D8, I8>), [O1, O2, O3, O4, O5, O6, O7, O8], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8]>, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5, I6, O6, A6, D6, I7, O7, A7, D7, I8, O8, A8, D8, I9, O9, A9, D9>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>, exec6: ExecutableInternal<S, E, I6, O6, A6, D6>, exec7: ExecutableInternal<S, E, I7, O7, A7, D7>, exec8: ExecutableInternal<S, E, I8, O8, A8, D8>, exec9: ExecutableInternal<S, E, I9, O9, A9, D9>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8, D9]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5> & EmptyIfFalse<D6, I6> & EmptyIfFalse<D7, I7> & EmptyIfFalse<D8, I8> & EmptyIfFalse<D9, I9>), [O1, O2, O3, O4, O5, O6, O7, O8, O9], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9]>, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8, D9]>>;
  // prettier-ignore
  function parallel<S, E, I1, O1, A1, D1, I2, O2, A2, D2, I3, O3, A3, D3, I4, O4, A4, D4, I5, O5, A5, D5, I6, O6, A6, D6, I7, O7, A7, D7, I8, O8, A8, D8, I9, O9, A9, D9, I10, O10, A10, D10>(exec1: ExecutableInternal<S, E, I1, O1, A1, D1>, exec2: ExecutableInternal<S, E, I2, O2, A2, D2>, exec3: ExecutableInternal<S, E, I3, O3, A3, D3>, exec4: ExecutableInternal<S, E, I4, O4, A4, D4>, exec5: ExecutableInternal<S, E, I5, O5, A5, D5>, exec6: ExecutableInternal<S, E, I6, O6, A6, D6>, exec7: ExecutableInternal<S, E, I7, O7, A7, D7>, exec8: ExecutableInternal<S, E, I8, O8, A8, D8>, exec9: ExecutableInternal<S, E, I9, O9, A9, D9>, exec10: ExecutableInternal<S, E, I10, O10, A10, D10>): CallableInternal<S, E, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8, D9, D10]> extends false ? any : (EmptyIfFalse<D1, I1> & EmptyIfFalse<D2, I2> & EmptyIfFalse<D3, I3> & EmptyIfFalse<D4, I4> & EmptyIfFalse<D5, I5> & EmptyIfFalse<D6, I6> & EmptyIfFalse<D7, I7> & EmptyIfFalse<D8, I8> & EmptyIfFalse<D9, I9> & EmptyIfFalse<D10, I10>), [O1, O2, O3, O4, O5, O6, O7, O8, O9, O10], SomeTrue<[A1, A2, A3, A4, A5, A6, A7, A8, A9, A10]>, SomeTrue<[D1, D2, D3, D4, D5, D6, D7, D8, D9, D10]>>;

  function parallel<State, Effects>(
    ..._otherOperators: Array<ExecutableInternal<State, Effects, any, any, any, any>>
  ): CallableInternal<State, Effects, any, Array<any>, any, any> {
    return {} as any;
  }

  return {
    inject,
    map,
    action,
    run,
    mutation,
    pipe,
    parallel,
  };
}

import { State } from '../state';

export const IS_DERIVED = Symbol('IS_DERIVED');

type Derived<Input, Output> = Input extends void
  ? { (): Output }
  : { (input: Input): Output; intance(name: string): (input: Input) => Output };

export function derived<Output, Input = void>(_compute: (state: State) => Output): Derived<Input, Output> {
  return {} as any;
}

export function useDerived<Output>(_derived: (state: State) => Output): Output {
  return {} as any;
}

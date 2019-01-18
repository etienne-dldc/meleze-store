import { createProxyfier } from './createProxyfier';
import { FragmentAny, Fragment, FragmentCompute, InputRef, CacheItem, CacheTree, Cache, CacheData } from './types';
import { notNill, getOrSet } from './utils';
import { ExecutableAny, CallableExecutable, Operators } from './operators';
import { TrackingLayer } from './fragments/TrackingLayer';
import { STATE, INPUT } from './const';

export function createManager<State>(state: State) {
  const trackingProxyfier = createProxyfier();
  // const rawState = state;
  const proxyState: State = trackingProxyfier.proxify(state, STATE, null);
  const cache: Cache<CacheItem> = new Map();

  let cacheMapPath: Array<{ frag: FragmentAny; input: any }> = [];
  let nextCacheMap: CacheTree | null = null;

  function setCache(fragment: FragmentAny, input: InputRef, data: CacheData) {
    const fragCache = getOrSet(cache, fragment, new Map());
    if (!fragCache.has(input)) {
      fragCache.set(input, {
        data,
        resolvers: new Set(),
      });
    } else {
      throw new Error('Whaaat ?');
    }
  }

  function getCache(fragment: FragmentAny, input: InputRef): CacheData | null {
    const fragCache = getOrSet(cache, fragment, new Map());
    const inputCache = fragCache.get(input);
    return inputCache ? inputCache.data : null;
  }

  function computeFragment<Input, Output>(
    fragment: FragmentAny,
    name: string,
    select: FragmentCompute<State, Input, Output>,
    input: any,
    parentCacheMap: CacheTree
  ): any {
    trackingProxyfier.pushLayer(name, fragment, input);
    const proxyInput = trackingProxyfier.proxify(input, INPUT, null);

    const fragCacheMap = getOrSet(parentCacheMap.children, fragment, new Map());
    const currentCacheMap = {
      children: new Map(),
    };
    fragCacheMap.set(input, currentCacheMap);
    const result = select(proxyState, proxyInput);
    const usedLayer = trackingProxyfier.popLayer();
    const { value: output, shape, paths } = trackingProxyfier.unwrap(result);
    const returnedLayer = TrackingLayer.create(name, fragment, input);
    paths.forEach(path => {
      TrackingLayer.addPath(returnedLayer, path.type, path.input, path.path);
    });

    setCache(fragment, input, {
      result: output,
      returned: returnedLayer,
      used: usedLayer,
      shape: shape,
      cacheMap: currentCacheMap,
    });

    return output;
  }

  function getFragmentResult<Input, Output>(
    fragment: FragmentAny,
    name: string,
    select: FragmentCompute<State, Input, Output>,
    input: any
  ): any {
    const parentCacheMap = cacheMapPath.slice(0, -1).reduce((acc, val) => {
      return notNill(notNill(acc.children.get(val.frag)).get(val.input));
    }, notNill(nextCacheMap));
    const cache = getCache(fragment, input);
    if (cache) {
      const fragCacheMap = getOrSet(parentCacheMap.children, fragment, new Map());
      fragCacheMap.set(input, cache.cacheMap);
      return cache.result;
    }
    return computeFragment(fragment, name, select, input, parentCacheMap);
  }

  function executeFragment<Input, Output>(
    fragment: FragmentAny,
    name: string,
    select: FragmentCompute<State, Input, Output>,
    input: any
  ): any {
    cacheMapPath.push({ frag: fragment, input });
    const output = getFragmentResult(fragment, name, select, input);
    cacheMapPath.pop();
    return trackingProxyfier.proxify(output, fragment, input);
  }

  function mutate(_mutation: (state: State) => void) {
    // TODO
    // const newState = produce(rawState, mutation, (mutations, inverseMutations) => {
    //   console.log({ mutations, inverseMutations });
    // });
    // console.log(newState, rawState);
  }

  function fragment<Output, Input = void>(
    name: string,
    select: FragmentCompute<State, Input, Output>
  ): Fragment<Input, Output> {
    const fragment: FragmentAny = ((input: any) => {
      return executeFragment(fragment, name, select, input);
    }) as any;
    fragment.displayName = name;
    return fragment as any;
  }

  // prettier-ignore
  function createResolve<Output>(name: string, fragment: () => Output): () => Output;
  // prettier-ignore
  function createResolve<Input, Output>(name: string, fragment: (input: Input) => Output): (input: Input) => Output;

  function createResolve(name: string, fragment: any): any {
    const ref = Symbol(name);
    return (input: any) => {
      nextCacheMap = {
        children: new Map(),
      };
      cacheMapPath = [];
      const result = fragment(input);
      cache.forEach(v => {
        v.forEach(d => {
          d.resolvers.delete(ref);
        });
      });
      const traverse = (node: CacheTree) => {
        node.children.forEach((inputs, fragment) => {
          const frag = notNill(cache.get(fragment));
          inputs.forEach((d, input) => {
            const data = notNill(frag.get(input));
            data.resolvers.add(ref);
            traverse(d);
          });
        });
      };

      traverse(nextCacheMap);

      cache.forEach((v, fragment) => {
        v.forEach((d, input) => {
          if (d.resolvers.size === 0) {
            v.delete(input);
          }
        });
        if (v.size === 0) {
          cache.delete(fragment);
        }
      });

      return trackingProxyfier.unwrap(result).value;
    };
  }

  function createOperators(): Operators<{}, State> {
    return {} as any;
  }

  function createUseFragment() {
    function useManager<Input, Output>(select: FragmentCompute<State, Input, Output>): Output;
    function useManager<Input, Output>(fragment: Fragment<Input, Output>, value: Input): Output;
    function useManager<Output>(fragment: Fragment<void, Output>): Output;
    function useManager<Output>(_fragment: any): Output {
      return {} as any;
    }
    return useManager;
  }

  function createUseExecutables() {
    function useExecutable<Exec extends { [key: string]: ExecutableAny<{}, State> }>(
      _execs: Exec
    ): { [K in keyof Exec]: CallableExecutable<{}, State, Exec[K]> } {
      return {} as any;
    }
    return useExecutable;
  }

  return {
    mutate,
    fragment,
    createResolve,
    createOperators,
    createUseFragment,
    createUseExecutables,
  };
}

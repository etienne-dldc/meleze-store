# Meleze Store

A single state tree store based on the [flux](https://facebook.github.io/flux/) model.

## `createStore()` API

`function createStore(config, options = {}): Store`

The `createStore` function accepts two arguments, `config` and `options`.

The `options` argument just let you control the `devtool`.

The `config` argument must be an object with the following key (all optional):

- `state`
- `mutations`
- `statics`
- `actions`
- `reactions`
- `setup`

The result of the `createStore` function is an object:

```
{
  actions,
  mutations,
  getState,
  getStatics,
  subscribe,
  devtool
}
```

## State (`config.state`)

The state you give to `createStore` is your initial state. This can be any plain JavaScript data (object, array, string, number, null...).

**Note**: The Store is based on the same principle than `Redux` to detect state change, which is reference equality. This mean you can have class instances in your state but be carefull because mutation on them will probbaly not be detected and will cause out of date UI.
So be carefull when storing Date or DOM Elements.

## Mutations (`config.mutations`)

Mutations are used to mutate the state.
A mutation is just a function that receive a `context`.

## About `context`

The `context` is a concept used for many items of `createStore`, you can think of this as "an object passed to a function with a bunch of stuff in it".

We use this over normal arguments because:

1. If you don't need all aguments you don't have to list them
2. It make renaming explicit, enforcing a better consistency

For a better explanation here is a comparison between multiple parameters and a `context`:

```js
// Let say a action is a function with the following signature
// (state, statics, actions, mutations) => any

// We can write a action like this
const myAction = (state, statics, actions, mutations) => {}
// but we can also change names
const myAction = (data, stuffIdontUse, stuffToDoSuff) => {}
// also we might not need the state but we still need to declare the argument
const iOnlyNeedMutations = (_, _, _, mutations) => {}
// finnaly you might forget the order
const ooops = (state, statics, mutations, actions) => {}

// Now let's say an action is define as (context) => any
// with context containing an object: { state, statics, actions, mutations }

// we can get the context and access properties on it
const myAction = context => { context.state }
// but it's better if we just destructure
const myAction = ({ state, statics, actions, mutations }) => {}
// If you don't need something you can just ignore it
const iOnlyNeedMutations = ({ mutations }) => {}
// If you need you can rename but in a more explicit maner (the original name stiff appear)
const myAction = ({ mutations: changeStuff }) => { changeStuff.myMutation }
```

## Back to mutations

A mutation is just a function that receive a `context` and return nothing (this is important).

`(context) => void`

The `context` contains:

- `state` : the state of the app that you can read and mutate
- `value`: an optional value you can pass when the mutation is called (`myMutation("some value")`)

Here are some examples

```js
createStore({
  mutations: {
    incrementCounter: ({ state }) => {
      state.counter = state.counter + 1
    },
    incrementCounterBy: ({ state, value: amount }) => {
      state.counter = state.counter + amount
    },
    addItem: ({ state, value: item }) => {
      state.items.push(item)
    },
})
```

**Note**: Internally mutation are handled by the [`immer` library](https://github.com/mweststrate/immer) to produce an immutable mutation.

The `config.mutations` fields can be a arbitrary nested object:

```js
createStore({
  mutations: {
    nested: {
      moreNested: {
        someMutation: () => {}
      }
    }
})
```

The `store` returned by `createStore` will expose you mutations (`store.mutations`) as function that accept the value as argument.

```js
myStore.mutation.incrementCounter();
myStore.mutation.incrementCounterBy(4);
myStore.mutation.nested.moreNested.someMutation();
```

**Note**: `value` is ony the first argument, other arguments are ignored. If you need to pass multiple values, use an object or an array

```js
myStore.mutation.addItemAtIndex({ item: myItem, index: 2 });
```

## Statics (`config.statics`)

Statics is just way to expose stuff in ouside of the store. You can mutate statics if you want (not recomended) but these changes won't be tracked.

```js
const myStore = createStore({ static: { arbitraryStuff: {} } });

myStore.getStatics().arbitraryStuff;
```

## Actions (`config.actions`)

An action is a function that receive a `context` and return an `executable` (keep reading to understand what an `executable` is).

The `context` of action contains:

- `state`
- `getState`,
- `statics`
- `getStatics`
- `mutations`
- `actions`
- `value`

`state` is the state just like in `mutation` except **you can't mutate it**.

`value` works the same way as in `mutation`

`statics` are just a easy way to access what is exposed in `statics`

_Why the getState and getStatics if we already have them ?_

> Because you can do async stuff in action, so you might need to read the state later

`mutations` and `actions` contains what you expect (your `mutations` and `actions`) **BUT** unlike the version exposed in the `store`, they are not executed when you call them, instead they return an executable.

So what are these `executables` ?

## Executables

Executables are data that the store can handle. Valid executable are:

- `null`
- A `Promise` that resolve to an `executable`
- A `array` of `executable`
- The resule of calling a `mutation` or an `action` passed by the context

## Examples of actions

Now that we have defined what an executable is, let's see some examples of actions:

```js
const myStore = createStore({
  actions: {
    increment: ({ value: amount, mutations }) => {
      if (amount === undefined) {
        return mutations.increment();
      }
      return mutations.incrementBy(amount);
    },
    // wait for 1 second, then if the state is under 100
    // increment it and run the same action again (recursion FTW)
    incrementLater: ({ getState, mutations, actions }) => {
      // wait return a promise that resolve after 1 second
      return wait(1000).then(() => {
        // we call getState, because context.state would be out of date
        const state = getState();
        if (state.counter < 100) {
          // here we return two thing thanks to an array
          // both will be executed
          return [mutations.increment(), actions.incrementLater()];
        }
        // undefined id not an executable, we must return null to "do nothing"
        return null;
      });
    },
    fetchStuff: ({ statics, mutations }) => {
      return [
        mutations.setStuffPending,
        statics.api
          .fetchStuff()
          .then(stuff => mutations.setStuffResolved(stuff))
          .catch(err => mutations.setStuffRejected(err)),
      ];
    },
  },
});

myStore.actions.fetchStuff();
```

Just like `mutations`, `config.actions` can be an arbitrary nested object and are expose on `config.actions`.

## Reactions (`config.reactions`)

Reactions let you react to certain state.
To create a reaction you have to use the `reaction` function exposed by `lib`:

This function take two arguments,

- The name of your mutation
- A reaction is a function that receive a `context` and return an executable

The context of a reaction contains:

- `state`
- `getState`
- `statics`
- `getStatics`
- `mutations`
- `actions`

This is exactly the same as `actions`, except you don't get a `value`.

Reactions are executed one after the other, so the order matter, this is why `config.reactions` must be an array:

```js
import { reaction } from './lib';

createStore({
  reactions: [
    reaction('myReaction', () => {
      // return an executable
      return null;
    }),
  ],
});
```

Note that you don't get the previous state in the `context`, this is because a `reaction` is not run on every state change (because `reaction` can return a `mutation` and trigger a state change). Instead we garanty that every `reaction` is called with the latest state before we flush (a flush is when we apply state change to connected components).
In fact we wait until every `reaction` return no mutations for a given state before to trigger a flush.

This mean that if you do something like this:

```js
createStore({
  mutations: {
    setRandom: ({ state }) => {
      state.num = Math.random();
    },
  },
  reactions: [
    reaction('myReaction', ({ mutations }) => {
      return mutations.setRandom();
    }),
  ],
});
```

You will get an infinite loop (don't worry, the store will detect it and blacklist the reactions) because teh state is never "stable" since one of the reaction always return a mutation.

**Note**: In reallity if you return a mutation that does not change the state, then the state will be considered stable...

**Note**: `config.reaction` can also be a single `reaction` instead of an array but you still need to wrap it in `reaction()`

## Setup (`config.setup`)

Setup can be either a function or an array of function that are executed when the store is created.
A `setup` receive a `context` and can return anything (return value is not used).

The contex of `setup` contains:

- `actions`
- `mutations`
- `state`
- `getState`
- `statics`
- `getStatics`

Nothing special about `state`, `getState`, `statics` and `getStatics`.

`actions` and `mutations` are the same as the ones exposed on `state.actions` and `state.mutations`. So if you call them they will be executed (and not return a executable).

```js
createStore({
  setup: ({ actions, statics, mutations }) => {
    actions.fetchStuff();
    mutations.setData(localStorage.getData());
    console.log('Store initialized');
  },
});
```

## Modules (`withModules`)

Modules transform a `config` that contains a `modules` key into a config compatible with `createStore`.
A modules is a function that receive the `path` of the module, and return a `config` object
Here is a simple illustration:

```js
const routerModule = () => ({
  state: {
    location: '/',
  },
  mutations: {
    setLocation: () => {
      /*...*/
    },
  },
});
createStore(
  withModules({
    modules: {
      router: routerModule,
    },
  })
);
// Is equivalent to
createStore({
  state: {
    router: {
      location: '/',
    },
  },
  mutations: {
    router: {
      setLocation: () => {
        /*...*/
      },
    },
  },
});
```

`withModules` also add module scoped equivalent in `context`s. For example, the `context` of mutation in a module contains:

- `state`
- `value`
- `moduleState`

```js
const routerModule = () => ({
  state: {
    location: '/',
  },
  mutations: {
    setLocation: ({ moduleState, value: newLocation }) => {
      // set state.router.location
      moduleState.location = newLocation;
    },
  },
});
createStore(
  withModules({
    modules: {
      router: routerModule,
    },
  })
);
```

## Connect

In order to use teh store in your React components, you need to connect them.

The `store/index.js` files expose two function to connect components:

- `connect`
- `connectPure`

`connectPure` is exactly the same as `connect` except it uses a `React.PureComponent` instead of a `React.Component` to wrap your component.

The signature of `connect` is the following:

`(mapStateToProps, MyComponent) => ConnectComponent`

`mapStateToProps` expect a function that will receive `(state, statics)` and must return an object.
Each key of this object will be a props in you connected component.
On every state change, `mapStateToProps` is executed again and if the result is different (using a shallowEqual) the component is re-rendered.

In addition to the props from `mapStateToProps`, `connect` also inject `store.actions` (as an `actions` props) and `store.mutations` (as an `mutations` props). You can call any `action` or `mutation` at any time in you component.

```js
const MyComponent = ({ mutations, actions, counter, externalProps }) => {
  return (
    <div>
      <span>External : {externalProps}</span>
      <button onClick={() => actions.fetchStuff()}>Fetch stuff</button>
      <span>{counter}</span>
      <button onClick={() => mutations.increment()}>Increment</button>
    </div>
  )
}

export default connectPure(
  state => ({
    counter: state.counter
  }),
  MyComponent
)

// In the app
<MyComponent externalProps="Hello" />
```

## Selectors

A selector is a function that select something ^^

For example you could have a `selectCounter`:

```js
const selectCounter = state => state.counter;
```

**Note**: You can't do `connect(selectCounter, MyComponent)` because `selectCounter` does not return an object instead you have to do:

```js
connect(
  state => ({ counter: selectCounter(state) }),
  MyComponent
);
```

Another option if to define `selectCounter` like this:

```js
const selectCounter = state => ({ counter: state.counter });
```

Then you can do `connect(selectCounter, MyComponent)` but what if you want to add somthing ?

## `combineSelectors`

`combineSelectors` let you pass multiple selector and it will merge the result

```js
const selectCounter = state => ({ counter: state.counter });
const selectData = state => ({ data: state.data.current });

const MyComponent = ({ counter, data }) => {
  /*...*/
};

connect(
  combineSelectors(selectCounter, selectData),
  MyComponent
);
```

`combineSelectors` also accept an object of selector instead of function, in that case it will "map" the object and merge the result.

```js
// selectCounter does not return an object
const selectCounter = state => state.counter;
const selectData = state => ({ data: state.data.current });

const MyComponent = ({ theCounter, data }) => {
  /*...*/
};

connect(
  combineSelectors(selectData, {
    theCounter: selectCounter,
  }),
  MyComponent
);
```

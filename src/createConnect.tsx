import hoistStatics from 'hoist-non-react-statics';
import React, { ComponentType } from 'react';
import { shallowEqualObjects, notNull } from './utils';
import { ConfigurationAny, Store, StoreAny, ResolvedState, ResolvedConfiguration } from './types';

const { Provider: StoreContextProvider, Consumer: StoreContextConsumer } = React.createContext<Store<
  ConfigurationAny
> | null>(null);

function withStore<P>(Component: React.ComponentType<P & { store: StoreAny }>): React.FunctionComponent<P> {
  const wrappedComponentName = Component.displayName || Component.name || 'Component';
  const displayName = `withStore(${wrappedComponentName})`;
  const withStore: React.SFC<P> = props => {
    return (
      <StoreContextConsumer>
        {store => (
          <Component {...props} store={notNull(store, `No store available, make sure to use the StoreProvider`)} />
        )}
      </StoreContextConsumer>
    );
  };
  (withStore as any).displayName = displayName;
  return withStore;
}

type StoreProviderProps = { store: StoreAny };

export class StoreProvider extends React.PureComponent<StoreProviderProps> {
  componentDidUpdate(prevProps: StoreProviderProps) {
    if (this.props.store !== prevProps.store) {
      console.warn(`StoreProvider does not support changing the store !!`);
    }
  }

  render() {
    return <StoreContextProvider value={this.props.store}>{this.props.children}</StoreContextProvider>;
  }
}

type ConnectOptions = { pure?: boolean };

type MapStateToProps<State, StateProps> = (state: State) => StateProps;

type InjectedProps<StateProps, Config extends ConfigurationAny> = StateProps & {
  actions: ResolvedConfiguration<Config>['callableActions'];
  mutations: ResolvedConfiguration<Config>['callableMutations'];
  store: Store<Config>;
};

type Omit<T, K extends keyof T> = Pick<
  T,
  ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never; [x: number]: never })[keyof T]
>;

export function createConnect<Config extends ConfigurationAny>(connectOptions: ConnectOptions = {}) {
  return function connect<StateProps, Props extends InjectedProps<StateProps, Config>>(
    mapStateToProps: MapStateToProps<ResolvedState<Config>, StateProps>,
    WrappedComponent: ComponentType<Props>
  ): React.FunctionComponent<Omit<Props, keyof InjectedProps<StateProps, Config>>> {
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const displayName = `connect(${wrappedComponentName})`;

    const { pure = false } = connectOptions;

    let OuterBaseComponent = React.Component;
    let FinalWrappedComponent = WrappedComponent;

    if (pure) {
      OuterBaseComponent = React.PureComponent;
    }

    class Connect extends OuterBaseComponent {
      private unsubscribe: (() => void) | null = null;
      public props!: InjectedProps<StateProps, Config>;
      public state: {
        derivedProps: StateProps;
      };

      constructor(props: InjectedProps<any, Config>) {
        super(props);

        if (!props.store) {
          throw new Error(`Missing store, make sure to use the Provider !`);
        }

        this.state = {
          derivedProps: mapStateToProps(props.store.getState()),
        };
      }

      componentDidMount() {
        // it remembers to subscribe to the store so it doesn't miss updates
        this.unsubscribe = this.props.store.subscribe(this.handleChange);
      }

      componentWillUnmount() {
        // and unsubscribe later
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      handleChange = (newState: ResolvedState<Config>) => {
        const newDerivedProps = mapStateToProps(newState);
        if (!shallowEqualObjects(this.state.derivedProps, newDerivedProps)) {
          this.props.store.devtool.componentUpdated(displayName, this.state.derivedProps, newDerivedProps);
          this.setState({ derivedProps: newDerivedProps });
        }
      };

      render() {
        const { store, ...other } = this.props as any;
        return (
          <FinalWrappedComponent
            {...other}
            {...this.state.derivedProps}
            actions={store.actions}
            mutations={store.mutations}
            store={store}
          />
        );
      }
    }

    const ConnectWithStore = withStore(Connect);

    (ConnectWithStore as any).WrappedComponent = WrappedComponent;
    ConnectWithStore.displayName = displayName;

    return hoistStatics(ConnectWithStore, WrappedComponent) as any;
  };
}

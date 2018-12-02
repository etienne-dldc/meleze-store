import { isPlainObject } from './utils';

type DevtoolOptions = {
  disabled: boolean;
};

type MessageType = 'init' | 'step';

type Step = {};

export type Devtool = {
  open: () => void;
  onDevtoolClose: () => void;
  pushStep: (params: any) => void;
  afterInit: (state: any) => void;
  componentUpdated: (_componentName: string, _prevDerived: any, _nexDerived: any) => void;
};

export function createDevtool({ disabled }: DevtoolOptions): Devtool {
  let openedWindow: Window | null = null;
  let windowReady: boolean = false;
  let opened: boolean = false;

  const steps: Array<Step> = [];

  function safeValue<T>(value: T): any {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null && !isPlainObject(value)) {
      return `[${value.constructor.name || 'NOT SERIALIZABLE'}]`;
    }

    if (Array.isArray(value)) {
      return value.map(safeValue);
    }

    return value && isPlainObject(value)
      ? Object.keys(value).reduce(
          (aggr, key) => {
            aggr[key] = safeValue((value as any)[key]);
            return aggr;
          },
          {} as any
        )
      : value;
  }

  function send(type: MessageType, content: any) {
    if (openedWindow && windowReady) {
      openedWindow.postMessage(
        {
          storeDevtool: true,
          type,
          content: safeValue(content),
        },
        '*'
      );
    }
  }

  function open() {
    if (!opened) {
      window.addEventListener('unload', () => {
        if (openedWindow) {
          openedWindow.close();
        }
      });
      opened = true;
    }
    if (openedWindow) {
      return;
    }
    const opts = `height=500,width=500,left=500,top=0,menubar=no,toolbar=no,location=no`;
    const newWindow = window.open(window.location.origin + `/devtool`, '', opts);
    if (newWindow) {
      openedWindow = newWindow;

      openedWindow.addEventListener('load', () => {
        windowReady = true;
        send('init', steps);
      });
    }
  }

  function onDevtoolClose() {
    windowReady = false;
    openedWindow = null;
  }

  function shallowDiff(left: any, right: any, keepLeft: boolean, maxDepth: number = 0) {
    if (!isPlainObject(left) || !isPlainObject(left)) {
      return keepLeft ? left : right;
    }
    const allKeys = Object.keys(left);
    Object.keys(right).forEach(key => {
      if (allKeys.indexOf(key) === -1) {
        allKeys.push(key);
      }
    });
    return allKeys.reduce(
      (acc, key) => {
        if (left[key] !== right[key]) {
          if (maxDepth > 3) {
            acc[key] = keepLeft ? left[key] : right[key];
          } else {
            acc[key] = shallowDiff(left[key], right[key], keepLeft, maxDepth + 1);
          }
        }
        return acc;
      },
      {} as any
    );
  }

  function pushStep(params: any) {
    const { state, prevState, ...other } = params;
    const diffs =
      prevState && state
        ? {
            diffLeft: shallowDiff(prevState, state, true),
            diffRight: shallowDiff(prevState, state, false),
          }
        : {};
    const step: Step = { state, ...diffs, ...other };
    steps.unshift(step);
    send('step', step);
  }

  function afterInit(state: any) {
    steps.push({
      state: state,
      name: 'Init',
    });
  }

  function componentUpdated(_componentName: string, _prevDerived: any, _nexDerived: any) {
    // const diffLeft = shallowDiff(prevDerived, nexDerived, true)
    // const diffRight = shallowDiff(prevDerived, nexDerived, false)
    // console.log("componentUpdated: " + componentName, { diffLeft, diffRight })
  }

  const devtool = {
    open,
    onDevtoolClose,
    pushStep,
    afterInit,
    componentUpdated,
  };

  if (process.env.NODE_ENV !== 'development' || disabled) {
    Object.keys(devtool).forEach(key => {
      (devtool as any)[key] = () => {};
    });
  }

  (window as any).devtool = devtool;

  return devtool;
}

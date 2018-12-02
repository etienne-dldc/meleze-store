export function toArray<T>(item: T | Array<T>): Array<T> {
  return (Array.isArray(item) ? item : [item]).filter(v => v !== null && v !== undefined);
}

export function shallowEqualObjects(objA: any, objB: any): boolean {
  if (objA === objB) {
    return true;
  }

  var aKeys = Object.keys(objA);
  var bKeys = Object.keys(objB);
  var len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (var i = 0; i < len; i++) {
    var key = aKeys[i];

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

export function setIn(root: any, path: Array<string | number>, value: any) {
  const [next, ...rest] = path;
  if (rest.length === 0) {
    root[next] = value;
    return;
  }
  if (!root[next]) {
    root[next] = {};
  }
  setIn(root[next], rest, value);
}

export function getIn(root: any, path: Array<string | number>): any {
  const [next, ...rest] = path;
  if (rest.length === 0) {
    return root[next];
  }
  return getIn(root[next] || {}, rest);
}

export function isPlainObject(o: any): boolean {
  return !!o && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPromise(val: any): val is Promise<any> {
  return Promise.resolve(val) === val;
}

export function appToPath(path: Array<string | number>, part: null | string | number): Array<string | number> {
  return part !== null ? [...path, part] : path;
}

export function notNull<T>(value: null | T, message?: string): T {
  if (value === null) {
    throw new Error(message || `Unexpected null value`);
  }
  return value;
}

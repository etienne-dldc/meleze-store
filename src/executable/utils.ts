export function isPlainObject(o: any) {
  return !!o && typeof o === 'object' && Object.prototype.toString.call(o) === '[object Object]';
}

export function isPromise(val: any): val is Promise<any> {
  return Promise.resolve(val) === val;
}

export function appToPath(path: Array<string | number>, part: string | number | null): Array<string | number> {
  return part !== null ? [...path, part] : path;
}

export function isFunction(ele) {
  return ele instanceof Function
}

export function isPromise(ele) {
  return ele && isFunction(ele.then) && isFunction(ele.catch)
}
/**
 * 判断对象是否是一个promise，即是否可以用.then
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

/**
 * 获取对象的类型
 * @param  {*} obj
 * @return {String}
 *
 * @example
 * typeOf([]) === 'Array'
 * typeOf() === 'Undefined'
 * typeOf(1) === 'Number'
 */
export function typeOf(obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|]/g, '');
}

/**
 * 是否是一个纯净的对象
 * @param  {*}  obj
 * @return {Boolean}
 * @reference https://github.com/jonschlinkert/is-plain-object
 */
export function isPlainObject(obj) {
  if (typeOf(obj) !== 'Object') {
    return false;
  }

  const ctor = obj.constructor;

  if (typeof ctor !== 'function') {
    return false;
  }

  const prot = ctor.prototype;

  if (typeOf(prot) !== 'Object') {
    return false;
  }

  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  return true;
}

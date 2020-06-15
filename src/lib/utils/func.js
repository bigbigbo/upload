import { isPromise } from './object';

export const noop = () => {};

/**
 * 用于执行回调方法后的逻辑
 * @param  {*} ret            回调方法执行结果
 * @param  {Function} success 执行结果返回非false的回调
 * @param  {Function} [failure=noop] 执行结果返回false的回调
 */
export function promiseCall(ret, success, failure = noop) {
  if (isPromise(ret)) {
    return ret
      .then((result) => {
        success(result);
        return result;
      })
      .catch((e) => {
        failure(e);
        // throw e;
      });
  }

  return ret !== false ? success(ret) : failure(ret);
}

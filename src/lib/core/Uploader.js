import { uid } from '../utils';
import { noop, promiseCall } from '../utils/func';
import { isPlainObject } from '../utils/object';
import defaultRequest from './request';

const errorCode = {
  EXCEED_LIMIT: 'EXCEED_LIMIT',
  BEFOREUPLOAD_REJECT: 'BEFOREUPLOAD_REJECT',
  RESPONSE_FAIL: 'RESPONSE_FAIL'
};
class Uploader {
  constructor(options) {
    this.options = {
      action: options.action,
      beforeUpload: options.beforeUpload || noop,
      onProgress: options.onProgress || noop,
      onSuccess: options.onSuccess || noop,
      onError: options.onError || noop,
      data: options.data || {},
      name: options.name || 'file',
      method: options.method || 'post',
      withCredentials: options.withCredentials || false,
      headers: options.headers,
      timeout: options.timeout || 60 * 1000,
      request: options.request
    };

    this.reqs = {};
  }

  setOptions(options) {
    Object.assign(this.options, options);
  }

  startUpload(files) {
    const filesArr = files.length ? [...files] : [files];
    filesArr.forEach((file) => {
      file.uid = file.uid || uid();
      this.upload(file);
    });
  }

  upload(file) {
    const { beforeUpload, action, name, headers, timeout, withCredentials, method, data } = this.options;

    const before = beforeUpload(file, {
      action,
      name,
      headers,
      timeout,
      withCredentials,
      method,
      data
    });

    promiseCall(
      before,
      (options) => {
        if (options === false) {
          const err = new Error(errorCode.BEFOREUPLOAD_REJECT);
          err.code = errorCode.BEFOREUPLOAD_REJECT;
          return this.options.onError(err, null, file);
        }
        this.post(file, isPlainObject(options) ? options : undefined);
      },
      (error) => {
        let err;
        if (error) {
          err = error;
        } else {
          err = new Error(errorCode.BEFOREUPLOAD_REJECT);
          err.code = errorCode.BEFOREUPLOAD_REJECT;
        }
        this.options.onError(err, null, file);
      }
    );
  }

  post(file, options = {}) {
    const requestOptions = {
      ...this.options,
      ...options
    };

    const { action, name, headers, timeout, withCredentials, onProgress, onSuccess, onError, method } = requestOptions;

    let data = requestOptions.data;
    if (typeof data === 'function') {
      data = data(file);
    }

    const { uid } = file;

    const request = typeof requestOptions.request === 'function' ? requestOptions.request : defaultRequest;

    this.reqs[uid] = request({
      action,
      filename: name,
      file,
      data,
      timeout,
      headers,
      withCredentials,
      method,
      onProgress: (e) => {
        onProgress(e, file);
      },
      onSuccess: (ret) => {
        delete this.reqs[uid];
        onSuccess(ret, file);
      },
      onError: (err, ret) => {
        delete this.reqs[uid];
        onError(err, ret, file);
      }
    });
  }

  abort(file) {
    const { reqs } = this;
    if (file) {
      let uid = file;
      if (file && file.uid) {
        uid = file.uid;
      }
      if (reqs[uid]) {
        reqs[uid].abort();
        delete reqs[uid];
      }
    } else {
      Object.keys(reqs).forEach((uid) => {
        if (reqs[uid]) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      });
    }
  }
}

export default Uploader;

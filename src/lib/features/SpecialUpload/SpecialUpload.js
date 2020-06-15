/* eslint-disable no-invalid-this */
import React from 'react';

import Uploader from '../../core/Uploader';

import { UPLOADING, UPLOAD_SUCCESS, UPLOAD_FAIL } from '../../constants/uploadStatus';
import { LOCAL, RESOURCE_LIB } from '../../constants/fileFrom';

const Upload = (formatFileList) => (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);

      const options = this.getUploaderOptions(props);

      this.uploader = new Uploader(options);

      this.state = {
        myResourceLibVisible: false,
        fileList: formatFileList(props.fileList)
      };
    }

    componentWillUnmount() {
      this.uploader.abort();
    }

    get isControled() {
      return !!this.props.fileList;
    }

    get fileList() {
      const fileList = this.isControled ? this.props.fileList : this.state.fileList;

      return fileList;
    }

    findFile(fileList, uid) {
      let result;
      fileList.forEach((file) => {
        if (file.uid === uid) result = file;
      });
      return result;
    }

    getUploaderOptions(props) {
      return {
        name: props.name,
        action: props.action,
        beforeUpload: props.beforeUpload,
        withCredentials: props.withCredentials,
        headers: props.headers,
        timeout: props.timeout,
        method: props.method,
        data: props.data,
        request: props.request,
        onProgress: this.handleProgress,
        onError: this.handleError,
        onSuccess: this.handleSuccess
      };
    }

    // 上传，特殊的组件上传必带uid，因为是固定的组件上传
    handleUpload = (file) => {
      console.log('上传', file);
      const { onChange } = this.props;

      this.uploader.startUpload(file);

      const target = {
        originFileObj: file,
        name: file.name,
        uid: file.uid,
        status: UPLOADING,
        fileFrom: LOCAL,
        fileType: file.fileType
      };

      const fileList = [...this.fileList];
      const targetIndex = fileList.findIndex((i) => i.uid === file.uid);

      fileList[targetIndex] = target;

      if (!this.isControled) {
        this.setState({ fileList });
      }

      if (typeof onChange === 'function') {
        onChange({ file, fileList });
      }
    };

    // 上传事件
    handleProgress = (e, file) => {
      console.log('percent', e.percent);
      const { onChange, onProgress } = this.props;
      const { uid } = file;

      const target = this.fileList.find((i) => i.uid === uid);
      const targetIndex = this.fileList.findIndex((i) => i.uid === uid);

      const fileList = [
        ...this.fileList.slice(0, targetIndex),
        {
          ...target,
          // 当进度显示百分百的时候距离上传成功事件还有一定的时间，此时人为修改掉最大百分比为99，并在成功事件中设置为100
          percent: e.percent - 1 >= 0 ? e.percent - 1 : 0
        },
        ...this.fileList.slice(targetIndex + 1)
      ];

      if (!this.isControled) {
        this.setState({
          fileList
        });
      }

      if (typeof onProgress === 'function') {
        onProgress(e, file);
      }

      if (typeof onChange === 'function') {
        onChange({ file, event: e, fileList });
      }
    };

    // 处理上传成功
    handleSuccess = (response, file) => {
      console.log('上传成功', response);
      const { onChange, onSuccess, afterUpload } = this.props;
      const { uid } = file;

      const target = this.fileList.find((i) => i.uid === uid);
      const targetIndex = this.fileList.findIndex((i) => i.uid === uid);

      let finalResponse = response;

      if (typeof afterUpload === 'function') {
        finalResponse = afterUpload(response);
      }

      const fileList = [
        ...this.fileList.slice(0, targetIndex),
        {
          ...target,
          response,
          percent: 100, // 参考上面进度事件的描述
          status: UPLOAD_SUCCESS,
          url: finalResponse.url,
          fileUnid: finalResponse.fileUnid,
          error: null
        },
        ...this.fileList.slice(targetIndex + 1)
      ];

      if (!this.isControled) {
        this.setState({ fileList });
      }

      if (typeof onSuccess === 'function') {
        onSuccess(response, file);
      }

      if (typeof onChange === 'function') {
        onChange({ file, fileList });
      }
    };

    // 处理上传失败
    handleError = (err, _, file) => {
      console.log('上传失败', err);
      const { onChange, onError } = this.props;
      const { uid } = file;

      const target = this.fileList.find((i) => i.uid === uid);
      const targetIndex = this.fileList.findIndex((i) => i.uid === uid);

      const fileList = [
        ...this.fileList.slice(0, targetIndex),
        {
          ...target,
          status: UPLOAD_FAIL,
          error: err
        },
        ...this.fileList.slice(targetIndex + 1)
      ];

      if (!this.isControled) {
        this.setState({
          fileList
        });
      }

      if (typeof onError === 'function') {
        onError(err, file);
      }

      if (typeof onChange === 'function') {
        onChange({ file, fileList });
      }
    };

    // 删除
    handleDelete = (file) => {
      console.log('删除');
      const { onChange } = this.props;

      const { uid } = file;
      const fileList = [...this.fileList];
      const targetIndex = fileList.findIndex((file) => file.uid === uid);

      fileList[targetIndex] = {};

      if (!this.isControled) {
        this.setState({
          fileList
        });
      }

      if (typeof onChange === 'function') {
        onChange({ file, fileList });
      }
    };

    // 取消上传
    handleAbort = (file) => {
      console.log('取消上传', file);
      this.handleDelete(file);

      this.uploader.abort(file);
    };

    // 选择文件复用
    handleSelect = (target) => {
      console.log('资料复用');
      this.toggleMyResourceLibVisible();
    };

    // 切换我的资源科的显隐
    toggleMyResourceLibVisible = () => {
      const { myResourceLibVisible } = this.state;

      this.setState({
        myResourceLibVisible: !myResourceLibVisible
      });
    };
  };
};

export default Upload;

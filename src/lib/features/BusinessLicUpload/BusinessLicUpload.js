/* eslint-disable no-invalid-this */
import React from 'react';
import { message } from 'antd';
import CropModal from '../CropModal';
import BusinessLicItem from './BusinessLicItem';
import MyResourceLib from '../MyResourceLib';

import Uploader from '../../core/Uploader';

import { UPLOADING, UPLOAD_SUCCESS, UPLOAD_FAIL } from '../../constants/uploadStatus';
import { LOCAL } from '../../constants/fileFrom';
import { BL_ORIGINAL, BL_COPY } from '../../constants/fileType';

import { byteConverMB, readFile } from '../../utils/index';

class IDCardUpload extends React.Component {
  constructor(props) {
    super(props);

    const options = this.getUploaderOptions(props);

    this.uploader = new Uploader(options);

    this.state = {
      currentUid: null,
      imgName: 'test',
      imgSrc: null,
      cropVisible: false,
      myResourceLibVisible: false,
      fileList: [{}, {}]
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

  get perFileLimitSize() {
    return this.props.limit.perFileSize;
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

  startUpload = (cardEnd, file) => {
    console.log('上传', file);
    const { onChange } = this.props;

    this.uploader.startUpload(file);

    const target = {
      originFileObj: file,
      name: file.name,
      uid: file.uid,
      status: UPLOADING,
      fileFrom: LOCAL,
      fileType: cardEnd
    };

    const targetIndex = cardEnd === BL_ORIGINAL ? 0 : 1;

    const fileList = [...this.fileList];
    fileList[targetIndex] = target;

    if (!this.isControled) {
      this.setState({ fileList });
    }

    if (typeof onChange === 'function') {
      onChange({ file, fileList });
    }
  };

  // 上传
  handleUpload = async (cardEnd, file) => {
    console.log('上传', file);

    const { crop = {} } = this.props;
    if (!crop.enabled) {
      if (byteConverMB(file.size) > this.perFileLimitSize) {
        // uploadFiles.splice(index, 1);
        message.info(`${file.name} 文件大小超过${this.perFileLimitSize}M`);
        return;
      }
    } else {
      // 裁减处理
      const imgSrc = await readFile(file);

      this.setState({
        imgSrc,
        currentUid: cardEnd,
        imgName: file.name.split('.')[0],
        cropVisible: true
      });

      return;
    }

    // 没有裁切就直接上传
    this.startUpload(cardEnd, file);
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

  // 选择文件复用
  handleSelect = (cardEnd) => {
    console.log('资料复用');
    this.setState(() => ({
      currentUid: cardEnd
    }));
    this.toggleMyResourceLibVisible();
  };

  // 删除
  handleDelete = (file) => {
    console.log('删除', file);
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

  // 切换我的资源科的显隐
  toggleMyResourceLibVisible = () => {
    const { myResourceLibVisible } = this.state;

    this.setState({
      myResourceLibVisible: !myResourceLibVisible
    });
  };

  toggleCropVisible = () => {
    const { cropVisible } = this.state;

    this.setState({
      cropVisible: !cropVisible
    });
  };

  handleUploadCropImg = (file, cardEnd) => {
    this.startUpload(cardEnd, file);

    this.toggleCropVisible();
  };

  handleSelectMyResource = (fileList, cardEnd) => {
    const { onChange } = this.props;

    this.toggleMyResourceLibVisible();

    if (fileList.length === 0) {
      return;
    }

    const target = {
      ...fileList[0],
      status: UPLOAD_SUCCESS,
      fileFrom: LOCAL,
      fileType: cardEnd,
      originFileObj: fileList[0]
    };

    const targetIndex = cardEnd === BL_ORIGINAL ? 0 : 1;

    const newFileList = [...this.fileList];
    newFileList[targetIndex] = target;

    if (!this.isControled) {
      this.setState({
        fileList: newFileList
      });
    }

    if (typeof onChange === 'function') {
      onChange({ fileList: newFileList });
    }
  };

  render() {
    const { currentUid, cropVisible, imgSrc, imgName, myResourceLibVisible } = this.state;
    const [frontend, backend] = this.fileList;

    const { disabled = false, crop, fetchLicense, fetchMaterial, materialTableProps = {}, licenseTableProps = {}, onPreview } = this.props;
    const { aspectRatio, maxWidth, maxHeight } = crop || {};

    return (
      <>
        <BusinessLicItem
          disabled={disabled}
          type={BL_ORIGINAL}
          file={frontend}
          uploadOptions={{ multiple: false, accept: 'image/*' }}
          onUpload={([file]) => this.handleUpload(BL_ORIGINAL, file)}
          onSelect={() => this.handleSelect(BL_ORIGINAL)}
          onDelete={() => this.handleDelete(frontend.originFileObj)}
          onAbort={() => this.handleAbort(frontend.originFileObj)}
          onPreview={onPreview}
        />

        <BusinessLicItem
          disabled={disabled}
          type={BL_COPY}
          file={backend}
          uploadOptions={{ multiple: false, accept: 'image/*' }}
          onUpload={([file]) => this.handleUpload(BL_COPY, file)}
          onSelect={() => this.handleSelect(BL_COPY)}
          onDelete={() => this.handleDelete(backend.originFileObj)}
          onAbort={() => this.handleAbort(backend.originFileObj)}
          onPreview={onPreview}
        />

        <MyResourceLib
          visible={myResourceLibVisible}
          currentUid={currentUid}
          limitCount={1}
          fetchLicense={fetchLicense}
          fetchMaterial={fetchMaterial}
          materialTableProps={materialTableProps}
          licenseTableProps={licenseTableProps}
          onCancel={this.toggleMyResourceLibVisible}
          onOk={this.handleSelectMyResource}
        />
        <CropModal
          visible={cropVisible}
          currentUid={currentUid}
          onCancel={this.toggleCropVisible}
          onOk={this.handleUploadCropImg}
          cropProps={{ aspectRatio, imgSrc, imgName, maxWidth, maxHeight, maxFileSize: this.perFileLimitSize }}
        />
      </>
    );
  }
}

export default IDCardUpload;

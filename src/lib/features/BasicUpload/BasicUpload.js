/* eslint-disable no-invalid-this */
import React from 'react';
import { message } from 'antd';

import MyResourceLib from '../MyResourceLib';
import CropModal from '../CropModal';
import UploadButton from './UploadButton';
import UploadedFieldList from './UploadedFileList';

import Uploader from '../../core/Uploader';

import { UPLOADING, UPLOAD_SUCCESS, UPLOAD_FAIL } from '../../constants/uploadStatus';
import { LOCAL } from '../../constants/fileFrom';

import { readFile, byteConverMB, isImgExt } from '../../utils/index';
class BasicUpload extends React.Component {
  constructor(props) {
    super(props);

    const options = this.getUploaderOptions(props);

    this.uploader = new Uploader(options);

    this.state = {
      imgName: 'test',
      imgSrc: null,
      currentUid: null,
      cropVisible: false,
      myResourceLibVisible: false,
      myResourceLibLimitCount: props.limit.count,
      fileList: []
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

  // 还能上传的文件数量
  get fileListLess() {
    const { limit = {} } = this.props;
    const { count = Infinity } = limit;
    const less = count - this.fileList.length;

    return less;
  }

  // 是否限制上传
  get isCountLimited() {
    return this.fileListLess <= 0;
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

  startUpload = (file, uid) => {
    const { onChange } = this.props;
    this.uploader.startUpload(file); // file 可能是复数可能是一个file对象

    // 如果uid存在，则表示重新上传，file为一个file对象
    if (uid) {
      const targetIndex = this.fileList.findIndex((i) => i.uid === uid);

      const fileList = [
        ...this.fileList.slice(0, targetIndex),
        {
          originFileObj: file,
          name: file.name,
          uid: file.uid,
          status: UPLOADING,
          fileFrom: LOCAL,
          fileType: null
        },
        ...this.fileList.slice(targetIndex + 1)
      ];

      if (!this.isControled) {
        this.setState({ fileList });
      }

      if (typeof onChange === 'function') {
        onChange({ file, fileList });
      }
    } else {
      const fileList = file.map((fileitem) => ({
        originFileObj: fileitem,
        name: fileitem.name,
        uid: fileitem.uid,
        status: UPLOADING,
        fileFrom: LOCAL
      }));
      const newFileList = this.fileList.concat(fileList);

      if (!this.isControled) {
        this.setState({
          fileList: newFileList
        });
      }

      if (typeof onChange === 'function') {
        onChange({ fileList: newFileList });
      }
    }
  };

  // 选择上传
  handleUpload = async (files) => {
    const { limit } = this.props;
    const { count = Infinity } = limit;
    const total = this.fileList.length + files.length;

    // 上传数量限制
    if (this.isCountLimited) return;

    let uploadFiles = files;
    if (total > count) {
      // 一次性选择超过限制，应丢弃掉一些文件
      uploadFiles = files.slice(0, this.fileListLess);
    }

    // 如果没有开启裁切，则在选择文件就对大小限制
    if (!this.props.crop.enabled) {
      uploadFiles.forEach((fileitem, index) => {
        if (byteConverMB(fileitem.size) > this.perFileLimitSize) {
          uploadFiles.splice(index, 1);
          message.info(`${fileitem.name} 文件大小超过${this.perFileLimitSize}M`);
        }
      });
      // 如果都被过滤掉了要判断上传长度是否为0
      if (uploadFiles.length === 0) {
        return;
      }
    } else {
      // 裁减处理
      const [, fileType] = uploadFiles[0].name.split('.');
      if (isImgExt(fileType)) {
        const imgSrc = await readFile(uploadFiles[0]);

        this.setState({
          currentUid: null,
          imgSrc,
          imgName: uploadFiles[0].name.split('.')[0],
          cropVisible: true
        });

        return;
      }
    }

    // 如果不裁切的话就直接上传
    this.startUpload(uploadFiles);
  };

  // 处理上传进度
  handleProgress = (e, file) => {
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
      // 如果需要fileUnid，则由afterUpload实现
      finalResponse = afterUpload(response);
    }

    const fileList = [
      ...this.fileList.slice(0, targetIndex),
      {
        ...target,
        // 当进度显示百分百的时候距离上传成功事件还有一定的时间，此时人为修改掉最大百分比为99，并在成功事件中设置为100
        response,
        status: UPLOAD_SUCCESS,
        url: finalResponse.url,
        percent: 100, // 参考上面进度事件的描述
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

  handleAbort = (file) => {
    console.log('取消上传', file);
    this.handleDelete(file);

    this.uploader.abort(file);
  };

  handleDelete = (file) => {
    console.log('删除文件', file.uid);
    const { onChange } = this.props;
    const { uid } = file;

    const targetIndex = this.fileList.findIndex((file) => file.uid === uid);
    const fileList = [...this.fileList.slice(0, targetIndex), ...this.fileList.slice(targetIndex + 1)];

    if (!this.isControled) {
      this.setState({
        fileList
      });
    }

    if (typeof onChange === 'function') {
      onChange({ file, fileList });
    }
  };

  handleReUpload = async ({ uid }, file) => {
    console.log('重新上传', uid, file);
    const { crop = {} } = this.props;
    if (!crop.enabled) {
      if (byteConverMB(file.size) > this.perFileLimitSize) {
        // uploadFiles.splice(index, 1);
        message.info(`${file.name} 文件大小超过${this.perFileLimitSize}M`);
        return;
      }
    } else {
      const [, fileType] = file.name.split('.');
      if (isImgExt(fileType)) {
        // 裁减处理
        const imgSrc = await readFile(file);

        this.setState({
          imgSrc,
          currentUid: uid,
          imgName: file.name.split('.')[0],
          cropVisible: true
        });

        return;
      }
    }

    // 没有裁切就直接上传
    this.startUpload(file, uid);
  };

  // 选择复用资源库
  handleSelect = () => {
    this.toggleMyResourceLibVisible(this.fileListLess);
  };

  handleReSelect = ({ uid }) => {
    console.log('重新资料复用', uid);
    this.setState(() => ({
      currentUid: uid
    }));
    this.toggleMyResourceLibVisible(1);
  };

  handleJoinLib = (unid) => {
    console.log('加入我的资料库', unid);
  };

  // 切换我的资源科的显隐
  toggleMyResourceLibVisible = (limitCount) => {
    const { myResourceLibVisible } = this.state;

    this.setState({
      myResourceLibVisible: !myResourceLibVisible,
      myResourceLibLimitCount: limitCount
    });
  };

  toggleCropVisible = () => {
    const { cropVisible } = this.state;

    this.setState({
      cropVisible: !cropVisible
    });
  };

  handleUploadCropImg = (file, uid) => {
    this.startUpload(uid ? file : [file], uid);

    this.toggleCropVisible();
  };

  handleSelectMyResource = (fileList, uid) => {
    const { onChange } = this.props;

    this.toggleMyResourceLibVisible();

    if (fileList.length === 0) {
      return;
    }

    let newFileList;
    if (uid) {
      const targetIndex = this.fileList.findIndex((item) => item.uid === uid);

      newFileList = [
        ...this.fileList.slice(0, targetIndex),
        {
          ...fileList[0],
          fileUnid: fileList[0].fileId,
          fileFrom: LOCAL,
          fileType: null,
          status: UPLOAD_SUCCESS
        },
        ...this.fileList.slice(targetIndex + 1)
      ];
    } else {
      const normalizeFileList = fileList.map((item) => ({
        ...item,
        fileUnid: item.fileId,
        fileFrom: LOCAL,
        fileType: null,
        status: UPLOAD_SUCCESS
      }));

      newFileList = this.fileList.concat(normalizeFileList);
    }

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
    const { currentUid, imgName, imgSrc, cropVisible, myResourceLibVisible, myResourceLibLimitCount } = this.state;
    const {
      style = {},
      disabled,
      accept,
      multiple = false,
      crop,
      fetchLicense,
      fetchMaterial,
      materialTableProps = {},
      licenseTableProps = {},
      onPreview
    } = this.props;

    const { enabled = false, aspectRatio, maxWidth, maxHeight } = crop || {};
    const multipleEnabled = enabled ? false : multiple;

    return (
      <div style={{ marginBottom: 8, ...style }}>
        <UploadedFieldList
          fileList={this.fileList}
          uploadOptions={{ accept, multiple: multipleEnabled }}
          onAbort={this.handleAbort}
          onDelete={this.handleDelete}
          onPreview={onPreview}
          onReUpload={this.handleReUpload}
          onReSelect={this.handleReSelect}
          onJoinLib={this.handleJoinLib}
        >
          {!this.isCountLimited && (
            <UploadButton
              disabled={disabled}
              uploadOptions={{ accept, multiple: multipleEnabled }}
              onUpload={this.handleUpload}
              onSelect={this.handleSelect}
            />
          )}
        </UploadedFieldList>

        <MyResourceLib
          visible={myResourceLibVisible}
          currentUid={currentUid}
          limitCount={myResourceLibLimitCount}
          fetchLicense={fetchLicense}
          fetchMaterial={fetchMaterial}
          materialTableProps={materialTableProps}
          licenseTableProps={licenseTableProps}
          onCancel={this.toggleMyResourceLibVisible}
          onOk={this.handleSelectMyResource}
        />

        <CropModal
          visible={cropVisible}
          onCancel={this.toggleCropVisible}
          onOk={this.handleUploadCropImg}
          currentUid={currentUid}
          cropProps={{ aspectRatio, imgSrc, imgName, maxWidth, maxHeight, maxFileSize: this.perFileLimitSize }}
        />
      </div>
    );
  }
}

export default BasicUpload;

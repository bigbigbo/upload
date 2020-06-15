import React, { useRef, useState } from 'react';
import { Slider } from 'antd';

import Cropper from 'react-cropper';
import Modal from '../../components/Modal';

import CloseIcon from '../../assets/icons/close.png';

import 'cropperjs/dist/cropper.css';
import styles from './styles/index.module.less';

import { convertBase64UrlToFile, byteConverMB } from '../../utils/index';

function formatter(value) {
  return `${value}°`;
}
const CropModal = (props) => {
  const { visible = true, onCancel, onOk, cropProps, currentUid } = props;
  const { imgName, imgSrc, aspectRatio, maxWidth, maxHeight, maxFileSize } = cropProps;

  const cropperRef = useRef();

  const handleOk = () => {
    let fileSizeCheckPass = false;
    let file;
    let quality = 1;

    while (!fileSizeCheckPass) {
      const data = cropperRef.current.getCroppedCanvas({ width: maxWidth * quality, height: maxHeight * quality }).toDataURL();

      const blob = convertBase64UrlToFile(data, imgName);
      file = new File([blob], imgName + '.jpeg', { type: 'image/jpeg' });
      if (byteConverMB(file.size) < maxFileSize) {
        fileSizeCheckPass = true;
      } else {
        quality -= 0.1;
      }
    }

    if (typeof onOk === 'function') {
      onOk(file, currentUid);
    }
  };

  const handleRotateChange = (value) => {
    cropperRef.current.rotateTo(value);
  };

  return (
    <Modal visible={visible}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>图片调整</p>
          <img className={styles.close} src={CloseIcon} title="关闭" alt="关闭" onClick={onCancel} />
        </div>

        <div className={styles.body}>
          <div className={styles.content}>
            <Cropper ref={cropperRef} src={imgSrc} style={{ width: '100%', height: 406 }} aspectRatio={aspectRatio} />

            <Slider tipFormatter={formatter} defaultValue={0} min={-180} max={180} onChange={handleRotateChange} />
          </div>
        </div>

        <div className={styles.footer}>
          <div onClick={onCancel} className={`${styles.button} ${styles.button__cancel}`}>
            取消
          </div>
          <div onClick={handleOk} className={`${styles.button} ${styles.button__ok}`}>
            确定
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CropModal;

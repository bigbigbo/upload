import React, { useMemo } from 'react';

import Selecter from '../../core/Selecter';
import Progress from '../../components/Progress';

import WordIcon from '../../assets/icons/clsc_icon_word.png';
import ExcelIcon from '../../assets/icons/clsc_icon_excel.png';
import PdfIcon from '../../assets/icons/clsc_icon_pdf.png';
import UnknownIcon from '../../assets/icons/clsc_icon_wz.png';

import UploadIcon from '../../assets/icons/clsc_btn_bdsc.png';
import SelectIcon from '../../assets/icons/clsc_btn_jrzlk.png';
import PreviewIcon from '../../assets/icons/clsc_btn_yl.png';

import UploadingIcon from '../../assets/icons/clsc_icon_pic.png';

import styles from '../styles/Basic.module.less';

import { getFileExtension } from '../../utils';

import { UPLOADING, UPLOAD_FAIL } from '../../constants/uploadStatus';

const EXTTYPE_ICON = {
  doc: WordIcon,
  docx: WordIcon,
  xls: ExcelIcon,
  xlsx: ExcelIcon,
  pdf: PdfIcon
};

const imageExt = ['png', 'jpeg', 'jpg', 'gif'];

const UploadedFileItem = (props) => {
  const { uploadOptions = {}, status, progress, file, name, url, onAbort, onPreview, onDelete, onReUpload, onReSelect, onJoinLib } = props;

  const fileExt = useMemo(() => getFileExtension(name), [name]);
  const isImage = imageExt.includes(fileExt);
  const displayThumb = isImage ? url : EXTTYPE_ICON[fileExt] || UnknownIcon;
  const progressText = parseInt(progress, 10) + '%';

  const isUploadFail = status === UPLOAD_FAIL;

  if (status === UPLOADING) {
    return (
      <div className={`${styles.file__item} ${styles['file__item--uploading']}`}>
        <img
          className={`${styles.uploading__icon} ${isImage ? styles.uploading__img__icon : ''}`}
          src={isImage ? UploadingIcon : UnknownIcon}
          alt="上传中"
        />
        <Progress style={{ margin: 8 }} progress={progress} />
        <p className={styles.progress__text}>{progressText}</p>
        <div className={styles.abort__mask}>
          <p className={styles.abort} onClick={onAbort}>
            取消上传
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.file__item} ${styles['file__item--uploaded']} ${isUploadFail ? styles['file__item--fail'] : ''}`}>
      <div className={isImage ? styles.file__thumb : styles.file__exticon}>
        <img src={displayThumb} alt={name} />
      </div>

      <p className={`${styles.file__name} ${isUploadFail ? styles['file__name--fail'] : ''}`} title={name}>
        {name}
      </p>

      <div className={styles.mask}>
        <div className={styles.delete} title="删除" onClick={onDelete}>
          删除
        </div>
        <div className={styles.actions}>
          <a onClick={() => onPreview(file)}>
            <img src={PreviewIcon} title="预览" alt="预览" />
          </a>
          <Selecter style={{ display: 'inline-block' }} onSelect={onReUpload} {...uploadOptions}>
            <img src={UploadIcon} title="重新上传" alt="重新上传" />
          </Selecter>
          <img src={SelectIcon} title="重新选择材料" alt="重新选择材料" onClick={onReSelect} />
        </div>
        {!isUploadFail && (
          <p className={styles.join__lib} onClick={onJoinLib}>
            加入资料库
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadedFileItem;

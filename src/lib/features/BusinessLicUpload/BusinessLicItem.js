import React, { useState, useMemo, useCallback } from 'react';

import Selecter from '../../core/Selecter';
import Progress from '../../components/Progress';

import idCardFront from '../../assets/icons/clsc_img_yyzzz.png';
import idCardBack from '../../assets/icons/clsc_img_yyzzf.png';
import defaultIcon from '../../assets/icons/clsc_icon_sfzsc.png';
import uploadIcon from '../../assets/icons/clsc_btn_bdsc_nor.png';
import uploadHoverIcon from '../../assets/icons/clsc_btn_bdsc_hov.png';
import selectIcon from '../../assets/icons/clsc_btn_zlfy_nor.png';
import selectHoverIcon from '../../assets/icons/clsc_btn_zlfy_hov.png';

import UploadIcon from '../../assets/icons/clsc_btn_bdsc.png';
import SelectIcon from '../../assets/icons/clsc_btn_jrzlk.png';
import PreviewIcon from '../../assets/icons/clsc_btn_yl.png';

import UploadingIcon from '../../assets/icons/clsc_icon_pic.png';

import styles from '../styles/BusinessLic.module.less';

import { UPLOADING, UPLOAD_SUCCESS } from '../../constants/uploadStatus';
import { BL_ORIGINAL } from '../../constants/fileType';

const IDCard = (props) => {
  const { type = BL_ORIGINAL, file = {}, uploadOptions = {}, onPreview, onUpload, onSelect, onDelete, onAbort, onJoinLib } = props;

  const initialHoverState = { upload: false, select: false };
  const [hover, setHover] = useState(initialHoverState);

  const displayText = useMemo(() => {
    if (hover.upload) return '本地上传';
    if (hover.select) return '材料复用';

    return '选择上传';
  }, [hover]);

  const handleHoverChange = useCallback((target, status) => {
    if (status === false) {
      setHover(initialHoverState);
    } else {
      setHover({
        ...initialHoverState,
        [target]: true
      });
    }
  }, []);

  const isHover = useMemo(() => Object.values(hover).some((i) => i), [hover]);

  const isFrontend = type === BL_ORIGINAL;
  const displayInfo = {
    thumb: isFrontend ? idCardFront : idCardBack,
    text: isFrontend ? '营业执照正本' : '营业执照副本'
  };

  // 默认状态下的展示，即等待用户选择图片上传
  const defaultDisplay = (
    <div className={styles.card__default}>
      <img className={styles.card__icon__default} src={displayInfo.thumb} alt={displayInfo.text} />
      <p className={styles.title}>{displayInfo.text}</p>
      <img className={styles.upload__icon} src={defaultIcon} alt="上传" />
    </div>
  );

  // 默认状态下的操作展示
  const defaultMask = (
    <div className={styles['upload-actions']}>
      <div
        className={styles.upload__action}
        title="本地上传"
        onMouseEnter={() => handleHoverChange('upload', true)}
        onMouseLeave={() => handleHoverChange('upload', false)}
      >
        <Selecter onSelect={onUpload} {...uploadOptions}>
          <img className={styles.action__icon} src={hover.upload ? uploadHoverIcon : uploadIcon} alt="上传" />
        </Selecter>
      </div>

      <div
        className={styles.select__action}
        title="材料复用"
        onClick={onSelect}
        onMouseEnter={() => handleHoverChange('select', true)}
        onMouseLeave={() => handleHoverChange('select', false)}
      >
        <img className={styles.action__icon} src={hover.select ? selectHoverIcon : selectIcon} alt="上传" />
      </div>

      <p className={`${styles.text} ${isHover ? styles['text--hover'] : ''}`}>{displayText}</p>
    </div>
  );

  // 上传成功后的状态展示
  const doneDisplay = <img className={styles.done__thumb} src={file.url} alt={displayInfo.text} />;

  const doneMask = (
    <div className={styles.done__actions}>
      <div className={styles.delete} title="删除" onClick={onDelete}>
        删除
      </div>
      <div className={styles.actions}>
        <a onClick={() => onPreview(file)}>
          <img src={PreviewIcon} title="预览" alt="预览" />
        </a>
        <Selecter style={{ display: 'inline-block' }} onSelect={onUpload} {...uploadOptions}>
          <img src={UploadIcon} title="重新上传" alt="重新上传" />
        </Selecter>
        <img src={SelectIcon} title="重新选择材料" alt="重新选择材料" onClick={onSelect} />
      </div>
      <p className={styles.join__lib} onClick={onJoinLib}>
        加入资料库
      </p>
    </div>
  );

  // 上传中状态显示
  const progressText = parseInt(file.percent || 0, 10) + '%';
  const uploadingDisplay = (
    <div className={styles.uploading__actions}>
      <img className={styles.uploading__icon} src={UploadingIcon} alt="上传中" />
      <Progress style={{ margin: 8 }} progress={file.percent} />
      <p className={styles.progress__text}>{progressText}</p>
    </div>
  );

  const uploadingMask = (
    <p className={styles.abort} onClick={onAbort}>
      取消上传
    </p>
  );

  const displayMap = {
    [UPLOADING]: uploadingDisplay,
    [UPLOAD_SUCCESS]: doneDisplay
  };

  const maskMap = {
    [UPLOADING]: uploadingMask,
    [UPLOAD_SUCCESS]: doneMask
  };

  return (
    <div className={styles.card__wrapper}>
      <div className={styles.card__inner}>{displayMap[file.status] || defaultDisplay}</div>

      <div className={`${styles.mask} ${[UPLOADING, UPLOAD_SUCCESS].includes(file.status) ? styles['mask--black'] : ''}`}>
        {maskMap[file.status] || defaultMask}
      </div>
    </div>
  );
};

export default IDCard;

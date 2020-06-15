import React, { useState, useMemo, useCallback } from 'react';

import Selecter from '../../core/Selecter';

import styles from '../styles/Basic.module.less';

import uploadIcon from '../../assets/icons/clsc_btn_bdsc_nor.png';
import uploadHoverIcon from '../../assets/icons/clsc_btn_bdsc_hov.png';
import selectIcon from '../../assets/icons/clsc_btn_zlfy_nor.png';
import selectHoverIcon from '../../assets/icons/clsc_btn_zlfy_hov.png';
import defaultIcon from '../../assets/icons/clsc_icon_upload.png';

const UploadButton = (props) => {
  const { disabled = false, uploadOptions = {}, onUpload, onSelect } = props;

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

  return (
    <div className={styles.select__wrapper}>
      <div className={styles.default__icon}>
        <img src={defaultIcon} alt="上传" />
      </div>

      <div className={styles.select__actions}>
        <div
          className={styles.upload__action}
          title="本地上传"
          onMouseEnter={() => handleHoverChange('upload', true)}
          onMouseLeave={() => handleHoverChange('upload', false)}
        >
          <Selecter disabled={disabled} onSelect={onUpload} {...uploadOptions}>
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
      </div>

      <p className={`${styles.text} ${isHover ? styles['text--hover'] : ''}`}>{displayText}</p>
    </div>
  );
};

export default UploadButton;

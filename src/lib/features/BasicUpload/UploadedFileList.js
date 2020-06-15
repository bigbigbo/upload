import React from 'react';

import UploadedFileItem from './UploadedFileItem';

import styles from '../styles/Basic.module.less';

const UploadedFileList = (props) => {
  const { children, fileList = [], uploadOptions, onAbort, onDelete, onPreview, onReUpload, onReSelect, onJoinLib } = props;

  return (
    <div className={styles.file__list}>
      {fileList.map((file) => {
        const { uid, name, url, status, percent = 0 } = file;
        return (
          <UploadedFileItem
            key={uid}
            file={file}
            name={name}
            url={url}
            status={status}
            progress={percent}
            uploadOptions={uploadOptions}
            onAbort={() => onAbort(file)}
            onPreview={onPreview}
            onDelete={() => onDelete(file)}
            onReUpload={([value]) => onReUpload(file, value)}
            onReSelect={() => onReSelect(file)}
            onJoinLib={() => onJoinLib(file)}
          />
        );
      })}
      {children}
    </div>
  );
};

export default UploadedFileList;

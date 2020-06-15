import React, { useRef, useCallback } from 'react';

import { uid } from '../utils';

const Selecter = (props) => {
  const { id, accept, name, multiple = false, disabled, onSelect, children, style = {} } = props;

  const inputRef = useRef(null);

  const handleClick = useCallback((e) => {
    const ele = inputRef.current;
    if (!ele) return;
    ele.value = '';
    ele.click();
  }, []);

  const handleSelect = useCallback((e) => {
    const files = e.target.files;
    const filesArr = files.length ? [...files] : [files];

    filesArr.forEach((file) => {
      file.uid = uid();
    });

    if (onSelect && typeof onSelect === 'function') {
      onSelect(filesArr);
    }
  }, []);

  return (
    <div role="application" style={style} onClick={handleClick}>
      <input
        type="file"
        aria-hidden
        id={id}
        name={name}
        accept={accept}
        style={{ display: 'none' }}
        multiple={multiple}
        disabled={disabled}
        ref={inputRef}
        onChange={handleSelect}
      />
      {children}
    </div>
  );
};

export default Selecter;

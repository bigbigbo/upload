import React from 'react';

import styles from './styles/index.module.less';

const Progress = (props) => {
  const { style = {}, progress } = props;

  return (
    <div className={styles.progress__outer} style={style}>
      <div className={styles.progress__enter}>
        <div className={styles.progress__bg} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Progress;

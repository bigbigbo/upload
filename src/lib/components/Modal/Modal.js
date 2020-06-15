/* eslint-disable react/no-unsafe */
import React from 'react';
import { createPortal } from 'react-dom';

import styles from './styles/index.module.less';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.el = document.createElement('div');
    this.modalRoot = document.getElementById('modal-root');

    if (props.visible) {
      document.body.style.overflow = 'hidden';
    }
  }

  componentDidMount() {
    if (!this.modalRoot) {
      const _modalRoot = document.createElement('div');
      _modalRoot.id = 'modal-root';
      document.body.appendChild(_modalRoot);

      this.modalRoot = _modalRoot;
    }

    this.modalRoot.appendChild(this.el);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  render() {
    const { visible } = this.props;

    if (!visible) return null;

    return createPortal(<div className={styles.modal}>{this.props.children}</div>, this.el);
  }
}

export default Modal;

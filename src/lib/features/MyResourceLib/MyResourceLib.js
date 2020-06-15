/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import Modal from '../../components/Modal';

import CloseIcon from '../../assets/icons/close.png';

import styles from './styles/index.module.less';
// eslint-disable-next-line no-unused-vars
const MATERIAL = 'MATERIAL';
const LICENSE = 'LICENSE';

const MyResourceLib = (props) => {
  const {
    visible,
    currentUid,
    limitCount = Infinity,
    fetchLicense,
    fetchMaterial,
    materialTableProps = {},
    licenseTableProps = {},
    onCancel,
    onOk
  } = props;

  const [activeKey, setActiveKey] = useState(LICENSE);
  const [searchValue, setSearchValue] = useState('');

  // 我的证照分页数据
  const [licenseData, setLicenseData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [licenseCurrPage, setLicenseCurrPage] = useState(1);
  const [materialCurrPage, setMaterialCurrPage] = useState(1);
  const [licenseTotal, setLicenseTotal] = useState(0);
  const [materialTotal, setMaterialTotal] = useState(0);
  const [licenseSelectedRowKeys, setLicenseSelectedRowKeys] = useState([]);
  const [materialSelectedRowKeys, setMaterialSelectedRowKeys] = useState([]);
  const [licenseSelectedRows, setLicenseSelectedRows] = useState([]);
  const [materialSelectedRows, setMaterialSelectedRows] = useState([]);

  const isLicense = activeKey === LICENSE;

  const fetchData = isLicense ? fetchLicense : fetchMaterial;
  const setDataSource = isLicense ? setLicenseData : setMaterialData;
  const setCurrPage = isLicense ? setLicenseCurrPage : setMaterialCurrPage;
  const setTotal = isLicense ? setLicenseTotal : setMaterialTotal;

  // 行选择
  const licenseRowSelection = {
    selectedRowKeys: licenseSelectedRowKeys,
    onChange(selectedRowKeys, selectedRows) {
      // 要限制选择的数量
      if (selectedRowKeys.length > limitCount) {
        message.info(`最多只能选择${limitCount}条`);
        selectedRowKeys = selectedRowKeys.slice(0, limitCount);
        selectedRows = selectedRows.slice(0, limitCount);
      }
      setLicenseSelectedRowKeys(selectedRowKeys);
      setLicenseSelectedRows(selectedRows);
    }
  };
  const materialRowSelection = {
    selectedRowKeys: materialSelectedRowKeys,
    onChange(selectedRowKeys, selectedRows) {
      // 要限制选择的数量
      if (selectedRowKeys.length > limitCount) {
        message.info(`最多只能选择${limitCount}条`);
        selectedRowKeys = selectedRowKeys.slice(0, limitCount);
        selectedRows = selectedRows.slice(0, limitCount);
      }
      setMaterialSelectedRowKeys(selectedRowKeys);
      setMaterialSelectedRows(selectedRows);
    }
  };

  const fetchDataCore = ({ currPage, searchKeyword }) => {
    fetchData({ currPage, pageSize: 5, searchKeyword }).then((response) => {
      if (response.flag) {
        setDataSource(response.data);
        setTotal(response.recordsTotal);
        setCurrPage(currPage);
      }
    });
  };

  useEffect(() => {
    if (!visible) return;

    fetchDataCore({ currPage: 1, searchKeyword: '' });

    return () => {
      setLicenseData([]);
      setMaterialData([]);
      setLicenseCurrPage(1);
      setMaterialCurrPage(1);
      setLicenseTotal(0);
      setMaterialTotal(0);
      setLicenseSelectedRowKeys([]);
      setMaterialSelectedRowKeys([]);
      setLicenseSelectedRows([]);
      setMaterialSelectedRows([]);
    };
  }, [visible]);

  const handleSearchValueChange = ({ target: { value } }) => {
    setSearchValue(value);
    if (value === '') {
      handleSearch('');
    }
  };

  const handleSearchClick = () => {
    handleSearch(searchValue);
  };

  // 每次搜索的时候要把选择清空
  const handleSearch = (value) => {
    setLicenseSelectedRowKeys([]);
    setMaterialSelectedRowKeys([]);
    setLicenseSelectedRows([]);
    setMaterialSelectedRows([]);
    fetchDataCore({ currPage: 1, searchKeyword: value });
  };

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const selectedRows = isLicense ? licenseSelectedRows : materialSelectedRows;
      const normalizeSelectedRows = selectedRows.map((item) => ({
        ...item,
        name: item.licenseName,
        uid: item.fileId
      }));
      onOk(normalizeSelectedRows, currentUid);
    }
  };

  const handlePaginationChange = (page) => {
    fetchDataCore({ currPage: page, searchKeyword: '' });
  };

  return (
    <Modal visible={visible}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.title}>请选择资料库文件</p>
          <img className={styles.close} src={CloseIcon} title="关闭" alt="关闭" onClick={onCancel} />
        </div>

        <div className={styles.body}>
          <div className={styles.sider}>
            <ul className={styles.tabs}>
              {/* <li className={`${styles.tab} ${activeKey === MATERIAL ? styles['tab--active'] : ''}`} onClick={() => setActiveKey(MATERIAL)}>
                我的资料
              </li> */}
              <li className={`${styles.tab} ${isLicense ? styles['tab--active'] : ''}`} onClick={() => setActiveKey(LICENSE)}>
                我的证照
              </li>
            </ul>
          </div>

          <div className={styles.content}>
            <div className={styles.search}>
              <span className={styles.search__label}>资料名称：</span>
              <input className={styles.search__input} type="text" value={searchValue} onChange={handleSearchValueChange} />
              <a className={styles.search__button} onClick={handleSearchClick}>
                搜索
              </a>
            </div>
            <div style={{ height: 340 }}>
              {isLicense ? (
                <Table
                  {...licenseTableProps}
                  size="middle"
                  pagination={{
                    total: licenseTotal,
                    pageSize: 5,
                    current: licenseCurrPage,
                    onChange: handlePaginationChange
                  }}
                  dataSource={licenseData}
                  rowSelection={licenseRowSelection}
                />
              ) : (
                <Table
                  {...materialTableProps}
                  size="middle"
                  pagination={{
                    total: materialTotal,
                    pageSize: 5,
                    current: materialCurrPage,
                    onChange: handlePaginationChange
                  }}
                  dataSource={materialData}
                  rowSelection={materialRowSelection}
                />
              )}
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
        </div>
      </div>
    </Modal>
  );
};

export default MyResourceLib;

import React from 'react';

import Upload, { IDCardUpload, BusinessLicUpload } from '../lib';

import './App.css';

const dataSource = [
  {
    createtime: '2018-06-15 16:56:37.365',
    fileNumber: '1111-ZS234134-350521198804043210',
    issueUnitname: '泉州市教育局',
    'metadata.abstractCode': '5etsnMG7Y',
    holderCode: '350521198804043210',
    holder: '陈三其',
    valid_time_begin: '2018-06-15 00:00:00.000',
    licenseName: '中华人民共和国教师资格证书',
    valid_time_end: '2028-06-15 00:00:00.000',
    templateId: '13515a9d3e1b4b439fdc9426d40fb8ad',
    licenseTypeName: '教师资格证',
    catalogId: '8954a91207514851b7687b7f42817385',
    issue_date: '2018-06-15 00:00:00.000',
    projectCode: null,
    licenseNumber: 'ZS234134',
    state: 11,
    licenseId: '54348732ee4449cebbf4c841d2cf23e2',
    category: 1,
    issueUnit: 'e7f8f1c933e341f4b5eea561f2df75a4',
    fileId: '5b237f4d6b879738fa965e50'
  },
  {
    createtime: '2018-06-15 16:53:31.247',
    fileNumber: '1111-闽教育(2018)74034-350521198804043210',
    issueUnitname: '泉州市教育局',
    'metadata.abstractCode': '5etsct6Zj',
    holderCode: '350521198804043210',
    holder: '陈三其',
    valid_time_begin: '2018-06-15 00:00:00.000',
    licenseName: '中华人民共和国教师资格证书',
    valid_time_end: '2023-06-15 00:00:00.000',
    templateId: '13515a9d3e1b4b439fdc9426d40fb8ad',
    licenseTypeName: '教师资格证',
    catalogId: '8954a91207514851b7687b7f42817385',
    issue_date: '2018-06-15 00:00:00.000',
    projectCode: null,
    licenseNumber: '闽教育(2018)74034',
    state: 11,
    licenseId: '2acd019f4bcb4a9193174d97d92779d8',
    category: 1,
    issueUnit: 'e7f8f1c933e341f4b5eea561f2df75a4',
    fileId: '5b237e936b879738fa965e1e'
  },
  {
    createtime: '2018-06-15 16:46:32.691',
    fileNumber: '000988993-闽建安(2018)363962-350521198804043210',
    issueUnitname: '泉州市住房和城乡建设局',
    'metadata.abstractCode': '5ets0wi6L',
    holderCode: '350521198804043210',
    holder: '陈三其',
    valid_time_begin: '2018-06-15 00:00:00.000',
    licenseName: '项目负责人安全任职资格证',
    valid_time_end: '2028-06-15 00:00:00.000',
    templateId: '79f9aacb82f544f6bbe6a346a8aa2611',
    licenseTypeName: '安全主要负责人证',
    catalogId: '1660bd0ef4f74fb8b63b50b5c93c8e79',
    issue_date: '2018-06-15 00:00:00.000',
    projectCode: null,
    licenseNumber: '闽建安(2018)363962',
    state: 11,
    licenseId: '4d2f4ba008664387a3ae3acd290f4274',
    category: 1,
    issueUnit: '43de11ef86bf4db4953971118efa289d',
    fileId: '5b237cf06b879738fa965dfe'
  },
  {
    createtime: '2018-06-15 14:48:53.849',
    fileNumber: '1111-闽建安(2018)791447-350521198804043210',
    issueUnitname: '泉州市鲤城区住房和建设局',
    'metadata.abstractCode': '5etle+72a',
    holderCode: '350521198804043210',
    holder: '陈三其',
    valid_time_begin: '2018-06-15 00:00:00.000',
    licenseName: '项目负责人安全任职资格证',
    valid_time_end: '2028-06-15 00:00:00.000',
    templateId: '8de5610ad04845eba178aef380ebb89e',
    licenseTypeName: '',
    catalogId: 'f419d12c0d254efa87632108a8bb8c9b',
    issue_date: '2018-06-15 00:00:00.000',
    projectCode: null,
    licenseNumber: '闽建安(2018)791447',
    state: 11,
    licenseId: '78e744bb070d49d0b9eeb05928ae343a',
    category: 1,
    issueUnit: 'a35b55a07bf0426db715df62dab8e67c',
    fileId: '5b2361626b879738fa965b07'
  },
  {
    createtime: '2018-06-10 16:49:37.575',
    fileNumber: '1111-闽建安(2018)557694-350521198804043210',
    issueUnitname: '泉州市鲤城区住房和建设局',
    'metadata.abstractCode': '5en9SkjRb',
    holderCode: '350521198804043210',
    holder: '陈三其',
    valid_time_begin: '2018-06-10 00:00:00.000',
    licenseName: '项目负责人安全任职资格证',
    valid_time_end: '2028-06-10 00:00:00.000',
    templateId: '8de5610ad04845eba178aef380ebb89e',
    licenseTypeName: '',
    catalogId: 'f419d12c0d254efa87632108a8bb8c9b',
    issue_date: '2018-06-10 00:00:00.000',
    projectCode: null,
    licenseNumber: '闽建安(2018)557694',
    state: 11,
    licenseId: 'd89e7c9c52a74995ade2af27a1861d82',
    category: 1,
    issueUnit: 'a35b55a07bf0426db715df62dab8e67c',
    fileId: '5b23518a6b879738fa965927'
  }
];

const materialTableProps = {};
const licenseTableProps = {
  rowKey: 'fileId',
  columns: [
    {
      title: '证照名称',
      dataIndex: 'licenseName',
      ellipsis: true
    },
    {
      title: '证照类型',
      dataIndex: 'licenseTypeName',
      width: 160,
      ellipsis: true
    },
    {
      title: '证件号码',
      dataIndex: 'licenseNumber',
      width: 160,
      ellipsis: true
    }
  ]
};

const fetchLicense = async (props) => {
  console.log('props', props);
  return {
    flag: true,
    data: dataSource
  };
};

function App() {
  return (
    <div className="App">
      <h3>普通文件上传</h3>
      <Upload
        crop={{
          enabled: true,
          aspectRatio: 1000 / 1000,
          maxWidth: 500,
          maxHeight: 500
        }}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        multiple
        limit={{
          count: 4,
          perFileSize: 2
        }}
        fetchLicense={fetchLicense}
        materialTableProps={materialTableProps}
        licenseTableProps={licenseTableProps}
        onChange={(v) => console.log(v)}
        onPreview={(file) => console.log('预览啊', file)}
      />

      <h3>身份证上传</h3>
      <IDCardUpload
        limit={{
          perFileSize: 2
        }}
        crop={{
          enabled: true,
          aspectRatio: 1600 / 1000,
          maxWidth: 1600,
          maxHeight: 1000
        }}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        fetchLicense={fetchLicense}
        materialTableProps={materialTableProps}
        licenseTableProps={licenseTableProps}
        onChange={(v) => console.log(v)}
        onPreview={(file) => console.log('预览啊', file)}
      />

      <h3>营业执照上传</h3>
      <BusinessLicUpload
        crop={{
          enabled: true,
          aspectRatio: 1400 / 1000,
          maxWidth: 1400,
          maxHeight: 1000
        }}
        limit={{
          perFileSize: 2
        }}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        fetchLicense={fetchLicense}
        materialTableProps={materialTableProps}
        licenseTableProps={licenseTableProps}
        onChange={(v) => console.log(v)}
        onPreview={(file) => console.log('预览啊', file)}
      />
    </div>
  );
}

export default App;

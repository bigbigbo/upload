import * as React from 'react';

export interface FileListItem {
  originFileObj: File;
  name: string;
  uid: string;
  status: 'uploading' | 'done' | 'fail';
}
export interface RequestOptions {
  filename: string;
  action: string;
  file: object;
  data: object;
  timeout: number;
  headers: object;
  withCredentials: boolean;
  method: 'GET' | 'POST';
}

type onChangeParam = {
  file: File;
  event: ProgressEvent;
  fileList: Array<FileListItem>;
};
export interface BasicUploadProps {
  accept?: string;
  limit?: number;
  multiple?: boolean;
  style?: object;
  name?: string;
  action: string;
  beforeUpload?: Promise<any> | (() => void);
  afterUpload?: (response: any) => any;
  withCredentials: boolean;
  headers?: object;
  timeout?: number;
  data?: object;
  request?: (options: RequestOptions) => Promise<any>;
  onProgress: (e: ProgressEvent, file: File) => void;
  onError: (error: any, file: File) => void;
  onSuccess: (response: any, file: File) => void;
  onChange: (options: onChangeParam) => void;
}

export interface IDCardUploadProps extends BasicUploadProps {}

export class IDCardUpload extends React.Component<IDCardUploadProps> {}

export default class BasicUpload extends React.Component<BasicUploadProps> {}

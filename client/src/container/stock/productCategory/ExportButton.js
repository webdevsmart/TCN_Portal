import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { Popover } from '../../../components/popup/popup';
import { Button } from '../../../components/buttons/buttons';

const ExportButtonPageHeader = () => {
  const [files, setFiles] = useState([]);

  const props = {
    name: 'categorySheet',
    action: '/api/stock/productCategory/uploadSheet',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: file => {
      console.log(file.type)
      if (file.type !== 'application/vnd.ms-excel') {
        message.error(`${file.name} is not a png file`);
      }
      setFiles([])
      return file.type === 'application/vnd.ms-excel' ? true : false;
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        setFiles([info.file])
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const content = (
    <>
      <Upload {...props} fileList={files}>
        <Button className="btn-outlined" size="default" transparented  type="light" outlined>
          <FeatherIcon icon="upload" /> &nbsp;&nbsp;Upload&nbsp;&nbsp;&nbsp;
        </Button>
      </Upload>
      <Button className="btn-outlined" size="default" transparented type="success" outlined>
          <FeatherIcon size={16} icon="download" /> Download
      </Button>
    </>
  );
  return (
    <Popover placement="bottomLeft" content={content} trigger="click">
      <Button size="small" type="white">
        <FeatherIcon icon="file" size={14} />
        File Action
      </Button>
    </Popover>
  );
};

export { ExportButtonPageHeader };

import React, { useState } from 'react';
import { Upload, message, notification } from 'antd';
import Axios from 'axios';
import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { Popover } from '../../../components/popup/popup';
import { Button } from '../../../components/buttons/buttons';
import FileDownload from 'js-file-download';

const ExportButtonPageHeader = ({ setTableRefresh }) => {
  const [files, setFiles] = useState([]);

  const props = {
    name: 'categorySheet',
    action: '/api/stock/productCategory/uploadSheet',
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload: file => {
      if (file.type !== 'application/vnd.ms-excel') {
        message.error(`${file.name} is not a csv file`);
      } 
      return file.type === 'application/vnd.ms-excel' ? true : false;
    },
    onChange: info => {
      setFiles([info.file])
      if ( info.file.status === 'done' ) {
        if (info.file.response.status === 'success') {
          message.success(`${info.file.name} file uploaded successfully`);
          setTableRefresh();
        } else if (info.file.response.status === 'fail') {
          message.error(`${info.file.response.message}`);
        }
      }
    },
    showUploadList: false
  };

  const downloadCategory = () => {
    Axios({
      url: "/api/stock/productCategory/downloadSheet",
      method: "get",
      responseType: 'blob'
    })
    .then( res => {
      FileDownload(res.data, 'report.csv');
    })
    .catch( err => {
      notification["warning"] ({
        message: 'Warning',
        description: 
        'Server Error',
      });
    })
  }

  const content = (
    <>
      <div style={{marginBottom: '10px'}}>
        <Upload {...props} fileList={files}>
          <Button className="btn-outlined" size="default" transparented  type="light" outlined>
            <FeatherIcon icon="upload" /> &nbsp;&nbsp;Upload&nbsp;&nbsp;&nbsp;
          </Button>
        </Upload>
      </div>
      <div>
        <Button className="btn-outlined" size="default" transparented type="success" outlined onClick={downloadCategory}>
            <FeatherIcon size={16} icon="download" /> Download
        </Button>
      </div>
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

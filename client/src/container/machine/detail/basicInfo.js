import React, { useState, useEffect } from 'react';
import { Row, Col, notification, Form, Input, Upload, message, Radio } from 'antd';
import Axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import Heading from '../../../components/heading/heading';
import { Button } from '../../../components/buttons/buttons';
import { BasicFormWrapper } from '../../styled';

const BasicInfo = ({ machineID }) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [state, setState] = useState({
    loading: false,
    previewImageUrl: '',
    imageUrl: '',
    fileList: [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
    ]
  });
  const { loading, previewImageUrl, imageUrl, fileList } = state;

  // get machine info
  const getData = () => {
    Axios.post("/api/machine/detail/getBasicData", { machineId: machineID })
    .then( res => {
      if ( res.data.status === 'success' ) {
        form.setFieldsValue( res.data.data );
        if ( res.data.data.imageUrl !== '' ) {
          setState({
            previewImageUrl: 'data:image/png;base64,' + res.data.data.imageUrl,
          });
        }
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      }
    })
    .catch( err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    })
  }
  useEffect(() => {
    getData()
  }, []);
  // end get machine info

  const handleSubmit = values => {
    const reqData = { ...values };
    delete reqData.imageFile;
    reqData.imageUrl = imageUrl;
    reqData.machineId = machineID;
    Axios.post("/api/machine/detail/saveBasicData", { ...reqData })
    .then( res => {
      if ( res.data.status === 'success' ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully Done',
        });
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      }
    })
    .catch( err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    })
  };

  // handle file
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if ( info.file.response.status === 'success' ) {
        getBase64(info.file.originFileObj, previewImageUrl =>
          setState({
            previewImageUrl: previewImageUrl,
            imageUrl: info.file.response.filename,
            loading: false,
          }),
        );
      } else {
        message.error(`${info.file.name} is not uploaded`);
      }
    }
  };

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  // end handel file

  return (
    <>
      <BasicFormWrapper>
        <Form layout="vertical" form={form} name="basicforms" onFinish={handleSubmit}>
          <Row gutter={25}>
            <Col md={12} sm={24} xs={24}>
              <Form.Item label="Machine Image" name="imageFile" className="upload-wrapper">
                <Upload
                  name="ImageFile"
                  listType="picture-card"
                  className="ImageFile-uploader"
                  showUploadList={false}
                  action="/api/stock/product/uploadProductImage"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                >
                  {previewImageUrl ? <img src={previewImageUrl} alt="ImageFile" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item label="Machine Name" name="machineName">
                <Input placeholder="Machine Name" />
              </Form.Item>
              <Form.Item label="Site ID" name="siteID">
                <Input placeholder="Site ID" />
              </Form.Item>
              <Form.Item label="Description" name="description">
                <TextArea placeholder="Description" />
              </Form.Item>
              <Form.Item name="status" label="Status">
                <Radio.Group>
                  <Radio value="Active">Active</Radio>
                  <Radio value="Inactive">Inactive</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col offset={20} style={{ marginTop: '20px' }}>
              <Form.Item>
                <Button htmlType="submit" size="default" type="primary">
                  Save
                </Button>
              </Form.Item>
            </Col>
          </Row>
          </Form>
      </BasicFormWrapper>
    </>
  );
};

export default BasicInfo;

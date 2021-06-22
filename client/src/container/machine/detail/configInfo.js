import React, { useEffect } from 'react';
import { Form, Row, Col, notification, Input } from 'antd';
import Axios from 'axios';

import { Button } from '../../../components/buttons/buttons';
import { BasicFormWrapper } from '../../styled';

const ConfigInfo = ({ machineID }) => {
  const [form] = Form.useForm();

  const getConfigData = () => {
    Axios.post('/api/machine/detail/getConfigData', { machineId: machineID })
    .then( res => {
      if ( res.data.status === 'success' ) {
        form.setFieldsValue( res.data.data.config );
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
    getConfigData()
  }, []);

  const handleSubmit = values => {
    Axios.post('/api/machine/detail/saveConfigData', { machineId : machineID, data: values })
    .then( res => {
      if ( res.data.status === 'success' ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully Done!',
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

  return (
    <>
      <BasicFormWrapper>
        <Form layout="vertical" form={form} name="basicforms" onFinish={handleSubmit}>
          <Row gutter={25}>
            <Col md={8} sm={24} xs={24}>
              <Form.Item name="VERSION" label="VERSION">
                <Input />
              </Form.Item>
              <Form.Item name="DEV_NAME" label="DEV_NAME">
                <Input />
              </Form.Item>
              <Form.Item name="CONF_CHECK_INTERVAL" label="CONF_CHECK_INTERVAL">
                <Input />
              </Form.Item>
              <Form.Item name="FTP_SRVR" label="FTP_SRVR">
                <Input />
              </Form.Item>
              <Form.Item name="FTP_USER" label="FTP FTP_USER">
                <Input />
              </Form.Item>
              <Form.Item name="FTP_PASS" label="FTP_PASS">
                <Input />
              </Form.Item>
            </Col>
            <Col md={8} sm={24} xs={24}>
              <Form.Item name="FTP_USER" label="FTP_USER">
                <Input />
              </Form.Item>
              <Form.Item name="SMS_NUMS" label="SMS_NUMS">
                <Input />
              </Form.Item>
              <Form.Item name="SRVC_NUM" label="SRVC_NUM">
                <Input />
              </Form.Item>
              <Form.Item name="DEX_UPD_INTERVAL" label="DEX_UPD_INTERVAL">
                <Input />
              </Form.Item>
              <Form.Item name="DEX_SRVR" label="DEX_SRVR">
                <Input />
              </Form.Item>
              <Form.Item name="ACCEL_THRESH" label="ACCEL_THRESH">
                <Input />
              </Form.Item>
            </Col>
            <Col md={8} sm={24} xs={24}>
              <Form.Item name="PAY_SRVR_URL" label="PAY_SRVR_URL">
                <Input />
              </Form.Item>
              <Form.Item name="PAY_SRVR_PORT" label="PAY_SRVR_PORT">
                <Input />
              </Form.Item>
              <Form.Item name="PAY_APPR_AMNT" label="PAY_APPR_AMNT">
                <Input />
              </Form.Item>
              <Form.Item name="MERCHANT_FEE" label="MERCHANT_FEE">
                <Input />
              </Form.Item>
              <Form.Item name="DEV_HASH" label="DEV_HASH">
                <Input />
              </Form.Item>
              <Form.Item name="DEV_OPER_FLAGS" label="DEV_OPER_FLAGS">
                <Input />
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

export default ConfigInfo;

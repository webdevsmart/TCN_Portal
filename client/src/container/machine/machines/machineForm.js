import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Form, Input, Row, Col, notification, Radio } from 'antd';
import propTypes from 'prop-types';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { BasicFormWrapper } from '../../styled';
import { EditAisleForm } from '../style';

const MachineForm = ({ visible, onCancel, selectedMachine }) => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible: false,
    modalType: 'primary'
  });

  const getMachineData = () => {
    Axios.post('/api/machine/machines/getMachineById', { _id: selectedMachine._id })
    .then( res => {
      if ( res.data.status === 'success' ) {
        console.log(res.data.data)
        form.setFieldsValue( res.data.data.config );
        form.setFieldsValue({ siteId: res.data.data.siteId });
        form.setFieldsValue({ status: res.data.data.status });
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

  useEffect((state) => {
    if (selectedMachine !== '') {
      getMachineData();
    }
    let unmounted = false;
    if (!unmounted) {
      setState({
        ...state,
        visible: visible,
      });
    }
    return () => {
      unmounted = true;
    };
  }, [visible]);

  const handleSubmit = values => {
    Axios.post('/api/machine/machines/setMachineConfig', { _id : selectedMachine._id, data: values })
    .then( res => {
      if ( res.status === 'success' ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully Done!',
        });
        handleCancel();
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
    handleCancel();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      type={state.modalType}
      title="Edit Machine"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
      width={900}
    >
      <div className="category-modal">
        <EditAisleForm>
          <BasicFormWrapper>
            <Form form={form} name="createCategory" onFinish={handleSubmit}>
              <Row gutter={25}>
                <Col md={12} xs={24} lg={12}>
                  <Cards title="Config Data">
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
                  </Cards>
                </Col>
                <Col md='12' lg={12} xs={24}>
                  <Cards title="Extra Info">
                    <Form.Item name="siteId" label="Site ID">
                      <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status">
                      <Radio.Group>
                          <Radio value="Active">Active</Radio>
                          <Radio value="Deactive">Deactive</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Cards>
                </Col>
              </Row>
              <div className="add-form-action">
                <Form.Item>
                  <Button
                      className="btn-cancel"
                      size="large"
                      onClick={() => {
                          form.resetFields();
                          return onCancel();
                      }}
                  >
                      Cancel
                  </Button>
                  <Button size="large" htmlType="submit" type="primary" raised>
                      Save Aisle
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </BasicFormWrapper>
        </EditAisleForm>
      </div>
    </Modal>
  );
};

MachineForm.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default MachineForm;

import React, { useState, useEffect } from 'react';
import { Row, Col, Select, Form, Input, notification } from 'antd';
import axios from 'axios';
import propTypes from 'prop-types';
import Axios from 'axios';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { BasicFormWrapper } from '../../styled';
import { EditAisleForm } from '../style';
import { LENGTH_UNIT } from '../../../constants';

const { Option } = Select;

const RowHeightForm = ({ visible, onCancel, selectedRow }) => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible: false,
    modalType: 'primary',
  });

  
  useEffect((state) => {
    const getRowConfig = () => {
      Axios.post('/api/machine/detail/getRowConfig', { selectedRow })
      .then( res => {
        if ( res.data.status === 'success' ) {
          form.setFieldsValue(res.data.data)
          if ( res.data.data.maxHeight !== undefined ) {
            let maxHeight = res.data.data.maxHeight.split(" ");
            form.setFieldsValue({ maxHeight: maxHeight[0]});
            form.setFieldsValue({ maxHeightUnit: maxHeight[1]});
          } else {
            form.setFieldsValue({ maxHeightUnit: LENGTH_UNIT[0]});
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
      });
    }
    if ( selectedRow.rowId !== undefined ) {
      getRowConfig();
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
  }, [visible, form]);

  const handleSubmit = values => {
    values.maxHeight = values.maxHeight + " " + values.maxHeightUnit;

    axios.post('/api/machine/detail/setRowConfig', { selectedRow, data: values })
    .then(( res ) => {
      if (res.data.status === "success") {
        handleCancel();
      } else {
        notification["warning"] ({
          message: 'Warning',
          description: 
          'Server Error',
        });  
      }
    })
    .catch(( err ) => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  
  return (
    <Modal
      destroyOnClose={true}
      type={state.modalType}
      title="Edit Row Config"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
    >
      <div className="row-modal">
        <EditAisleForm>
          <BasicFormWrapper>
            <Form form={form} name="editRowConfig" onFinish={handleSubmit}>
              <Row>
                <Col md={18} xs={18} lg={18}>
                  <Form.Item name="maxHeight" label="Max Height" rules={[{ required: true, message: 'required!' }]}>
                    <Input/>
                  </Form.Item>
                </Col>
                <Col md={6} xs={6} lg={6}>
                  <Form.Item name="maxHeightUnit" label="Max Height Unit" rules={[{ required: true, message: 'required!' }]}>
                    <Select style={{ width: `100%` }}>
                      {LENGTH_UNIT.map( ( item, index ) => {
                        return (
                          <Option value={item} key={index}>{item}</Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label={`No of Aisles in Row ${selectedRow.rowLabel}`} name='aisleNumber'>
                <Input />
              </Form.Item>
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
                      Save Row Config
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

RowHeightForm.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default RowHeightForm;

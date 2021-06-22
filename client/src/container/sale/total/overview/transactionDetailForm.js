import React, { useState, useEffect } from 'react';
import { Form, Input, notification } from 'antd';
import propTypes from 'prop-types';
import Axios from 'axios';

import { Button } from '../../../../components/buttons/buttons';
import { Modal } from '../../../../components/modals/antd-modals';
import { BasicFormWrapper } from '../../../styled';
import { AddProductForm } from '../../style';

const CreateCategory = ({ visible, onCancel, setTableRefresh, selectedTransaction }) => {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [state, setState] = useState({
    visible: false,
    modalType: 'primary',
    file: null,
    list: null
  });

  const getTransactionLog = (_id) => {
    Axios.post("/api/sale/total/getTransactionDetail", { transactionId: selectedTransaction})
    .then( res => {
      if (res.data.status == "success") {
        form.setFieldsValue({ log: res.data.data });
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error!',
        });  
      }
    })
    .catch( err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error!',
      });
    });
  }

  useEffect((state) => {
    getTransactionLog()

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
  }, [visible, selectedTransaction]);

  const handleOk = values => {
    
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };
  
  return (
    <Modal
      destroyOnClose={true}
      type={state.modalType}
      title="Edit Log"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
    >
      <div className="category-modal">
        <AddProductForm>
          <BasicFormWrapper>
            <Form form={form} name="createCategory" onFinish={handleOk}>
                <Form.Item label="Log Content:" name='log'>
                  <TextArea name="name" placeholder="" rows={20}/>
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
                        Save Log
                    </Button>
                </Form.Item>
              </div>
            </Form>
          </BasicFormWrapper>
        </AddProductForm>
      </div>
    </Modal>
  );
};

CreateCategory.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateCategory;

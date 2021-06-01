import React, { useState, useEffect } from 'react';
import { Form, Input, notification } from 'antd';
import axios from 'axios';
import propTypes from 'prop-types';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { BasicFormWrapper } from '../../styled';
import { AddProductForm } from '../style';
import Axios from 'axios';

const CreateCategory = ({ visible, onCancel, setTableRefresh, selectedCategory }) => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible: false,
    modalType: 'primary'
  });

  useEffect((state) => {
    if ( selectedCategory !== "" ) {
      Axios.post('/api/stock/productCategory/getCategoryById', { _id: selectedCategory })
      .then( res => {
        if ( res.data.status === 'success' ) {
          form.setFieldsValue(res.data.data)
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
  }, [visible, selectedCategory]);

  const handleOk = values => {
    axios.post('/api/stock/productCategory/addCategory', { _id: selectedCategory, formData: values })
    .then(( res ) => {
      if (res.data.status === "success") {
        setTableRefresh();
        handleCancel();
      } else {
        notification["warning"]({
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
      type={state.modalType}
      title="Create Product Category"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
    >
      <div className="category-modal">
        <AddProductForm>
          <BasicFormWrapper>
            <Form form={form} name="createCategory" onFinish={handleOk}>
            <Form.Item label="Category Code:" name='code'>
                <Input name="name" placeholder="category Code"/>
              </Form.Item>
              <Form.Item label="Category Name:" name='name'>
                <Input name="name" placeholder="category Name"/>
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
                    Save Product
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

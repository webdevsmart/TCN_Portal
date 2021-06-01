import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, notification, Upload, message } from 'antd';
import axios from 'axios';
import propTypes from 'prop-types';
import Axios from 'axios';
import FeatherIcon from 'feather-icons-react';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import Heading from '../../../components/heading/heading';
import { BasicFormWrapper } from '../../styled';
import { AddProductForm } from '../style';

const { Dragger } = Upload;

const CreateCategory = ({ visible, onCancel, setTableRefresh, selectedCategory }) => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible: false,
    modalType: 'primary',
    file: null,
    list: null
  });
  
  const fileList = [];
  const fileUploadProps = {
    name: 'ImageFile',
    multiple: false,
    action: '/api/stock/product/uploadProductImage',
    onChange(info) {
      if ( info === "" ) {
        setState({ ...state, file: [], list: [] });
        return;
      }
      const { status } = info.file;
      if (status !== 'uploading') {
        setState({ ...state, file: info.file, list: info.list });
      }
      if (status === 'done') {
        console.log(fileUploadProps.fileList)
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    listType: 'picture',
    defaultFileList: fileList,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <FeatherIcon icon="trash-2" onClick={e => console.log(e, 'custom removeIcon event')} />,
    },
  };

  

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
    const data = values;
    if ( state.file !== undefined ) {
      data.imageUrl = state.file.response.filename;
    }

    if (selectedCategory === '' && state.file === undefined) {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Please select category image.',
      });
      return;
    }

    axios.post('/api/stock/productCategory/addCategory', { _id: selectedCategory, formData: data })
    .then(( res ) => {
      if (res.data.status === "success") {
        setTableRefresh();
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
      title="Edit Category"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
    >
      <div className="category-modal">
        <AddProductForm>
          <BasicFormWrapper>
            <Form form={form} name="createCategory" onFinish={handleOk}>
              <div className="add-product-block">
                <Row gutter={15}>
                  <Col xs={24}>
                      <div className="add-product-content">
                      <Cards title="Category Image" name="file">
                          <Dragger {...fileUploadProps} >
                            <p className="ant-upload-drag-icon">
                                <FeatherIcon icon="upload" size={50} />
                            </p>
                            <Heading as="h4" className="ant-upload-text">
                                Drag and drop an image
                            </Heading>
                            <p className="ant-upload-hint">
                                or <span>Browse</span> to choose a file
                            </p>
                          </Dragger>
                      </Cards>
                      </div>
                  </Col>
                </Row>
              </div>

              <Form.Item label="Code:" name='code'>
                <Input name="name" placeholder="category Code"/>
              </Form.Item>
              <Form.Item label="Name:" name='name'>
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
                      Save Category
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

import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, notification, Upload, message, Space } from 'antd';
import propTypes from 'prop-types';
import Axios from 'axios';
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';

import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { BasicFormWrapper } from '../../styled';
import { EditAisleForm } from '../style';
import { LENGTH_UNIT, WEIGHT_UNIT } from '../../../constants';

const { Option } = Select;

const CreateCategory = ({ visible, onCancel, selectedAisle }) => {
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible,
    modalType: 'primary',
    selectedCategory: 0,
    
  });

  const { selectedCategory } = state;
  const [categoryList, setCategoryList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSeletedProducts] = useState([]);
  const [fileState, setFileState] = useState({
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
  const { loading, previewImageUrl, imageUrl } = fileState;

  const getAisle = () => {
    Axios.post('/api/machine/planogram/getAisle', { selectedAisle })
    .then( res => {
      if (res.data.status === 'success') {
        setFileState({
          previewImageUrl: undefined
        })
        form.setFieldsValue(res.data.data);
        // if (res.data.data.product === undefined) {
        //   const tempProduct = [{
        //     productId: 'sdf',
        //     weight: 'sdf',
        //     weightUnit: 'sdf',
        //     height: 'sdf',
        //     heightUnit: 'sdf',
        //     price: 'sdf',
        //   }];
        //   console.log(selectedProducts)
        //   setSeletedProducts(tempProduct);
        // }
        if ( res.data.data.productId !== undefined ) {
          Axios.post('/api/stock/product/getProductById', { _id: res.data.data.productId })
          .then( res1 => {
            if ( res1.data.status === 'success' ) {
              form.setFieldsValue({ categoryId: res1.data.data.categoryId });
              selectCategory(res1.data.data.categoryId);
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

  useEffect(() => {
    getAisle();
  }, [ selectedAisle ]);
  
  useEffect((state) => {
    const getCategoryList = () => {
      Axios.get('/api/stock/productCategory/getTotalCategory')
      .then(( res ) => {
        if (res.data.status === "success") {
          setCategoryList(res.data.data);
        }
      })
      .catch((err) => {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      });
    }
    if (visible) {
      getCategoryList();
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
    values.imageUrl = imageUrl;
    console.log(values)
    Axios.post('/api/machine/planogram/setAisle', { selectedAisle, values })
    .then(res => {
      if (res.data.status === 'success') {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully done!',
        });  
        form.resetFields();
        onCancel();
      } else {
        notification["warning"]({
          message: 'Warning',
          description: 
          res.data.message,
        });  
      }
    })
    .catch(err => {
      notification["warning"]({
        message: 'Warning',
        description: 
        'Server Error',
      });
    });
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const selectCategory = values => {

    Axios.post('/api/stock/product/getProductByCategory', { categoryId: values })
    .then( res => {
      if ( res.data.status === 'success' ) {
        setProductList(res.data.data);
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

  const selectProduct = values => {
    Axios.post('/api/stock/product/getProductById', { _id: values })
    .then( res => {
      if ( res.data.status === 'success' ) {
        form.setFieldsValue({ price: res.data.data.price });
        form.setFieldsValue({ imageUrl: res.data.data.imageFile });
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

  // file handle
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setFileState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      if ( info.file.response.status === 'success' ) {
        getBase64(info.file.originFileObj, previewImageUrl =>
          setFileState({
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
  // end file handle

  return (
    <Modal
      type={ state.modalType }
      title="Edit Aisle"
      visible={ state.visible }
      footer={ [] }
      onCancel={ handleCancel }
      width={ 900 }
    >
      <div className="category-modal">
        <EditAisleForm>
          <BasicFormWrapper>
            <Form form={form} name="editAisle" onFinish={handleSubmit}>
              <Row gutter={25}>
                <Col md={24} lg={24} xs={24}>
                <Col md={24} lg={24} xs={24} style={{ textAlign: 'center' }}>
                  <Upload
                    name="ImageFile"
                    listType="picture-card"
                    className="ImageFile-uploader"
                    showUploadList={false}
                    action="/api/stock/product/uploadProductImage"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                  >
                    {previewImageUrl ? <img src={previewImageUrl} alt="ImageFile" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                  </Col>
                  <Form.List name="products">
                    {(products, { add, remove }) => (
                      <>
                      {products.map(field => (
                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                          <Cards title={`Product`}>
                            <Row>
                              <Col md={11} xs={12}>
                                <Form.Item name={[field.name, 'categoryId']} label="Category">
                                  <Select
                                      showSearch
                                      style={{ width: `100%` }}
                                      placeholder="Select Category"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                      onChange={selectCategory}
                                  >
                                    {categoryList.map((item, index) => {
                                      return <Option value={item._id} key={index}>{item.name}</Option>
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={11} xs={12}>
                                <Form.Item label="Product" name={[field.name, 'productId']}>
                                  <Select
                                      showSearch
                                      style={{ width: `100%` }}
                                      placeholder="Select Product"
                                      optionFilterProp="children"
                                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                      onChange={selectProduct}
                                      
                                  >
                                    {productList.map((item, index) => {
                                      return <Option value={item._id} key={index}>{item.name}</Option>
                                    })}
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={5} lg={5} xs={24}>
                                <Row>
                                  <Col md={16}>
                                    <Form.Item  label="Product Weight" name={[field.name, 'weight']}>
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col md={8}>
                                    <Form.Item  label="Unit" name={[field.name, 'weightUnit']}>
                                      <Select style={{ width: `100%` }} >
                                        {WEIGHT_UNIT.map( ( item, index ) => {
                                          return (
                                            <Option value={item} key={index}>{item}</Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={5} lg={5} xs={24}>
                                <Row>
                                  <Col md={16}>
                                    <Form.Item label="Product Height" name={[field.name, 'height']}>
                                      <Input />
                                    </Form.Item>
                                  </Col>
                                  <Col md={8}>
                                    <Form.Item label="Unit" name={[field.name, 'heightUnit']}>
                                      <Select style={{ width: `100%` }} >
                                        {LENGTH_UNIT.map( ( item, index ) => {
                                          return (
                                            <Option value={item} key={index}>{item}</Option>
                                          );
                                        })}
                                      </Select>
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={5} lg={5} xs={24}>
                                <Form.Item label="Price (AUD$)" name={[field.name, 'price']} >
                                  <Input/>
                                </Form.Item>
                              </Col>
                              <Col md={1}></Col>
                              <Col md={5} lg={5} xs={24}>
                                <Form.Item label="Product Quantity" name={[field.name, 'qty']} >
                                  <Input />
                                </Form.Item>
                              </Col>
                              <Col md={1} style={{ textAlign: 'right' }}>
                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                              </Col>
                            </Row>
                          </Cards>
                        </Space>
                      ))}
                      <Col md={24} style={{ textAlign: 'right' }}>
                        <Button size="default" type="primary" style={{ marginRight: '10px' }} onClick={() => add()}>
                          Add Product
                        </Button>  
                      </Col>
                      </>
                    )}
                  </Form.List>
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

CreateCategory.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateCategory;

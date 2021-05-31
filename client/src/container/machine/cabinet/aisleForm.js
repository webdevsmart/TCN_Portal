import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, notification, Upload, message } from 'antd';
import propTypes from 'prop-types';
import FeatherIcon from 'feather-icons-react';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { BasicFormWrapper } from '../../styled';
import { EditAisleForm } from '../style';
import Axios from 'axios';

const { Option } = Select;
const { Dragger } = Upload;

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

  useEffect(() => {
    console.log("ok")
    const getPlanogram = () => {
      Axios.post('/api/machine/planogram/getAisle', { selectedAisle })
      .then( res => {
        if (res.data.status === 'success') {
          form.setFieldsValue(res.data.data);
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
    getPlanogram();
  }, [ selectedAisle ]);
  
  useEffect((state) => {
    const getCategoryList = () => {
      Axios.get('/api/stock/productCategory/getTotalCategory')
      .then((res) => {
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
                <Col md={12} xs={24} lg={12}>
                  <Cards title="Layout Info">
                    <Form.Item name="aisleNum" label="Aisle Number">
                      <Input />
                    </Form.Item>
                    <Form.Item name="width" label="Width(Inche)">
                      <Input />
                    </Form.Item>
                    <Form.Item name="height" label="Height(Inche)">
                      <Input />
                    </Form.Item>
                    <Form.Item name="maxQty" label="Max Quantity">
                      <Input />
                    </Form.Item>
                  </Cards>
                </Col>
                <Col md='12' lg={12} xs={24}>
                  <Cards title="Product Info">
                    <Form.Item name="categoryId" label="Category">
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
                    <Form.Item name="productId" label="Product">
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
                    <Form.Item name="price" label="Price (AUD$)">
                      <Input/>
                    </Form.Item>
                    <Form.Item name="qty" label="Current Quantity">
                      <Input />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Current Quantity" style={{ display: 'none' }}>
                      <Input />
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

CreateCategory.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default CreateCategory;

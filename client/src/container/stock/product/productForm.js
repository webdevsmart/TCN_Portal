import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Input, Select, InputNumber, Radio, Upload, message, notification } from 'antd';
import FeatherIcon from 'feather-icons-react';
import propTypes from 'prop-types';
import axios from 'axios';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import Heading from '../../../components/heading/heading';
import { AddProductForm } from '../style';
import { BasicFormWrapper } from '../../styled';
import { setRefresh } from '../../../redux/product/actionCreator';

const { Option } = Select;
const { Dragger } = Upload;

const ProductForm = ({ visible, selectedProduct, onCancel}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [state, setState] = useState({
    visible,
    modalType: 'primary',
    submitValues: {},
    file: null,
    list: null
  });

  const [categoryList, setCategoryList] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    subtext: '',
    categoryId: '',
    description: '',
    discount: '',
    imageFile: '',
    mKeyword: '',
    mTitle: '',
    price: '',
    status: 'Active'
  });

  const fileList = [];
  const fileUploadProps = {
    name: 'ImageFile',
    multiple: true,
    action: '/api/stock/product/uploadProductImage',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        setState({ ...state, file: info.file, list: info.fileList });
      }
      if (status === 'done') {
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
  
  const getProduct = ( _id ) => {
    axios.post('/api/stock/product/getProduct', { _id:_id })
    .then((res) => {
      if (res.data.status === "success") {
        setProduct(res.data.data)
        res.data.data.price += "";
        form.setFieldsValue(res.data.data);
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

  useEffect((state) => {
    setState({
      ...state,
      file: null,
      list: null
    })
    if (selectedProduct !== "") {
      getProduct(selectedProduct);
      console.log(product)
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
  }, [visible, selectedProduct]);

  useEffect(() => {
    const getCategoryList = () => {
      axios.get('/api/stock/productCategory/getTotalCategory')
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
      // getProduct(selectedProduct);
    }
  }, [visible]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = values => {
    setState({ ...state, submitValues: values });
    const data = values;
    data.imageFile = state.file !== undefined ? state.file.response.filename : '';

    axios.post('/api/stock/product/addProduct', {data})
    .then(res => {
      if (res.data.status === 'success') {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully done!',
        });  
        dispatch(setRefresh(true));
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
    })
  };

  // const updateProduct = (event) => {
  //   this.setProduct({
  //     [event.target.name]: event.target.value
  //   });
  // }

  return (
    <Modal
      type={state.modalType}
      title="Add New Product"
      visible={state.visible}
      footer={[]}
      onCancel={handleCancel}
      width={900}
    >
        <Col xs={24}>
            <Row gutter={25} justify="center">
                <Col xs={24}>
                    <AddProductForm>
                        <Form style={{ width: '100%' }} form={form} name="addProduct" onFinish={handleSubmit} initialValues={product}>
                            <BasicFormWrapper>
                            <div className="add-product-block">
                                <Row gutter={15}>
                                <Col xs={24}>
                                    <div className="add-product-content">
                                    <Cards title="About Product">
                                        <Form.Item name="_id" label="Product Name" style={{ display:"none" }}>
                                          <Input />
                                        </Form.Item>
                                        <Form.Item name="code" label="Product Code">
                                          <Input />
                                        </Form.Item>
                                        <Form.Item name="name" label="Product Name">
                                          <Input />
                                        </Form.Item>
                                        <Form.Item name="categoryId" label="Category">
                                        <Select
                                            showSearch
                                            style={{ width: `100%` }}
                                            placeholder="Select a person"
                                            optionFilterProp="children"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                          {categoryList.map((item, index) => {
                                            return <Option value={item._id} key={index}>{item.name}</Option>
                                          })}
                                        </Select>
                                        </Form.Item>
                                        <Form.Item name="price" label="Price(AUD$)">
                                            <InputNumber style={{ width: '100%' }}/>
                                        </Form.Item>

                                        <Form.Item name="status" label="Status">
                                        <Radio.Group>
                                            <Radio value="Active">Active</Radio>
                                            <Radio value="Deactive">Deactive</Radio>
                                        </Radio.Group>
                                        </Form.Item>

                                        <Form.Item name="description" label="Product Description">
                                        <Input.TextArea rows={5} />
                                        </Form.Item>
                                    </Cards>
                                    </div>
                                </Col>
                                </Row>
                            </div>

                            <div className="add-product-block">
                                <Row gutter={15}>
                                <Col xs={24}>
                                    <div className="add-product-content">
                                    <Cards title="Product Image">
                                        <Dragger {...fileUploadProps}>
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
                            </BasicFormWrapper>
                        </Form>
                    </AddProductForm>
                </Col>
            </Row>
        </Col>
    </Modal>
  );
};

ProductForm.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default ProductForm;

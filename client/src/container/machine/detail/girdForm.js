import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Select, notification, Upload, message, Checkbox } from 'antd';
import propTypes from 'prop-types';
import Axios from 'axios';

import { Button } from '../../../components/buttons/buttons';
import { Modal } from '../../../components/modals/antd-modals';
import { Cards } from '../../../components/cards/frame/cards-frame';
// import { Checkbox } from '../../../components/checkbox/checkbox';
import { BasicFormWrapper } from '../../styled';
import { EditAisleForm } from '../style';
import { LENGTH_UNIT, WEIGHT_UNIT, RELEASE_TYPE, YES, NO } from '../../../constants';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const EditAisle = ({ visible, onCancel, selectedAisle }) => {
  const [form] = Form.useForm();
  
  const [state, setState] = useState({
    visible,
    modalType: 'primary',
    selectRows: false,
    selectSameAllRow: false,
    selectSameAllRows: false,
  });
  const [sameRowAisles, setSameRowAisles] = useState([]);
  const [rowList, setRowList] = useState([]);
  const [selectedSameAisles, setSelectedSameAisles] = useState([]);
  const [selectedSameRows, setSelectedSameRows] = useState([]);

  const getAisle = () => {
    Axios.post('/api/machine/detail/getAisle', { selectedAisle })
    .then( res => {
      if (res.data.status === 'success') {
        form.setFieldsValue(res.data.data);
        setSameRowAisles(res.data.sameRowAisles)
        setRowList(res.data.rowList);
        if ( res.data.data.minWidth !== undefined ) {
          let minWidth = res.data.data.minWidth.split(" ");
          form.setFieldsValue({ minWidth: minWidth[0]});
          form.setFieldsValue({ minWidthUnit: minWidth[1]});
          
        } else {
          form.setFieldsValue({ minWidthUnit: LENGTH_UNIT[0]});
        }
        if ( res.data.data.minWeight !== undefined ) {
          let minWeight = res.data.data.minWeight.split(" ");
          form.setFieldsValue({ minWeight: minWeight[0]});
          form.setFieldsValue({ minWeightUnit: minWeight[1]});
        } else {
          form.setFieldsValue({ minWeightUnit: WEIGHT_UNIT[0]});
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
    setSelectedSameAisles([]);
  }, [ selectedAisle ]);
  
  useEffect((state) => {
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
    values.minWidth = values.minWidth + " " + values.minWidthUnit;
    values.minWeight = values.minWeight + " " + values.minWeightUnit;
    values.selectedSameAisles = selectedSameAisles;
    setSelectedSameAisles([]);
    values.selectRows = state.selectRows;
    values.selectSameAllRow = state.selectSameAllRow;
    values.selectedSameRows = selectedSameRows;
    values.selectSameAllRows = state.selectSameAllRows;

    Axios.post('/api/machine/detail/setAisle', { selectedAisle, values })
    .then( res => {
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
    .catch( err => {
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

  return (
    <Modal
      type={ state.modalType }
      title="Edit Aisle"
      visible={ state.visible }
      footer={ [] }
      onCancel={ handleCancel }
      width={ 800 }
    >
      <div className="category-modal">
        <EditAisleForm>
          <BasicFormWrapper>
            <Form form={form} name="editAisle" onFinish={handleSubmit}>
              <Row gutter={25}>
                <Col md={24} xs={24} lg={24}>
                  <Form.Item name="aisleNum" label="Aisle Number"  rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                  <Row>
                    <Col md={18} xs={18} lg={18}>
                      <Form.Item name="minWeight" label="Min Weight" rules={[{ required: true, message: 'required!' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={6} lg={6}>
                      <Form.Item name="minWeightUnit" label="Min Weight Unit" rules={[{ required: true, message: 'required!' }]}>
                        <Select style={{ width: `100%` }}>
                          {WEIGHT_UNIT.map( ( item, index ) => {
                            return (
                              <Option value={item} key={index}>{item}</Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={18} xs={18} lg={18}>
                      <Form.Item name="minWidth" label="Min Width" rules={[{ required: true, message: 'required!' }]}>
                        <Input/>
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={6} lg={6}>
                      <Form.Item name="minWidthUnit" label="Min Width Unit" rules={[{ required: true, message: 'required!' }]}>
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
                  <Form.Item name="useConveyorBelt" label="Use Conveyor Belt?" rules={[{ required: true, message: 'required!' }]}>
                    <Select style={{ width: `100%` }}>
                      <Option value={YES}>{YES}</Option>
                      <Option value={NO}>{NO}</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="releaseType" label="Release type?" rules={[{ required: true, message: 'required!' }]}>
                    <Select style={{ width: `100%` }}>
                      {RELEASE_TYPE.map( ( item, index) => {
                        return (
                          <Option value={ item } key={ index }>{ item }</Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item name="releaseSize" label="Release Size" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                  <Form.Item name="maxQty" label="Max Quantity" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={25}>
                <Col style={{ marginTop: '10px'}} md={24} xs={24} lg={24}>
                  <Form.Item label="Select Aisles With Same Configuration">
                    <CheckboxGroup 
                      options={ sameRowAisles } 
                      value={ selectedSameAisles } 
                      onChange={ checkedValues => {
                        setSelectedSameAisles(checkedValues)
                      }} />
                  </Form.Item>
                  <Checkbox 
                    onChange={e => {
                      setState({ ...state, selectSameAllRow: e.target.checked });
                    }}
                    checked={state.selectSameAllRow}  
                  >
                    Same All Row {selectedAisle.rowLabel}
                  </Checkbox>
                  <Checkbox 
                    onChange={e => {
                      setState({ ...state, selectRows: e.target.checked });
                    }}
                    checked={state.selectRows}  
                  >
                    Select Rows
                  </Checkbox>
                  <Checkbox 
                    onChange={e => {
                      setState({ ...state, selectSameAllRows: e.target.checked });
                    }}
                    checked={state.selectSameAllRows}  
                  >
                    Same All Rows
                  </Checkbox>
                </Col>
              </Row>
              {state.selectRows ? 
              <Row style={{ marginTop: '10px' }}>
                <CheckboxGroup 
                  options={ rowList } 
                  value={ selectedSameRows } 
                  onChange={ checkedValues => {
                    setSelectedSameRows(checkedValues)
                  }} />
              </Row>
              : ''}
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

EditAisle.propTypes = {
  visible: propTypes.bool.isRequired,
  onCancel: propTypes.func.isRequired,
};

export default EditAisle;

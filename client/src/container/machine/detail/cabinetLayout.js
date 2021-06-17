import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, notification } from 'antd';
import Axios from 'axios';

import { Button } from '../../../components/buttons/buttons';
import { BasicFormWrapper } from '../../styled';

const { Option } = Select;

const CabinetLayout = ({ machineID }) => {
  const [form] = Form.useForm();
  const rowLabels = [
    'A-Z', '1-9', '10-90', '100-190'
  ];
  const aisleLabels = [
    'A-Z', '1-99', '10-99', '100-199'
  ];

  const [state, setState] = useState({
    rowLabel: '',
    aisleLabel: '',
    cabinetLayoutData: {},
  });

  const { cabinetLayoutData } = state;

  const getCabinetLayoutData = () => {
    Axios.post('/api/machine/detail/getCabinetLayoutData', { machineId: machineID })
    .then( res => {
      if ( res.data.status === 'success' ) {
        form.setFieldsValue( res.data.data );
        setState({
          ...state,
          cabinetLayoutData: res.data.data
        });
        console.log(res.data.data.rowLable)
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
    getCabinetLayoutData();
  }, []);

  const handleSubmit = values => {
    Axios.post('/api/machine/detail/setCabinetLayout', { machineId : machineID, data: values })
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
        <Form layout="vertical" form={form} name="basicforms" onFinish={handleSubmit} initialValues={cabinetLayoutData}>
          <Col md={8} sm={24} xs={24}>
          <Row gutter={25}>
            <Col md={12} sm={24} xs={24}>
              <Form.Item name="width" label="Width" rules={[{ required: true, message: 'required!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="height" label="Height" rules={[{ required: true, message: 'required!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="rowNum" label="Number of Row" rules={[{ required: true, message: 'required!' }]}>
                <Input />
              </Form.Item>
              <Form.Item name="maxAisleNum" label="Max Aisle Number in a Row" rules={[{ required: true, message: 'required!' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col md={12} sm={24} xs={24}>
              <Form.Item name="rowLabel" label="Row Labels"  rules={[{ required: true, message: 'required!' }]}>
                <Select style={{ width: `100%` }} defaultValue={state.rowLabel}>
                  {rowLabels.map((item, index) => {
                    return <Option value={item} key={index}>{item}</Option>
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="aisleLabel" label="Aisle Labels" rules={[{ required: true, message: 'required!' }]}>
                <Select style={{ width: `100%` }} defaultValue={state.aisleLabel}>
                  {aisleLabels.map((item, index) => {
                    return <Option value={item} key={index}>{item}</Option>
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="maxRowHeight" label="Max Row Height" rules={[{ required: true, message: 'required!' }]}>
                <Input />
              </Form.Item>
              <Form.Item style={{ float: 'right', marginTop: '30px'}}>
                <Button htmlType="submit" size="default" type="primary">
                  Set Cabinet
                </Button>
              </Form.Item>
            </Col>
          </Row>
          </Col>

        </Form> 
      </BasicFormWrapper>
    </>
  );
};

export default CabinetLayout;

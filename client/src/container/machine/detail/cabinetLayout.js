import React, { lazy, useEffect, useState } from 'react';
import { Row, Col, Form, Input, Select, notification } from 'antd';
import Axios from 'axios';


import { Button } from '../../../components/buttons/buttons';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { BasicFormWrapper } from '../../styled';


const CabinetGrid = lazy(() => import('./cabinetGrid'));
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
    refreshGrid: false
  });

  const { cabinetLayoutData, refreshGrid } = state;

  const getCabinetLayoutData = () => {
    Axios.post('/api/machine/detail/getCabinetLayoutData', { machineId: machineID })
    .then( res => {
      if ( res.data.status === 'success' ) {
        form.setFieldsValue( res.data.data );
        
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

  const getPlanogram = () => {
    Axios.post('/api/machine/planogram/getPlanogram', { machineId: machineID })
    .then( res => {
      if (res.data.status === 'success') {
        if (res.data.data !== null) {
          console.log(res.data.data)
          setState({
            ...state,
            planogram: res.data.data
          })
        }
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
    })
  }

  useEffect(() => {
    getCabinetLayoutData();
    getPlanogram();
  }, []);

  const handleSubmit = values => {
    Axios.post('/api/machine/detail/setCabinetLayout', { machineId : machineID, data: values })
    .then( res => {
      if ( res.data.status === 'success' ) {
        makeCabinet();        
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

  const makeCabinet = () => {
    Axios.post('/api/machine/detail/makeCabinet', {machineId: machineID})
    .then( res => {
      if ( res.data.status === "success" ) {
        notification["success"]({
          message: 'Success',
          description: 
          'Successfully done!',
        });
        setState({
          ...state,
          refreshGrid: true
        })
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

  const setRefreshGrid = (type) => {
    setState({
      ...state,
      refreshGrid: type
    });
  }

  return (
    <>
    <Row gutter={25}>
      <Cards title="Layout Data">
        <Col md={24} sm={24} xs={24}>
          <BasicFormWrapper>
            <Form layout="vertical" form={form} name="basicforms" onFinish={handleSubmit} initialValues={cabinetLayoutData}>
              <Row gutter={25}>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="width" label="Width" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="height" label="Height" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="rowNum" label="Number of Row" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="maxAisleNum" label="Max Aisle Number" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="rowLabel" label="Row Labels"  rules={[{ required: true, message: 'required!' }]}>
                    <Select style={{ width: `100%` }}>
                      {rowLabels.map((item, index) => {
                        return <Option value={item} key={index}>{item}</Option>
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="aisleLabel" label="Aisle Labels" rules={[{ required: true, message: 'required!' }]}>
                    <Select style={{ width: `100%` }} defaultValue={state.aisleLabel}>
                      {aisleLabels.map((item, index) => {
                        return <Option value={item} key={index}>{item}</Option>
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24}>
                  <Form.Item name="maxRowHeight" label="Max Row Height" rules={[{ required: true, message: 'required!' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={6} sm={8} xs={24} >
                  <Form.Item style={{ float: 'right', marginTop: '30px'}}>
                    <Button htmlType="submit" size="default" type="primary">
                      Set Cabinet
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form> 
          </BasicFormWrapper>
        </Col>
      </Cards>
      <Cards title="Cabinet Layout">
        <CabinetGrid machineId={ machineID } refreshGrid={refreshGrid} setRefreshGrid={setRefreshGrid}/>
      </Cards>
    </Row>
    </>
  );
};

export default CabinetLayout;

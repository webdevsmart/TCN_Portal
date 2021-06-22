import React, { lazy, useState } from 'react';
import { Row, Col, Menu } from 'antd';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { Main } from '../../styled';
import { DetailStyleWrapper } from '../style';

const BasicInfo = lazy(() => import('./basicInfo'));
const ConfigInfo = lazy(() => import('./configInfo'));
const CabinetLayout = lazy(() => import('./cabinetLayout'));
const Planogram = lazy(() => import('./planogram'));
const SaleSequence = lazy(() => import('./SaleSequence'));

const MachineDetail = (data) => {
  const machineID = data.match.params.id;
  const [state, setState] = useState({
    current: 'mail',
    pageType: 'Basic'
  });

  const { pageType } = state;

  const handleClick = e => {
    setState({
      pageType: e.key,
    });
  };

  return (
    <>
      <PageHeader
        ghost
        title="MachineDetail"
      />
      <Main>
        <DetailStyleWrapper>
          <Cards headless>
            <Row gutter={25}>
              <Col md={24} xs={24}>
                <Menu onClick={handleClick} selectedKeys={[pageType]} mode="horizontal">
                  <Menu.Item key="Basic">
                    Basic Info
                  </Menu.Item>
                  <Menu.Item key="Config">
                    Config Info
                  </Menu.Item>
                  <Menu.Item key="CabinetLayout">
                    Cabinet Layout
                  </Menu.Item>
                  <Menu.Item key="Planogram">
                    Planogram
                  </Menu.Item>
                  <Menu.Item key="SaleSequence">
                    SaleSequence
                  </Menu.Item>
                </Menu>
              </Col>
            </Row>
            <Row gutter={25} style={{ marginTop: '20px' }}>
              <Col md={24} xs={24}>
                {(() => {
      
                  switch (pageType) {
                    case 'Basic':
                      return (
                        <BasicInfo machineID={machineID}/>
                      )
                    case 'Config':
                      return (
                        <ConfigInfo machineID={machineID}/>
                      )
                    case 'CabinetLayout':
                      return (
                        <CabinetLayout machineID={machineID}/>
                      )
                    case 'Planogram':
                      return (
                        <Planogram machineID={machineID}/>
                      )
                    case 'SaleSequence':
                      return (
                        <SaleSequence machineID={machineID}/>
                      )
                    default:
                      return (
                        <BasicInfo machineID={machineID} />
                      )
                  }
                })()}
              </Col>
            </Row>
          </Cards>
        </DetailStyleWrapper>
      </Main>
    </>
  );
};

export default MachineDetail;

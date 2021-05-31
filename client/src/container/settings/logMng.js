import React from 'react';
import { Row, Col } from 'antd';
import FeatherIcon from 'feather-icons-react';
// import axios from 'axios';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { Main } from '../styled';

// const confirm = Modal.confirm;

// const addLogConfig = () => {
//   confirm({
//     title: 'Do you want to add all logs from log folder?',
//     okText: 'Yes',
//     onOk() {
//       axios.get('/api/settings/addLogConfig')
//       .then(res => {
//         console.log(res)
//       })
//     },
//     onCancel() {},
//   });
// }

const LogMng = () => {
  return (
    <>
      <PageHeader
        ghost
        title="Log Manager"
        buttons={[
          <div key="6" className="page-header-actions">
            <Button size="small" key="4" type="primary">
              <FeatherIcon icon="plus" size={14} />
              Add Logs config
            </Button>
            <Button size="small" key="4" type="success">
              <FeatherIcon icon="plus" size={14} />
              Add Logs
            </Button>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col lg={24} xs={24}>
            <Cards headless>
              <div style={{ minHeight: 'calc(100vh - 320px)' }}>
                <h2>Log Manager</h2>
              </div>
            </Cards>
          </Col>
        </Row>
      </Main>
    </>
  );
};

export default LogMng;

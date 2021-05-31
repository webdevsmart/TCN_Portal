import React, { lazy, useState, Suspense, useEffect } from 'react';
import { Row, Col, Spin, Pagination, notification } from 'antd';
import { Switch, NavLink, Route, useRouteMatch } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import Axios from 'axios';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Button } from '../../../components/buttons/buttons';
import { AutoComplete } from '../../../components/autoComplete/autoComplete';
import { Main, CardToolbox } from '../../styled';
import { TopToolBox, MachineCardWrapper } from '../style';
import EditMachine from './machineForm';

const Grid = lazy(() => import('./overview/grid'));

const Product = () => {
  const { path } = useRouteMatch();
  const [state, setState] = useState({
    visible: false,
    selectedMachine: '',
    machines: {
      list: [],
      totalCount: 0
    }
  });

  const [filter, setFilter] = useState({
    start: 0,
    length: 10,
    keyword: ''
  });
  const [refresh, setRefresh] = useState(true);
  
  const { visible } = state;
  const { machines } = state;

  const handleSearch = () => {
    console.log("ok")
  }

  useEffect(() => {
    const getMachineList = () => {
      Axios.post('/api/machine/machines/getMachineList', { filter : filter })
      .then( res => {
        setState({
          ...state,
          machines: res.data.data
        })
      })
      .catch( err => {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      })
    }
    getMachineList();
  }, [filter]);

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
    setRefresh(true);
  };

  const onChange = (current, pageSize) => {
    let data = {
      start : (current - 1) * pageSize,
      length: pageSize,
      keyword: ""
    }
    setFilter(data)
  }

  const showModal = ( machineId ) => {
    setState({
      ...state,
      visible: true,
      selectedMachine: machineId
    });
  };

  return (
  <>
    <CardToolbox>
      <PageHeader
        title="Machine Management"
      />
    </CardToolbox>
    <Main>
      <EditMachine onCancel={onCancel} visible={visible} selectedMachine={state.selectedMachine} />
      <Row gutter={30}>
        <Col className="product-content-col" xs={24}>
          <TopToolBox>
            <Row gutter={0}>
              <Col xs={24}>
                <div className="product-list-action d-flex justify-content-between align-items-center">
                  <div>
                    <AutoComplete
                      onSearch={handleSearch}
                      placeholder="Search by Name"
                      width="100%"
                      patterns
                    />
                  </div>
                  {(window.innerWidth <= 991 && window.innerWidth >= 768) ||
                    (window.innerWidth > 575 && (
                      <div className="product-list-action__viewmode">
                        <NavLink to={`${path}/grid`}>
                          <FeatherIcon icon="grid" size={16} />
                        </NavLink>
                        <NavLink to={`${path}/list`}>
                          <FeatherIcon icon="list" size={16} />
                        </NavLink>
                      </div>
                    ))}
                </div>
              </Col>
            </Row>
          </TopToolBox>
        </Col>
      </Row>
      <MachineCardWrapper>
          <Row gutter={25}>
            <Switch>
              <Suspense
                fallback={
                  <div className="spin d-flex align-center-v">
                    <Spin />
                  </div>
                }
              >
                <Route exact path={path} component={() => {
                  return machines.list.map(machine => {
                    const { _id } = machine;
                    return (
                      <Col key={_id} xxl={6} xl={8} sm={12} xs={24}>
                          <Grid machine={machine} showModal={showModal}/>
                      </Col>
                    );
                  });
                }}/>
              </Suspense>
            </Switch>    
            <Col xs={24}>
              <div className="user-card-pagination">
                <Pagination
                  onChange={onChange}
                  pageSize={filter.length}
                  defaultCurrent={1}
                  total={machines.totalCount}
                />
              </div>
            </Col>
        </Row>
      </MachineCardWrapper>          
    </Main>
  </>
  );
};

export default Product;

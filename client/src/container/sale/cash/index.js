import React, { lazy, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';

import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';

const FilterBar = lazy(() => import('../../dashboard/overview/searchFilterBar'));
const TransactionTable = lazy(() => import('./overview/transactionTable'));
const TransactionChart = lazy(() => import('../../dashboard/overview/transactionChart'));
const TransactionDetailForm = lazy(() => import('../total/overview/transactionDetailForm'));

const TotalSale = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    visible: false,
  });
  const { visible } = state;

  const showDetailModal = ( selectedTransaction = "" ) => {
    setState({
      ...state,
      visible: true,
      selectedTransaction: selectedTransaction,
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };  

  const paymentType = [
    {'key': 'CASH', 'label': 'All'},
    {'key': 'BILL', 'label': 'Bill'},
    {'key': 'COIN', 'label': 'Coin'},
  ];
  const { filter } = useSelector(state => {
    return {
      filter: state.filterDashboard.data
    };
  });
  useEffect(() => {
    if (filter.paymentType && (filter.paymentType.includes('all') || !paymentType.some(item => item.key === filter.paymentType[0])) ) {
      filter.paymentType = 'CASH';
      dispatch(setDashBoardFilter(filter));
    }
  }, []);
  return (
    <>
      <PageHeader
        ghost
        title="Total Sale"
      />
      <Main>
        <TransactionDetailForm onCancel={onCancel} visible={visible} selectedTransaction={state.selectedTransaction}/>
        <Row gutter={25} justify="center">
          <Col xxl={24} md={24} sm={24} xs={24}>
            <Cards headless>
              <FilterBar paymentType={paymentType} />
            </Cards>
          </Col>
          <Cards title="Transaction Detail">
            <Col xs={24}>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionChart />
              </Col>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionTable showDetailModal={showDetailModal}/>
              </Col>
            </Col>
          </Cards>
        </Row>
      </Main>
    </>
  );
}

export default TotalSale;
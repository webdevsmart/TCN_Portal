import React, { lazy, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';

const FilterBar = lazy(() => import('../../dashboard/overview/searchFilterBar'));
const TransactionTable = lazy(() => import('./overview/transactionTable'));
const TransactionChart = lazy(() => import('../../dashboard/overview/transactionChart'));

const CardSale = () => {
  const dispatch = useDispatch();
  const paymentType = [
    {'key': 'CARD', 'label': 'All'},
    {'key': 'MASTERCARD', 'label': 'MasterCard'},
    {'key': 'VISA', 'label': 'VisaCard'},
  ];
  const { filter } = useSelector(state => {
    return {
      filter: state.filterDashboard.data
    };
  });
  useEffect(() => {
    if (filter.paymentType && (filter.paymentType.includes('all') || !paymentType.some(item => item.key === filter.paymentType[0])) ) {
      filter.paymentType = 'CARD';
      dispatch(setDashBoardFilter(filter));
    }
  }, []);
  return (
    <>
      <PageHeader
        ghost
        title="Card Transaction"
      />
      <Main>
        <Row gutter={25} justify="center">
          <Col xxl={24} md={24} sm={24} xs={24}>
            <Cards headless>
              <FilterBar paymentType={paymentType} />
            </Cards>
          </Col>
          <Cards title="Transaction Detail">
            <Row>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionChart />
              </Col>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionTable />
              </Col>
            </Row>
          </Cards>
        </Row>
      </Main>
    </>
  );
}

export default CardSale;
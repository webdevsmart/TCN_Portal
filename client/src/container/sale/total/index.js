import React, { lazy, Suspense, useState } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';

const FilterBar = lazy(() => import('../../dashboard/overview/searchFilterBar'));
const TransactionTable = lazy(() => import('./overview/transactionTable'));
const TransactionChart = lazy(() => import('../../dashboard/overview/transactionChart'));

const TotalSale = () => {
  const paymentType = [
    {'key': 'all', 'label': 'Total'},
    {'key': 'CARD', 'label': 'Credit'},
    {'key': 'CASH', 'label': 'Cash'},
    {'key': 'MASTERCARD', 'label': 'MasterCard'},
    {'key': 'VISA', 'label': 'Visa'},
    {'key': 'BILL', 'label': 'Bill'},
    {'key': 'COIN', 'label': 'Coin'},
  ];
  return (
    <>
      <PageHeader
        ghost
        title="Total Sales"
      />
      <Main>
        <Row gutter={25} justify="center">
          <Col xxl={24} md={24} sm={24} xs={24}>
            <FilterBar paymentType={paymentType} />
          </Col>
          <Cards title="Transaction Detail">
            <Col xs={24}>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionChart />
              </Col>
              <Col xxl={24} md={24} sm={24} xs={24}>
                <TransactionTable />
              </Col>
            </Col>
          </Cards>
        </Row>
      </Main>
    </>
  );
}

export default TotalSale;
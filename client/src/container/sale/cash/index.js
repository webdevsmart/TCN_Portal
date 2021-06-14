import React, { lazy, Suspense, useState } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { Main } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';

const FilterBar = lazy(() => import('../../dashboard/overview/searchFilterBar'));
const TransactionTable = lazy(() => import('./overview/transactionTable'));

const TotalSale = () => {
  const paymentType = ['COIN', 'BILL'];
  return (
    <>
      <PageHeader
        ghost
        title="Total Sale"
      />
      <Main>
        <Row gutter={25} justify="center">
          <Col xxl={24} md={24} sm={24} xs={24}>
            <FilterBar paymentType={paymentType} />
          </Col>
          <Col xxl={24} md={24} sm={24} xs={24}>
            <TransactionTable />
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default TotalSale;
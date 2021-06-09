import React, { lazy, Suspense } from 'react';
import { Row, Col, Skeleton } from 'antd';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Main } from '../styled';
import { Cards } from '../../components/cards/frame/cards-frame';

const FilterBar = lazy(() => import('./overview/searchFilterBar'));
const DailyOverview = lazy(() => import('./overview/dailyOverview'));
const TransactionOverview = lazy(() => import('./overview/transactionOverview'));

const Dashboard = () => {
  return (
    <>
      <PageHeader
        ghost
        title="Dashboard"
      />
      <Main>
        <Row gutter={25} justify="center">
          <Col xxl={24} md={24} sm={24} xs={24}>
            <FilterBar />
          </Col>
          <Col xxl={8} xl={10} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <DailyOverview />
            </Suspense>
          </Col>
          <Col xxl={16} xl={14} lg={12} xs={24}>
            <Suspense
              fallback={
                <Cards headless>
                  <Skeleton active />
                </Cards>
              }
            >
              <TransactionOverview />
            </Suspense>
          </Col>
        </Row>
      </Main>
    </>
  );
}

export default Dashboard;
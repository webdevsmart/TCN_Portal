import React, {useEffect, useState} from 'react';
import { Row, Col } from 'antd';
import { addDays } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import axios from "axios";
import { CardBarChart2, EChartCard } from './style';
import TransactionTable from './transactionTable';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Cards } from '../../components/cards/frame/cards-frame';
import { ExportButtonPageHeader } from '../../components/buttons/export-button/export-button';
import { CalendarButtonPageHeader } from '../../components/buttons/calendar-button/calendar-button';
import { Button } from '../../components/buttons/buttons';
import Heading from '../../components/heading/heading';
import { Main } from '../styled';

var date = new Date();
console.log(new Date(date.getFullYear(), date.getMonth(), 1))
const Dashboard = () => {
  const [state, updateState] = useState({
    dateRange: {
      startDate: new Date(date.getFullYear(), date.getMonth(), 1),
      endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    },
  });
  const [totalPriceData, setTotalPriceData] = useState({
    totalPrice: 0,
    cashPrice: 0,
    billPrice: 0,
    coinPrice: 0,
    cardPrice: 0,
    visaPrice: 0,
    masterPrice: 0,
    refund: 0
  });
  
  
  useEffect(() => {
    const getTotalPrice = () => {
      let url = "/api/dashboard/getTotalData";
      let data = state.dateRange;
      axios.post(url, { data })
      .then(res => {
        if (res.data.status === "success") {
          setTotalPriceData(res.data.data)
        }
      });
    }
    getTotalPrice();
  }, [state])
  
  // change date
  const updateDateRange = (range) => {
    updateState({...state, dateRange : range});
  }
  return (
    <>
      <PageHeader
        ghost
        title="Dashboard"
        buttons={[
          <div key="6" className="page-header-actions">
            <CalendarButtonPageHeader key="1" updateRangeDate={updateDateRange} dateRange={state.dateRange}/>
            <ExportButtonPageHeader key="2" />
            <Button size="small" key="4" type="primary">
              <FeatherIcon icon="plus" size={14} />
              Add New
            </Button>
          </div>,
        ]}
      />
      <Main>
        <Row gutter={25}>
          <Col xxl={6} md={12} sm={12} xs={24}>
            <Cards headless>
              <EChartCard>
                <div className="card-chunk">
                  <CardBarChart2>
                    <Heading as="h1">${totalPriceData.totalPrice}</Heading>
                    <span>Total</span>
                    <p>
                      <span className="growth-upward">
                        <FeatherIcon icon="arrow-up" /> 25%
                      </span>
                      <span>Since last week</span>
                    </p>
                  </CardBarChart2>
                </div>
                {/* <div className="card-chunk">
                  <ChartjsBarChartTransparent
                    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                    datasets={[
                      {
                        data: [20, 60, 50, 45, 50, 60, 70],
                        backgroundColor: '#EFEFFE',
                        hoverBackgroundColor: '#5F63F2',
                        label: 'Orders',
                      },
                    ]}
                    options={chartOptions}
                  />
                </div> */}
              </EChartCard>
            </Cards>
          </Col>
          <Col xxl={6} md={12} sm={12} xs={24}>
            <Cards headless>
              <EChartCard>
                <div className="card-chunk">
                  <CardBarChart2>
                    <Heading as="h1">${totalPriceData.cardPrice}</Heading>
                    <span>Card</span>
                    <p>
                      <span className="growth-upward">
                        <FeatherIcon icon="arrow-up" /> 25%
                      </span>
                      <span>Since last week</span>
                    </p>
                  </CardBarChart2>
                </div>
                {/* <div className="card-chunk">
                  <ChartjsBarChartTransparent
                    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                    datasets={[
                      {
                        data: [20, 60, 50, 45, 50, 60, 70],
                        backgroundColor: '#FFF0F6',
                        hoverBackgroundColor: '#FF69A5',
                        label: 'Revenue',
                      },
                    ]}
                    options={chartOptions}
                  />
                </div> */}
              </EChartCard>
            </Cards>
          </Col>

          <Col xxl={6} md={12} sm={12} xs={24}>
            <Cards headless>
              <EChartCard>
                <div className="card-chunk">
                  <CardBarChart2>
                    <Heading as="h1">${totalPriceData.cashPrice}</Heading>
                    <span>Cash</span>
                    <p>
                      <span className="growth-upward">
                        <FeatherIcon icon="arrow-up" /> 25%
                      </span>
                      <span>Since last week</span>
                    </p>
                  </CardBarChart2>
                </div>
                {/* <div className="card-chunk">
                  <ChartjsBarChartTransparent
                    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                    datasets={[
                      {
                        data: [20, 60, 50, 45, 50, 60, 70],
                        backgroundColor: '#E8FAF4',
                        hoverBackgroundColor: '#20C997',
                        label: 'Avg Orders',
                      },
                    ]}
                    options={chartOptions}
                  />
                </div> */}
              </EChartCard>
            </Cards>
          </Col>
          <Col xxl={6} md={12} sm={12} xs={24}>
            <Cards headless>
              <EChartCard>
                <div className="card-chunk">
                  <CardBarChart2>
                    <Heading as="h1">${totalPriceData.refundPrice}</Heading>
                    <span>Refunds</span>
                    <p>
                      <span className="growth-upward">
                        <FeatherIcon icon="arrow-up" /> 25%
                      </span>
                      <span>Refund</span>
                    </p>
                  </CardBarChart2>
                </div>
                {/* <div className="card-chunk">
                  <ChartjsBarChartTransparent
                    labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']}
                    datasets={[
                      {
                        data: [20, 60, 50, 45, 50, 60, 70],
                        backgroundColor: '#E9F5FF',
                        hoverBackgroundColor: '#2C99FF',
                        label: 'Visitors',
                      },
                    ]}
                    options={chartOptions}
                  />
                </div> */}
              </EChartCard>
            </Cards>
          </Col>
        </Row>
        <TransactionTable dateRange={state.dateRange} />
      </Main>
    </>
  );
};

export default Dashboard;

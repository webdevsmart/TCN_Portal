import React, {useEffect, useState} from 'react';
import { Row, Col, Select, Table, Badge } from 'antd';
import { addDays } from 'date-fns';
import FeatherIcon from 'feather-icons-react';
import axios from "axios";
import { CardBarChart2, EChartCard } from './style';
import { PageHeader } from '../../components/page-headers/page-headers';
import { Cards } from '../../components/cards/frame/cards-frame';
import { Button } from '../../components/buttons/buttons';
import { Main } from '../styled';
import Heading from '../../components/heading/heading';
// import { ChartjsBarChartTransparent } from '../../components/charts/chartjs';
import { ExportButtonPageHeader } from '../../components/buttons/export-button/export-button';
import { CalendarButtonPageHeader } from '../../components/buttons/calendar-button/calendar-button';

const { Option } = Select;

const Dashboard = () => {
  const [state, updateState] = useState({
    totalPrice: 0,
    cashPrice: 0,
    billPrice: 0,
    coinPrice: 0,
    cardPrice: 0,
    visaPrice: 0,
    masterPrice: 0,
    refund: 0,
    dateRange: {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
    },
    selectedMachine: []
  });
  
  const [machines, setMachines] = useState([]);
  const [transactionList, setTransactionList] = useState([]);
  
  const transactionDataSource = [];
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Device Name',
      dataIndex: 'devName',
      key: 'devName',
    },
    {
      title: 'Machine UID',
      dataIndex: 'machineUID',
      key: 'machineUID',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  let totalPriceFilter = {
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
  }

  const getTotalPrice = () => {
    let url = "/api/dashboard/getTotalData";
    let data = state.dateRange;
    axios.post(url, { data })
    .then(res => {
      if (res.data.status === "success") {
        updateState(res.data.data)
      }
    });
  }

  useEffect(() => {
    // get total prices
    getTotalPrice()

    // get machine name list
    let url = "/api/dashboard/getMachineList";
    axios.get(url)
    .then(res => {
      if (res.data.status === "success") {
        setMachines(res.data.data)
      }
    });
    
    getTransactionList();

  }, []);

  const getTransactionList = () => {
    let url = "/api/dashboard/getDetail";
    let data = {
      machineUIDs: state.selectedMachine,
      dateRange: state.dateRange
    }
    axios.post(url, {data})
    .then(res => {
      setTransactionList(res.data.data)
    })
  }

  // set transaction datatable datasource
  transactionList.map((value, index) => {
    const {time, status, devName, machineUID, product, price } = value;
    return transactionDataSource.push({
      key: index,
      time,
      status: status === "success" ? <Badge count={status}  style={{ backgroundColor: '#20C997' }}/> : <Badge count={status} />,
      devName,
      machineUID,
      product,
      price: (
        "$" + price
      ),
    });
  });
  // console.log(transactionDataSource)
  const showDetail = (value) => {
    state.selectedMachine = value;
    getTransactionList();
    
  }

  // change date
  const updateDateRange = (range) => {
    state.dateRange = range;
    getTotalPrice()
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
                    <Heading as="h1">${state.totalPrice}</Heading>
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
                    <Heading as="h1">${state.cardPrice}</Heading>
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
                    <Heading as="h1">${state.cashPrice}</Heading>
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
                    <Heading as="h1">${state.refundPrice}</Heading>
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
        <Cards title="Transaction Detail">
          <Col md={6} xs={24}>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="select one country"
              defaultValue={[]}
              optionLabelProp="label"
              onChange={showDetail}
            >
              {
                machines.map((machine, index) => {
                  return <Option value={machine.UID} label={machine.devName} key={index}>
                          {machine.devName}
                        </Option>;
                })
              }
              
            </Select>
          </Col>
          <Col xs={24}>
            <Cards title="Basic Usage">
              <Table className="table-responsive" pagination={true} dataSource={transactionDataSource} columns={columns} />
            </Cards>
          </Col>
        </Cards>
      </Main>
    </>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { Spin, notification } from 'antd';
import { NavLink, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { PerformanceChartWrapper, Pstates } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { ChartjsAreaChart } from '../../../components/charts/chartjs';
import { chartLinearGradient, customTooltips } from '../../../components/utilities/utilities';
import { performanceFilterData, performanceGetData, setIsLoading } from '../../../redux/chartContent/actionCreator';
import Axios from 'axios';

const moreContent = (
  <>
    <NavLink to="#">
      <FeatherIcon size={16} icon="printer" />
      <span>Printer</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="book-open" />
      <span>PDF</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file-text" />
      <span>Google Sheets</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="x" />
      <span>Excel (XLSX)</span>
    </NavLink>
    <NavLink to="#">
      <FeatherIcon size={16} icon="file" />
      <span>CSV</span>
    </NavLink>
  </>
);

const TransactionOverview = () => {
  const dispatch = useDispatch();
  const { filter, performanceState, preIsLoading } = useSelector(state => {
    return {
      performanceState: state.chartContent.performanceData,
      preIsLoading: state.chartContent.perLoading,
      filter: state.filterDashboard.data
    };
  });
  const [state, setState] = useState({
    performance: 'year',
    performanceTab: 'users',
    totalPrice: 0,
    refundPrice: 0,
    feePrice: 0,
    cardPriceState: {
      totalPrice: 0,
      masterPrice: 0,
      VisaPrice: 0,
    },
    cashPriceState: {
      totalPrice: 0,
      coinPrice: 0,
      billPrice: 0,
    }
  });

  // const [state, setState] = useState({
    
  // });

  const { performance, performanceTab, cardPriceState, cashPriceState, totalPrice, refundPrice, feePrice } = state;

  const getPriceData = () => {
    Axios.post("/api/dashboard/getPriceData", {filter})
    .then( res => {
      if ( res.data.status === 'success' ) {
        setState({
          ...state,
          totalPrice: res.data.data.totalPrice,
          refundPrice: res.data.data.refundPrice,
          feePrice: res.data.data.feePrice,
          cardPriceState: res.data.data.cardPriceState,
          cashPriceState: res.data.data.cashPriceState
        })
      } else {
        notification['warning']({
          message: 'Warning!',
          description: 
            "Server Error!"
        })
      }
    })
    .catch( err => {
      notification['warning']({
        message: 'Warning!',
        description: 
          "Server Error!"
      })
    });
  }

  // getPriceData()
  useEffect(() => {
    getPriceData();
  }, [filter.siteID, filter.date])

  useEffect(() => {
    if (performanceGetData) {
      dispatch(performanceGetData());
    }
  }, [dispatch]);

  const handleActiveChangePerformance = value => {
    setState({
      ...state,
      performance: value,
    });
    dispatch(performanceFilterData(value));
  };

  const onPerformanceTab = value => {
    setState({
      ...state,
      performanceTab: value,
    });
    return dispatch(setIsLoading());
  };

  const performanceDatasets = performanceState !== null && [
    {
      data: performanceState[performanceTab][1],
      borderColor: '#5F63F2',
      borderWidth: 4,
      fill: true,
      backgroundColor: () =>
        chartLinearGradient(document.getElementById('performance'), 300, {
          start: '#5F63F230',
          end: '#ffffff05',
        }),
      label: 'Current period',
      pointStyle: 'circle',
      pointRadius: '0',
      hoverRadius: '9',
      pointBorderColor: '#fff',
      pointBackgroundColor: '#5F63F2',
      hoverBorderWidth: 5,
    }
  ];

  return (
    <PerformanceChartWrapper>
      {performanceState !== null && (
        <Cards
          title="Range Transaction Prices"
          size="large"
        >
          <Pstates>
            <div
              onClick={() => onPerformanceTab('users')}
              className={`growth-upward ${performanceTab === 'users' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Total</p>
              <Heading as="h1">
                $ {totalPrice}
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('sessions')}
              className={`growth-upward ${performanceTab === 'sessions' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Card</p>
              <Heading as="h1">
                $ { cardPriceState.totalPrice }
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('bounce')}
              className={`growth-downward ${performanceTab === 'bounce' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Cash</p>
              <Heading as="h1">
                $ { cashPriceState.totalPrice }
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('duration')}
              className={`growth-upward ${performanceTab === 'duration' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Fee</p>
              <Heading as="h1">
                $ { feePrice }
              </Heading>
            </div>
          </Pstates>
          {preIsLoading ? (
            <div className="sd-spin">
              <Spin />
            </div>
          ) : (
            <div className="performance-lineChart">
              <ChartjsAreaChart
                id="performance"
                labels={performanceState.labels}
                datasets={performanceDatasets}
                options={{
                  maintainAspectRatio: true,
                  elements: {
                    z: 9999,
                  },
                  legend: {
                    display: false,
                  },
                  hover: {
                    mode: 'index',
                    intersect: false,
                  },
                  tooltips: {
                    mode: 'label',
                    intersect: false,
                    backgroundColor: '#ffffff',
                    position: 'average',
                    enabled: false,
                    custom: customTooltips,
                    callbacks: {
                      title() {
                        return performanceTab;
                      },
                      label(t, d) {
                        const { yLabel, datasetIndex } = t;
                        return `<span class="chart-data">${yLabel}k</span> <span class="data-label">${d.datasets[datasetIndex].label}</span>`;
                      },
                    },
                  },
                  scales: {
                    yAxes: [
                      {
                        gridLines: {
                          color: '#e5e9f2',
                          borderDash: [3, 3],
                          zeroLineColor: '#e5e9f2',
                          zeroLineWidth: 1,
                          zeroLineBorderDash: [3, 3],
                        },
                        ticks: {
                          beginAtZero: true,
                          fontSize: 13,
                          fontColor: '#182b49',
                          max: 80,
                          stepSize: 20,
                          callback(label) {
                            return `${label}k`;
                          },
                        },
                      },
                    ],
                    xAxes: [
                      {
                        gridLines: {
                          display: true,
                          zeroLineWidth: 2,
                          zeroLineColor: 'transparent',
                          color: 'transparent',
                          z: 1,
                          tickMarkLength: 0,
                        },
                        ticks: {
                          padding: 10,
                        },
                      },
                    ],
                  },
                }}
                height={window.innerWidth <= 575 ? 200 : 86}
              />
              <ul>
                {performanceDatasets &&
                  performanceDatasets.map((item, index) => {
                    return (
                      <li key={index + 1} className="custom-label">
                        <span
                          style={{
                            backgroundColor: item.borderColor,
                          }}
                        />
                        {item.label}
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </Cards>
      )}
    </PerformanceChartWrapper>
  );
};

export default TransactionOverview;

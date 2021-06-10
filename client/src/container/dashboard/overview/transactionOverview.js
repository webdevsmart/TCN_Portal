import React, { useState, useEffect } from 'react';
import { Spin, notification } from 'antd';
import { NavLink, Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { numberWithCommas } from '../../../utility/utility';
import { PerformanceChartWrapper, Pstates } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { ChartjsAreaChart } from '../../../components/charts/chartjs';
import { chartLinearGradient, customTooltips } from '../../../components/utilities/utilities';
import { setIsLoading } from '../../../redux/chartContent/actionCreator';

const TransactionOverview = ({ updatePriceData }) => {
  const dispatch = useDispatch();
  const { filter, preIsLoading } = useSelector(state => {
    return {
      preIsLoading: state.chartContent.perLoading,
      filter: state.filterDashboard.data
    };
  });

  const [state, setState] = useState({
    performanceTab: 'totalPrice',
    totalPrice: 0,
    refundPrice: 0,
    feePrice: 0,
    cardPriceState: {
      totalPrice: 0,
      masterPrice: 0,
      visaPrice: 0,
    },
    cashPriceState: {
      totalPrice: 0,
      coinPrice: 0,
      billPrice: 0,
    }
  });

  const [chartData, setChartData] = useState({
    labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
    data: [],
  });

  const { performanceTab, cardPriceState, cashPriceState, totalPrice, refundPrice, feePrice } = state;

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
        });
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

  useEffect(() => {
    getPriceData();
  }, [filter.siteID, filter.date]);

  useEffect(() => {
    updatePriceData( cardPriceState, cashPriceState );
  }, [ cardPriceState, cashPriceState ]);

  const getChartData = () => {
    Axios.post("/api/dashboard/getChartData", {filter: filter, tab: performanceTab})
    .then( res => {
      if ( res.data.status === 'success') {
        setChartData(res.data.data)
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

  useEffect(() => {
    getChartData();
    dispatch(setIsLoading());
  }, [filter.siteID, filter.date, performanceTab]);

  const onPerformanceTab = value => {
    setState({
      ...state,
      performanceTab: value,
    });
    return dispatch(setIsLoading());
  };

  const performanceDatasets = chartData !== null && [
    {
      data: chartData.data,
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
      {chartData !== null && (
        <Cards
          title="Range Transaction Prices"
          size="large"
        >
          <Pstates>
            <div
              onClick={() => onPerformanceTab('totalPrice')}
              className={`growth-upward ${performanceTab === 'totalPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Total</p>
              <Heading as="h1">
                $ {numberWithCommas( totalPrice )}
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('cardPrice')}
              className={`growth-upward ${performanceTab === 'cardPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Card</p>
              <Heading as="h1">
                $ { numberWithCommas( cardPriceState.totalPrice ) }
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('cashPrice')}
              className={`growth-downward ${performanceTab === 'cashPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Cash</p>
              <Heading as="h1">
                $ { numberWithCommas( cashPriceState.totalPrice ) }
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('fee')}
              className={`growth-upward ${performanceTab === 'fee' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
            >
              <p>Fee</p>
              <Heading as="h1">
                $ { numberWithCommas( feePrice ) }
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
                labels={chartData.labels}
                datasets={performanceDatasets}
                options={{
                  maintainAspectRatio: true,
                  onClick: function(evt, element) {
                    if (element.length > 0) {
                      console.log(element);
                    }
                  },
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
                        return `<span class="chart-data" onclick='clickHandle'>${yLabel}$</span>`;
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
                          max: Math.round(Math.max(...chartData.data) / 10) * 10 + 20,
                          stepSize: (Math.round(Math.max(...chartData.data) / 10) * 10 + 20) / 5,
                          callback(label) {
                            return `${label}`;
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

import React from 'react';
import { Spin } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { useHistory } from 'react-router';

import useChartData from '../../../hooks/useChartData';
import { numberWithCommas } from '../../../utility/utility';
import { useDispatch, useSelector } from 'react-redux';
import { SessionChartWrapper, SessionState } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';

const DetailOverview = ({ type, data }) => {
  const { ref } = useChartData();
  const routerHistory = useHistory();
  const dispatch = useDispatch();
  let subType = [];
  if ( type === 'Card' ) {
    subType =["MasterCard", "Visa"];
  } else {
    subType =["Coin", "Bill"];
  }
  const { deviceState, dvIsLoading, filter } = useSelector(state => {
    return {
      deviceState: data,
      dvIsLoading: state.chartContent.dvLoading,
      filter: state.filterDashboard.data,
    };
  });


  const datasets = deviceState.length > 0 && [
    {
      data: deviceState,
      backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
      total: '9,283',
    },
  ]

  const chartData = deviceState.length > 0 && {
    labels : subType,
    datasets
  };

  return (
    <SessionChartWrapper>
      {deviceState.length > 0 && (
        <Cards
          title={`${type} Transaction`}
          size="large"
        >
          {dvIsLoading ? (
            <div className="sd-spin">
              <Spin />
            </div>
          ) : (
            <div className="session-chart-inner">
              <div style={{ position: 'relative' }}>
                <p>
                  <span>$ {numberWithCommas( parseFloat(Math.round( datasets[0].data.reduce((a, b) => a + b, 0) * 10 ) / 10) )}</span>
                  Transaction Amount
                </p>
                <Doughnut 
                  ref={ref} 
                  data={chartData}
                  options={{
                    cutoutPercentage: 70,
                    maintainAspectRatio: true,
                    responsive: true,
                    legend: {
                      display: false,
                      position: 'bottom',
                    },
                    animation: {
                      animateScale: true,
                      animateRotate: true,
                    },
                    onClick: (evt, element) => {
                      const index = element[0]._index;
                      filter.paymentType = subType[index].toUpperCase();
                      dispatch(setDashBoardFilter(filter));

                      if ( subType[index] === 'MasterCard' || subType[index] === 'Visa' ) {
                        routerHistory.push("/sale/total");
                      } else {
                        routerHistory.push("/sale/cash");
                      }
                    }
                  }}
                  height = {200}
                />
              </div>

              <SessionState className="session-wrap d-flex justify-content-center">
                <div className="session-single">
                  <div className="chart-label">
                    <span className="label-dot dot-success" />
                    { subType[0] }
                  </div>
                  <span>$ {numberWithCommas( deviceState[0] )}</span>
                  <sub>{ data[0] + data[1] === 0 ? 0 : Math.round(data[0] * 100 / (data[0] + data[1])) }%</sub>
                </div>
                <div className="session-single">
                  <div className="chart-label">
                    <span className="label-dot dot-info" />
                    { subType[1] }
                  </div>
                  <span>$ {numberWithCommas( deviceState[1] )}</span>
                  <sub>{ data[0] + data[1] === 0 ? 0 : Math.round(data[1] * 100 / (data[0] + data[1])) }%</sub>
                </div>
              </SessionState>
            </div>
          )}
        </Cards>
      )}
    </SessionChartWrapper>
  );
};

export default DetailOverview;

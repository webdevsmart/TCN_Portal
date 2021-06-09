import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { SessionChartWrapper, SessionState } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { ChartjsDonutChart } from '../../../components/charts/chartjs';

import { deviceFilterData, deviceGetData } from '../../../redux/chartContent/actionCreator';

const DetailOverview = ({ type }) => {
  let subType = [];
  if ( type == 'Card' ) {
    subType =["MasterCard", "Visa"]
  } else {

  }
  const dispatch = useDispatch();
  const { deviceState, dvIsLoading } = useSelector(state => {
    return {
      deviceState: state.chartContent.deviceData,
      dvIsLoading: state.chartContent.dvLoading,
    };
  });



  const [state, setState] = useState({
    device: 'year',
  });

  useEffect(() => {
    if (deviceGetData) {
      dispatch(deviceGetData());
    }
  }, [dispatch]);

  const handleActiveChangeDevice = value => {
    setState({
      ...state,
      device: value,
    });
    dispatch(deviceFilterData(value));
  };

  return (
    <SessionChartWrapper>
      {deviceState !== null && (
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
              <ChartjsDonutChart
                labels={['Desktop', 'Mobiles', 'Tablets']}
                datasets={[
                  {
                    data: deviceState,
                    backgroundColor: ['#20C997', '#5F63F2', '#FA8B0C'],
                    total: '9,283',
                  },
                ]}
              />

              <SessionState className="session-wrap d-flex justify-content-center">
                <div className="session-single">
                  <div className="chart-label">
                    <span className="label-dot dot-success" />
                    Desktop
                  </div>
                  <span>{deviceState[0]}</span>
                  <sub>45%</sub>
                </div>
                <div className="session-single">
                  <div className="chart-label">
                    <span className="label-dot dot-info" />
                    Mobile
                  </div>
                  <span>{deviceState[1]}</span>
                  <sub>30%</sub>
                </div>
                <div className="session-single">
                  <div className="chart-label">
                    <span className="label-dot dot-warning" />
                    Tablets
                  </div>
                  <span>{deviceState[1]}</span>
                  <sub>25%</sub>
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

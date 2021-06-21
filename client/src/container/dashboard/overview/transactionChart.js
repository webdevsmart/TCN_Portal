import React, { useState, useEffect, lazy } from 'react';
import { Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { useHistory } from 'react-router';
import moment from 'moment';

import { ChartjsAreaChart } from '../../../components/charts/chartjs';
import { chartLinearGradient, customTooltips } from '../../../components/utilities/utilities';
import { setIsLoading } from '../../../redux/chartContent/actionCreator';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';

const TransactionChart = () => {
  const dispatch = useDispatch();
  const routerHistory = useHistory();
  const { filter, preIsLoading } = useSelector(state => {
    return {
      preIsLoading: state.chartContent.perLoading,
      filter: state.filterDashboard.data
    };
  });
  const [chartData, setChartData] = useState({
    labels: ["1", "2", "3", "4", "5", "6", "7", "8"],
    data: [],
  });
  const getChartData = () => {
    Axios.post("/api/dashboard/getChartData", {filter: filter})
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
    [getChartData()];
  }, [filter.paymentType, filter.siteID, filter.productID, filter.date]);

  const transactionDatasets = chartData !== null && [
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
    <div className="performance-lineChart">
      {chartData.data.length > 0 ? 
      <>
        <ChartjsAreaChart
          id="performance"
          labels={chartData.labels}
          datasets={transactionDatasets}
          options={{
            maintainAspectRatio: true,
            onClick: async function(evt, element) {
              let start = new Date(filter.date[0]);
              let end = new Date(filter.date[1]);
              let differentDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);

              if (element.length > 0 && differentDays > 2) {
                let index = element[0]._index;
                filter.date = [ moment(chartData.labels[index] + ' 00:00:00'), moment(chartData.labels[index] + ' 23:59:59') ];
                await dispatch(setDashBoardFilter(filter))
                console.log(filter.paymentType)

                if ( filter.paymentType === 'all' ) {
                  routerHistory.push('/sale/total')
                } else if ( filter.paymentType === 'CARD' ) {
                  routerHistory.push("/sale/card");
                } else if ( filter.paymentType === 'CASH' ) {
                  routerHistory.push("/sale/cash");
                }
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
                  return filter.paymentType;
                },
                label(t, d) {
                  const { yLabel, xLabel, datasetIndex } = t;
                  return `<span class="chart-data">${yLabel}$ (${xLabel}) </span> `;
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
          {transactionDatasets &&
            transactionDatasets.map((item, index) => {
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
      </> : ''}
    </div>
  )
}

export default TransactionChart;
import React, { useState, useEffect, lazy } from 'react';
import { Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';


import { numberWithCommas } from '../../../utility/utility';
import { PerformanceChartWrapper, Pstates } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { setIsLoading } from '../../../redux/chartContent/actionCreator';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';

const TransactionChart = lazy(() => import('./transactionChart'));

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
  }, [ filter.siteID, filter.date, filter.productID ]);

  useEffect(() => {
    if ( updatePriceData ) {
      updatePriceData( cardPriceState, cashPriceState );
    }
  }, [ cardPriceState, cashPriceState ]);

  const onPerformanceTab = value => {
    setState({
      ...state,
      performanceTab: value,
    });
    filter.paymentType = value;
    dispatch( setDashBoardFilter(filter) );
    return dispatch(setIsLoading());
  };

  return (
    <PerformanceChartWrapper>
      {totalPrice !== null && (
        <Cards
          title="Range Transaction Prices"
          size="large"
        >
          <Pstates style={{ flexFlow: 'wrap' }}>
            <div
              onClick={() => onPerformanceTab('all')}
              className={`growth-upward ${performanceTab === 'totalPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
              style={{ flex: '25% 0' }}
            >
              <p>Total</p>
              <Heading as="h1">
                $ {numberWithCommas( totalPrice )}
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('CARD')}
              className={`growth-upward ${performanceTab === 'cardPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
              style={{ flex: '25% 0' }}
            >
              <p>Card</p>
              <Heading as="h1">
                $ { numberWithCommas( cardPriceState.totalPrice ) }
              </Heading>
            </div>
            <div
              onClick={() => onPerformanceTab('CASH')}
              className={`growth-downward ${performanceTab === 'cashPrice' && 'active'}`}
              role="button"
              onKeyPress={() => {}}
              tabIndex="0"
              style={{ flex: '25% 0' }}
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
              style={{ flex: '25% 0' }}
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
            <TransactionChart />
          )}
        </Cards>
      )}
    </PerformanceChartWrapper>
  );
};

export default TransactionOverview;

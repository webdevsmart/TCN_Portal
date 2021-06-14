import React, { useEffect, useState } from 'react';
import { Progress, notification } from 'antd';
import FeatherIcon from 'feather-icons-react';
import { useSelector } from 'react-redux';
import { OverviewCard } from '../style';
import { Cards } from '../../../components/cards/frame/cards-frame';
import Heading from '../../../components/heading/heading';
import { Button } from '../../../components/buttons/buttons';
import { Dropdown } from '../../../components/dropdown/dropdown';
import Axios from 'axios';

const DailyOverview = () => {
  const filter = useSelector(state => state.filterDashboard.data)
  
  const { rtl } = useSelector(state => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });
  const [state, setstate] = useState({
    transactions: {
      totalCount: 0,
      successCount: 0,
      lastRate: 0,
      currentRate: 0,
    },
    cardRate: {
      totalPrice: 0,
      cardPrice: 0,
      lastRate: 0,
      currentRate: 0,
    }
  });

  useEffect(() => {
    // console.log(filter)
    const getTodayData = () => {
      Axios.post('/api/dashboard/getTodayData', { siteID: filter.siteID, productID: filter.productID })
      .then( res => {
        if ( res.data.status === 'success' ) {
          setstate(res.data.data)
        } else {
          notification['warning']({
            message: 'Warning!',
            description: 
              res.data.message
          })
        }
      })
      .catch( res => {
        notification['warning']({
          message: 'Warning!',
          description: 
            "Server Error!"
        })
      })
    }
    getTodayData();
  }, [ filter.siteID, filter.productID ]);

  return (
    <OverviewCard>
      <div className="d-flex align-items-center justify-content-between overview-head">
        <Heading as="h4">Today Transaction Overview</Heading>
      </div>
      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
              <Heading as="h2" className="color-primary">
                { state.transactions.successCount }
              </Heading>
              <p>Success Count</p>
            </div>
            <div className="overview-box-single text-right">
              <Heading as="h2">{ state.transactions.totalCount }</Heading>
              <p>Total Count</p>
            </div>
          </div>

          <Progress percent={ state.transactions.currentRate } showInfo={false} className="progress-primary" />

          <p>
            <span className={(state.transactions.currentRate - state.transactions.lastRate) > 0 ? "growth-upward" : "growth-downward"}>
              <FeatherIcon icon={(state.transactions.currentRate - state.transactions.lastRate) > 0 ? "arrow-up" : "arrow-down"} size={14} />
              { Math.abs(state.transactions.currentRate - state.transactions.lastRate) }% <span>Since yesterday</span>
            </span>
            <span className="overview-box-percentage" style={{ float: !rtl ? 'right' : 'left' }}>
              { state.transactions.currentRate }%
            </span>
          </p>
        </Cards>
      </div>

      <div className="overview-box">
        <Cards headless>
          <div className="d-flex align-items-center justify-content-between">
            <div className="overview-box-single">
              <Heading as="h2" className="color-info">
                ${ state.cardRate.cardPrice }
              </Heading>
              <p>Card Price</p>
            </div>
            <div className="overview-box-single text-right">
              <Heading as="h2">${ state.cardRate.totalPrice }</Heading>
              <p>Total Price</p>
            </div>
          </div>
          <Progress percent={ state.cardRate.currentRate } showInfo={false} />
          <p>
            <span className={(state.cardRate.currentRate - state.cardRate.lastRate) > 0 ? "growth-upward" : "growth-downward"}>
              <FeatherIcon icon={(state.cardRate.currentRate - state.cardRate.lastRate) > 0 ? "arrow-up" : "arrow-down"} size={ 14 } />
              { Math.abs(state.cardRate.currentRate - state.cardRate.lastRate) }% <span>Since yesterday</span>
            </span>
            <span className="overview-box-percentage" style={{ float: !rtl ? 'right' : 'left' }}>
              { state.cardRate.currentRate }%
            </span>
          </p>
        </Cards>
      </div>
    </OverviewCard>
  );
};

export default DailyOverview;

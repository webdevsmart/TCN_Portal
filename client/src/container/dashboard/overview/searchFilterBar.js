import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Space, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { BasicFormWrapper } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';
import { FilterStyle } from '../style';
import Axios from 'axios';

const { RangePicker } = DatePicker;

const FilterBar = () => {
  const dispatch = useDispatch();
  const filter = useSelector(state => state.filterDashboard.data) 
  const [companyList, setCompanyList] = useState([])
  const [siteList, setSiteList] = useState([])
  const [state, setState] = useState({
    "siteID": filter.siteID,
  })

  useEffect(() => {
    Axios.get("/api/dashboard/getSiteIDs")
    .then( res => {
      if ( res.data.status == 'success' ) {
        setSiteList( res.data.data )
      } else {
        notification['warning']({
          message: 'Warning!',
          description: 
            res.data.message
        })
      }
    })
    .catch( err => {
      notification['warning']({
        message: 'Warning!',
        description: 
          "Server Error!"
      })
    })
  }, []);

  useEffect(() => {
    if ( siteList.length > 0 ) {
      filter.siteID = [];
      siteList.map( item => {
        filter.siteID.push(item)
      });
      setState({
        ...state,
        siteID: filter.siteID
      });
    }
  }, [ siteList ]);

  return (
    <>
      <FilterStyle>
        <Cards headless>
          <Row gutter="25">
            <Col md={6} sm={12} xs={24}>
              <span>Site Id: </span>
              <Select 
                mode="multiple"
                style={{ width: '100%', minHeight: '49px' }}
                defaultValue={state.siteID}
                optionLabelProp="label"
                onChange={values => {
                  if (values && values.length && values.includes("all")) {
                    if (filter.siteID.length == siteList.length) {
                      filter.siteID = [];
                    } else {
                      filter.siteID = [];
                      siteList.map(item => {
                        filter.siteID.push(item)
                      })
                    }
                  } else {
                    filter.siteID = values
                  }
                  console.log(filter)
                  dispatch(setDashBoardFilter(filter))
                }}
                maxTagCount={2}
                value={filter.siteID}
                >
                  <Select.Option key="all" value="all">---SELECT ALL---</Select.Option>
                {
                  siteList.map( (item, index) => {
                    return (
                      <Select.Option value={item} key={index}>{item}</Select.Option>
                    );
                  })
                }
              </Select>
            </Col>
            <Col md={8} sm={8} xs={24}>
              <span>Date Range:</span>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={( date, dateString ) => {
                  filter.date = date;
                  dispatch(setDashBoardFilter(filter))
                }}
                defaultValue={filter.date}
              />
            </Col>
          </Row>
        </Cards>
      </FilterStyle>
    </>
  );
}

export default FilterBar;
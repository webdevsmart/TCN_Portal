import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'
import { Row, Col, Space, Input, Select, DatePicker, notification } from 'antd';
import moment from 'moment';
import { BasicFormWrapper } from '../../styled';
import { Cards } from '../../../components/cards/frame/cards-frame';
import { setDashBoardFilter } from '../../../redux/filter/actionCreator';
import { FilterStyle } from '../style';
import Axios from 'axios';

const { RangePicker } = DatePicker;

const FilterBar = ({ paymentType }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  
  const filter = useSelector(state => state.filterDashboard.data)
  const [siteList, setSiteList] = useState([])
  const [productList, setProductList] = useState([])
  const [state, setState] = useState({
    "siteID": filter.siteID,
    "productID": filter.productID,
    "date" : filter.date
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
    });
    if ( location.pathname == '/sale/card' && filter.paymentType  ) {

    }
    // filter.paymentType = 'all';
  }, []);

  useEffect(() => {
    setState({date: filter.date})
  }, [filter.date]);

  // change the filter values on the only homepage
  if (location.pathname == '/') {
    useEffect(() => {
      if ( siteList.length > 0 && filter.siteID.length === 0 ) {
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
  }

  const onSearchProduct = ( keyword ) => {
    Axios.post("/api/dashboard/getProductList", { keyword })
    .then( res => {
      if ( res.data.status == 'success' ) {
        setProductList(res.data.data);
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
          "Serever Error!"
      })
    })
  }

  const onFocusProduct = () => {
    setProductList([]);
  }

  const onChangeProduct = (values, key) => {
    if (values && values.length && values.includes("all")) {
      filter.productID = ["all"];
      setState({
        ...state,
        productID: ["all"]
      })
    } else {
      filter.productID = values;
      setState({
        ...state,
        productID: values
      })
    }
    dispatch(setDashBoardFilter(filter))
  }

  return (
    <>
      <FilterStyle>
        <Cards headless>
          <Row gutter="25">
            <Col md={5} sm={12} xs={24}>
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
                  dispatch(setDashBoardFilter(filter))
                }}
                maxTagCount={2}
                value={filter.siteID}
                >
                  <Select.Option key="all" value="all">---{filter.siteID.length !== siteList.length ? `SELECT` : 'DESELECT'} ALL---</Select.Option>
                {
                  siteList.map( (item, index) => {
                    return (
                      <Select.Option value={item} key={index}>{item}</Select.Option>
                    );
                  })
                }
              </Select>
            </Col>
            <Col md={5} sm={12} xs={24}>
              <span>Product: </span>
              <Select 
                mode="multiple"
                style={{ width: '100%', minHeight: '49px' }}
                defaultValue={filter.productID}
                optionLabelProp="label"
                onChange={onChangeProduct}
                showArrow={false}
                filterOption={false}
                onSearch={onSearchProduct}
                onFocus={onFocusProduct}
                maxTagCount={2}
                value={filter.productID}
                >
                  <Select.Option key="all" value="all">--- ALL---</Select.Option>
                  {
                    productList.map( (item, index) => {
                      return (
                        <Select.Option value={item.id} key={item.id} label={item.name}>{item.name}</Select.Option>
                      );
                    })
                  }
              </Select>
            </Col>
            
              { location.pathname !== '/' ? 
              
                <Col md={5} sm={12} xs={24}>
                  <span>Payment Type: </span>
                  <Select 
                    style={{ width: '100%', minHeight: '49px' }}
                    defaultValue={['all']}
                    optionLabelProp="label"
                    size="default"
                    onChange={(values) => {
                      if (values && values.length && values.includes("all")) {
                        filter.paymentType = ['all'];
                      } else {
                        filter.paymentType = values
                      }
                      dispatch(setDashBoardFilter(filter))
                    }}
                    value={filter.paymentType}
                    >
                    {
                      paymentType.map( (item, index) => {
                        return (
                          <Select.Option value={item.key} key={index} label={item.label}>{item.label}</Select.Option>
                        );
                      })
                    }
                  </Select>
                </Col> : ""
            }
            <Col md={9} sm={12} xs={24}>
              <span>Date Range:</span>
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  'Today': [moment().startOf('day'), moment().endOf('day')],
                  'Yesterday': [moment().add( -1, 'days' ).startOf('day'), moment().add( -1, 'days' ).endOf('day')],
                  'This Week': [moment().startOf('week'), moment().endOf('week')],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                  'This Year': [moment().startOf('year'), moment().endOf('year')],
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={( date, dateString ) => {
                  filter.date = date;
                  dispatch(setDashBoardFilter(filter))
                }}
                value={state.date}
              />
            </Col>
          </Row>
        </Cards>
      </FilterStyle>
    </>
  );
}

export default FilterBar;
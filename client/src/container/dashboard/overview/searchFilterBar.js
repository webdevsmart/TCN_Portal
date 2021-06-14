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
  // const [companyList, setCompanyList] = useState([])
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
    filter.paymentType = 'all';
  }, []);

  // change the filter values on the only homepage
  if (location.pathname == '/') {
    state.date = [
        moment().startOf('month'),
        moment().endOf('month')
    ];
    // filter.date = [
    // ];
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
      filter.date = [
        moment().startOf('month'),
        moment().endOf('month')
      ];
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
            <Col md={5} sm={12} xs={24}>
              <span>Product: </span>
              <Select 
                mode="multiple"
                style={{ width: '100%', minHeight: '49px' }}
                defaultValue={state.productID}
                optionLabelProp="label"
                onChange={onChangeProduct}
                showArrow={false}
                filterOption={false}
                onSearch={onSearchProduct}
                onFocus={onFocusProduct}
                maxTagCount={2}
                value={state.productID}
                >
                  <Select.Option key="all" value="all">---SELECT ALL---</Select.Option>
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
                    onChange={values => {
                      if (values && values.length && values.includes("all")) {
                        filter.paymentType = ['all'];
                      } else {
                        filter.paymentType = values
                      }
                      console.log(filter)
                      dispatch(setDashBoardFilter(filter))
                    }}
                    value={filter.paymentType}
                    >
                      <Select.Option key="all" value="all" style={{ paddingTop: '5px'}}>---SELECT ALL---</Select.Option>
                    {
                      paymentType.map( (item, index) => {
                        return (
                          <Select.Option value={item} key={index}>{item}</Select.Option>
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
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')],
                }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                onChange={( date, dateString ) => {
                  filter.date = date;
                  dispatch(setDashBoardFilter(filter))
                }}
                defaultValue={state.date}
              />
            </Col>
          </Row>
        </Cards>
      </FilterStyle>
    </>
  );
}

export default FilterBar;
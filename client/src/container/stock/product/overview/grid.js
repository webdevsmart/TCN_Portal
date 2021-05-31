import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Row, Col, Pagination, Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ProductCards from './productCards';
import Heading from '../../../../components/heading/heading';
import { PaginationWrapper, NotFoundWrapper } from '../../style';
import { setFilter, setRefresh } from '../../../../redux/product/actionCreator';

const Grid = ({ showModal }) => {
  const {filter, isLoader, tableRefresh} = useSelector(state => {
    return {
      filter: state.products.data,
      isLoader: state.products.loading,
      tableRefresh: state.products.tableRefresh,
    };
  });
  const dispatch = useDispatch();
  
  const [state, setState] = useState({
    showModal: false,
    selectedProduct: null,
    products: {
      list: [],
      totalCount: 0
    }
  });
  const { products } = state;
  
  useEffect(() => {
    dispatch(setRefresh(true));
  }, []);
  
  useEffect(() => {
    const getProductList = () => {
      Axios.post('/api/stock/product/getProductList', {filter})
      .then( res => {
        if (res.data.status === 'success') {
          setState({ ...state, products : res.data.data });
        } else {
          notification["warning"]({
            message: 'Warning',
            description:
            res.data.message,
          });
        }
      })
      .catch(err => {
        notification["warning"]({
          message: 'Warning',
          description: 
          'Server Error',
        });
      })
    }
    if ( tableRefresh ) {
      getProductList();
      dispatch(setRefresh(false));
      }
    }, [ filter, tableRefresh ]);
    
  const onShowSizeChange = (current, pageSize) => {
    setState({ ...state, current, pageSize });
  };

  const showEditModal = (product) => {
    showModal(product._id)
  }

  const onHandleChange = (current, pageSize) => {
    // You can create pagination in here
    const filter = {
      start: (current - 1) * pageSize,
      length: pageSize,
      keyword: '',
      sort: 'price',
      sortDir: 'descend'
    };
    dispatch(setFilter(filter));
    dispatch(setRefresh(true));
  };

  return (
    <Row gutter={30}>
      {isLoader ? (
        <Col xs={24}>
          <div className="spin">
            <Spin />
          </div>
        </Col>
      ) : products.list.length ? (
        products.list.map(({ _id, name, price, imageFile }, index) => {
          return (
            <Col xxl={6} lg={8} md={12} xs={24} key={index}>
              <ProductCards product={{ _id, name, price, imageFile }} showEditModal={showEditModal} />
            </Col>
          );
        // console.log(imageFile)
        })
      ) : (
        <Col md={24}>
          <NotFoundWrapper>
            <Heading as="h1">Data Not Found</Heading>
          </NotFoundWrapper>
        </Col>
      )}
      <Col xs={24} className="pb-30">
        <PaginationWrapper style={{ marginTop: 10 }}>
          {products.list.length ? (
            <Pagination
              onChange={onHandleChange}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              pageSize={filter.length}
              defaultCurrent={1}
              total={products.totalCount}
            />
          ) : null}
        </PaginationWrapper>
      </Col>
    </Row>
  );
};

export default Grid;
import React, { lazy, useState, Suspense } from 'react';
import { Row, Col, Spin } from 'antd';
import { Switch, NavLink, Route, useRouteMatch } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { PageHeader } from '../../../components/page-headers/page-headers';
import { AutoComplete } from '../../../components/autoComplete/autoComplete';
import { Button } from '../../../components/buttons/buttons';
import { Main, CardToolbox } from '../../styled';
import { TopToolBox } from '../style';
import ProductForm from './productForm';
import { ExportButtonPageHeader } from './ExportButton';

const Grid = lazy(() => import('./overview/grid'));

const Product = () => {
  const { path } = useRouteMatch();

  const [state, setState] = useState({
    visible: false,
    selectedProduct: "",
  });
  const { visible, selectedProduct } = state;

  const handleSearch = () => {
    console.log("ok")
  }

  const showModal = selectedProduct => {
    setState({
      ...state,
      visible: true,
      selectedProduct: selectedProduct
    });
  };

  const onCancel = () => {
    setState({
      ...state,
      visible: false,
    });
  };

  return (
    <>
      <CardToolbox>
        <PageHeader
          title="Product Category"
          buttons={[
            <div key="6" className="page-header-actions">
              <ExportButtonPageHeader key="2" />
              <Button className="btn-add_new" size="default" type="primary" key="1" onClick={() => showModal("")}>
                + Add New Product
              </Button>
            </div>
          ]}
        />
      </CardToolbox>
      <Main>
        <ProductForm onCancel={onCancel} visible={visible} selectedProduct={selectedProduct}/>
        <Row gutter={30}>
          <Col className="product-content-col" xs={24}>
            <TopToolBox>
              <Row gutter={0}>
                <Col xs={24}>
                  <div className="product-list-action d-flex justify-content-between align-items-center">
                    <div>
                      <AutoComplete
                        onSearch={handleSearch}
                        placeholder="Search by Name"
                        width="100%"
                        patterns
                      />
                    </div>
                    {(window.innerWidth <= 991 && window.innerWidth >= 768) ||
                      (window.innerWidth > 575 && (
                        <div className="product-list-action__viewmode">
                          <NavLink to={`${path}/grid`}>
                            <FeatherIcon icon="grid" size={16} />
                          </NavLink>
                          <NavLink to={`${path}/list`}>
                            <FeatherIcon icon="list" size={16} />
                          </NavLink>
                        </div>
                      ))}
                  </div>
                </Col>
              </Row>
            </TopToolBox>
          </Col>
        </Row>
        <Switch>
          <Suspense
            fallback={
              <div className="spin d-flex align-center-v">
                <Spin />
              </div>
            }
          >
            <Route exact path={path} render = {(props) => <Grid showModal = {showModal} { ...props } /> }/>
            <Route exact path={`${path}/grid`} render = {(props) => <Grid showModal = {showModal} { ...props } /> }/>
            {/* <Route exact path={`${path}/list`} component={List} /> */}
          </Suspense>
        </Switch>
      </Main>
    </>
  );
};

export default Product;

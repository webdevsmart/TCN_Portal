import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import ProductCategory from './productCategory';
import Product from './product';

const Stock = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
      >
        <Route path={`${path}`} component={ProductCategory} />
        <Route path={`${path}/category`} component={ProductCategory} />
        <Route path={`${path}/product`} component={Product} />
      </Suspense>
    </Switch>
  );
};

export default Stock;

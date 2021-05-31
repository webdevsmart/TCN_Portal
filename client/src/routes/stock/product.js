import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const Product = lazy(() => import('../../container/stock/product'));

const ProductRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Product} />
    </Switch>
  );
};

export default ProductRoutes;

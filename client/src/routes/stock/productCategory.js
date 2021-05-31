import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const Category = lazy(() => import('../../container/stock/productCategory'));

const CategoryRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Category} />
    </Switch>
  );
};

export default CategoryRoutes;

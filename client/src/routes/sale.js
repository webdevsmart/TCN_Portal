import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const TotalSale = lazy(() => import('../container/sale/total'));
const CardSale = lazy(() => import('../container/sale/card'));
const CashSale = lazy(() => import('../container/sale/cash'));

const SaleRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/total`} component={TotalSale} />
      <Route exact path={`${path}/card`} component={CardSale} />
      <Route exact path={`${path}/cash`} component={CashSale} />
    </Switch>
  );
};

export default SaleRoutes;

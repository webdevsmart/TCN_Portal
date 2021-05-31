import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const Cabinet = lazy(() => import('../../container/machine/cabinet'));

const CabinetRoute = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Cabinet} />
    </Switch>
  );
};

export default CabinetRoute;

import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const Machine = lazy(() => import('../../container/machine/machines'));

const MachineRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Machine} />
    </Switch>
  );
};

export default MachineRoutes;

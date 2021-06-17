import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const Machine = lazy(() => import('../../container/machine/machines'));
const MachineDetail = lazy(() => import('../../container/machine/detail'));

const MachineRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={Machine} />
      <Route exact path={`${path}/detail/:id`} component={MachineDetail}/>
    </Switch>
  );
};

export default MachineRoutes;

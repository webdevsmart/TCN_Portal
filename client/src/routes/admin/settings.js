import React, { lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from 'react-router-dom/cjs/react-router-dom.min';

const LogMng = lazy(() => import('../../container/settings/logMng'));

const SettingsRoutes = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={LogMng} />
      <Route path={`${path}/logMng`} component={LogMng} />
    </Switch>
  );
};

export default SettingsRoutes;

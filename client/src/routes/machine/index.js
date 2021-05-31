import React, { Suspense } from 'react';
import { Spin } from 'antd';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Machine from './machine';
import Cabinet from './cabinet';

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
        <Route path={`${path}`} component={Machine} />
        <Route path={`${path}/cabinet/:id`} component={Cabinet} />
      </Suspense>
    </Switch>
  );
};

export default Stock;

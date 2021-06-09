import React, { Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Spin } from 'antd';
import withAdminLayout from '../../layout/withAdminLayout';
import Dashboard from '../../routes/dashboard';
import Admin from '../../routes/admin';
import Stock from '../../routes/stock';
import Machine from '../../routes/machine';

const ProtectedRoute = () => {
  const isLoggedIn = useSelector(state => state.auth.login);
  return isLoggedIn ? 
        (<Switch>
        <Suspense
        fallback={
          <div className="spin">
            <Spin />
          </div>
        }
        >
        <Route path={`/`} component={Dashboard} />
        <Route path={`/admin`} component={Admin} />
        <Route path={`/stock`} component={Stock} />
        <Route path={`/machine`} component={Machine} />
      </Suspense>
      {/* <Redirect to="/admin" /> */}
      </Switch>)
      : (<Redirect to="/" />);
};

// ProtectedRoute.propTypes = {
//   component: propTypes.object.isRequired,
//   path: propTypes.string.isRequired,
// };

export default withAdminLayout(ProtectedRoute);

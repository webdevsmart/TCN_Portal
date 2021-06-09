import { combineReducers } from 'redux';
import authReducer from './authentication/reducers';
import ChangeLayoutMode from './themeLayout/reducers';
import { userReducer } from './users/reducers';
import { productReducer } from './product/reducers';
import chartContentReducer from './chartContent/reducers';
import { filterDashboard } from './filter/reducers';

const rootReducers = combineReducers({
  users: userReducer,
  auth: authReducer,
  ChangeLayoutMode,
  products: productReducer,
  chartContent: chartContentReducer,
  filterDashboard: filterDashboard
});

export default rootReducers;

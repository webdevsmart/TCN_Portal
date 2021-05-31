import actions from './actions';

const { setFilterBegin, setFilterSuccess, setFilterErr, setRefreshBegin, setRefreshSuccess, setRefreshErr } = actions;

const setFilter = (filter = {}) => {
  return async dispatch => {
    try {
      dispatch(setFilterBegin());
      dispatch(setFilterSuccess(filter));
    } catch (err) {
      dispatch(setFilterErr(err));
    }
  };
}

const setRefresh = (refresh) => {
  return async dispatch => {
    try {
      dispatch(setRefreshBegin());
      dispatch(setRefreshSuccess(refresh));
    } catch (err) {
      dispatch(setRefreshErr(err));
    }
  };
}

export { setFilter, setRefresh };


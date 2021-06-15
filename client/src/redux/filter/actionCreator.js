import actions from './actions';

const { dashboardFilterBegin, dashboardFilterSuccess, dashboardFilterErr  } = actions;

const setDashBoardFilter = (values) =>{
  return async dispatch => {
    try {
      dispatch(dashboardFilterBegin());
      dispatch(dashboardFilterSuccess(values, true))
    } catch (err) {
      dispatch(dashboardFilterErr())
    }
  }
}

export { setDashBoardFilter };

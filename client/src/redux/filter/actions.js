const actions = {
  DASHBOARD_FILTER_BEGIN: 'DASHBOARD_FILTER_BEGIN',
  DASHBOARD_FILTER_SUCCESS: 'DASHBOARD_FILTER_SUCCESS',
  DASHBOARD_FILTER_ERR: 'DASHBOARD_FILTER_ERR',

  dashboardFilterBegin: () => {
    return {
      type: actions.DASHBOARD_FILTER_BEGIN,
    };
  },

  dashboardFilterSuccess: data => {
    return {
      type: actions.DASHBOARD_FILTER_SUCCESS,
      data,
    };
  },

  dashboardFilterErr: err => {
    return {
      type: actions.DASHBOARD_FILTER_ERR,
      err,
    };
  },
}

export default actions;
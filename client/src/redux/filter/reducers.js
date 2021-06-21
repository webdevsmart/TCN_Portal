import actions from './actions';
import moment from 'moment';

const initialDashboard = {
  data: {
    companyID: [],
    siteID: [],
    productID: ["all"],
    paymentType: "all",
    date: [
      moment().startOf('month'),
      moment().endOf('month')
    ],
  },
  dashFLoading: false,
};

const {
    DASHBOARD_FILTER_BEGIN,
    DASHBOARD_FILTER_SUCCESS,
    DASHBOARD_FILTER_ERR
} = actions

const filterDashboard = (state = initialDashboard, action) => {
  const { type, data, err } = action;
  switch (type) {
    case DASHBOARD_FILTER_BEGIN:
    return {
      ...state,
      dashFLoading: true,
    };
    case DASHBOARD_FILTER_SUCCESS:
    return {
        ...state,
        data: data,
        dashFLoading: false,
    };
    case DASHBOARD_FILTER_ERR:
    return {
        ...state,
        error: err,
        dashFLoading: false,
    };
    default:
    return state;
  }
}

export { filterDashboard };
import actions from './actions';
const { SET_FILTER_BEGIN, SET_FILTER_SUCCESS, SET_FILTER_ERR, SET_REFRESH_BEGIN, SET_REFRESH_SUCCESS,SET_REFRESH_ERR } = actions;

const initialStateFilter = {
  data: {
    start: 0,
    length: 10,
    keyword: '',
    sort: 'price',
    sortDir: 'descend'
  },
  tableRefresh: false,
  loading: false,
  error: null,
};


const productReducer = (state = initialStateFilter, action) => {
  const { type, data, err } = action;
  switch (type) {
    case SET_FILTER_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case SET_FILTER_SUCCESS:
      return {
        ...state,
        data: data,
        loading: false,
      };
    case SET_FILTER_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case SET_REFRESH_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case SET_REFRESH_SUCCESS:
      return {
        ...state,
        tableRefresh: data,
        loading: false,
      };
    case SET_REFRESH_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    default:
      return state;
  }
};


export { productReducer };

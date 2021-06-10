import actions from './actions';

const initialState = {
  perLoading: false,
  dvLoading: false,
  reLoading: false,
  generatedData: null,
  geLoading: false,
  error: null,
};

const {
  UPDATE_LOADING_BEGIN,
  UPDATE_LOADING_SUCCESS,
  UPDATE_LOADING_ERR,
} = actions;

const chartContentReducer = (state = initialState, action) => {
  const { type, data, err } = action;
  switch (type) {

    case UPDATE_LOADING_BEGIN:
      return {
        ...state,
        perLoading: true,
      };
    case UPDATE_LOADING_SUCCESS:
      return {
        ...state,
        perLoading: false,
      };
    case UPDATE_LOADING_ERR:
      return {
        ...state,
        error: err,
        perLoading: false,
      };
    default:
      return state;
  }
};

export default chartContentReducer;

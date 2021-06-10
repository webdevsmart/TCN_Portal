const actions = {
  UPDATE_LOADING_BEGIN: 'UPDATE_LOADING_BEGIN',
  UPDATE_LOADING_SUCCESS: 'UPDATE_LOADING_SUCCESS',
  UPDATE_LOADING_ERR: 'UPDATE_LOADING_ERR',


  updateLoadingBegin: () => {
    return {
      type: actions.UPDATE_LOADING_BEGIN,
    };
  },

  updateLoadingSuccess: data => {
    return {
      type: actions.UPDATE_LOADING_SUCCESS,
      data,
    };
  },

  updateLoadingErr: err => {
    return {
      type: actions.UPDATE_LOADING_ERR,
      err,
    };
  },
};

export default actions;

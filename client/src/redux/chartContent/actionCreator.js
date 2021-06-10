import actions from './actions';
const {
  updateLoadingBegin,
  updateLoadingSuccess,
  updateLoadingErr,
} = actions;

const setIsLoading = () => {
  return async dispatch => {
    try {
      dispatch(updateLoadingBegin());
      setTimeout(() => {
        dispatch(updateLoadingSuccess());
      }, 100);
    } catch (err) {
      dispatch(updateLoadingErr(err));
    }
  };
};

export {
  setIsLoading,
};

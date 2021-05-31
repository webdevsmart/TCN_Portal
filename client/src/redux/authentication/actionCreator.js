import axios from 'axios';
import { notification } from 'antd';
import actions from './actions';

const { loginBegin, loginSuccess, loginErr, logoutBegin, logoutSuccess, logoutErr } = actions;

const login = (values) => {
  return async dispatch => {
    try {
      dispatch(loginBegin());
      const url = "/api/auth/signin";
      axios.post(url, { values })
      .then(res => {
        if (res.data.status === "success") {
          localStorage.setItem("isSigned", true);
          localStorage.setItem("jwt", res.data.token);
          localStorage.setItem("signedUser", JSON.stringify(res.data.user));
          notification["success"]({
            message: 'Success',
            description:
              "Welcome Signin!",
          });

          return dispatch(loginSuccess(true, res.data.user, res.data.token));
        } else {
          notification["warning"]({
            message: 'Warning',
            description: 
            res.data.message,
          });
          dispatch(loginErr(res.data.message));
        }
      })
      .catch(err => {
        console.log(err)
      });
    } catch (err) {
      dispatch(loginErr(err));
    }
  };
};

const logOut = () => {
  return async dispatch => {
    try {
      dispatch(logoutBegin());
      localStorage.removeItem("isSigned");
      localStorage.removeItem("jwt");
      localStorage.removeItem("signedUser");
      dispatch(logoutSuccess(null));
    } catch (err) {
      dispatch(logoutErr(err));
    }
  };
};

export { login, logOut };

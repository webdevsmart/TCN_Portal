const actions = {
    SET_FILTER_BEGIN: 'SET_FILTER_BEGIN',
    SET_FILTER_SUCCESS: 'SET_FILTER_SUCCESS',
    SET_FILTER_ERR: 'SET_FILTER_ERR',

    SET_REFRESH_BEGIN: 'SET_REFRESH_BEGIN',
    SET_REFRESH_SUCCESS: 'SET_REFRESH_SUCCESS',
    SET_REFRESH_ERR: 'SET_REFRESH_ERR',

    setFilterBegin: () => {
        return {
            type: actions.SET_FILTER_BEGIN,
        };
    },

    setFilterSuccess: (filter = {}) => {
        return {
            type: actions.SET_FILTER_SUCCESS,
            data: filter
        };
    },

    setFilterErr: (err) => {
        return {
            type: actions.SET_FILTER_ERR,
            data: err
        };
    },

    setRefreshBegin: () => {
        return {
            type: actions.SET_REFRESH_BEGIN,
        };
    },

    setRefreshSuccess: (Refresh = false) => {
        return {
            type: actions.SET_REFRESH_SUCCESS,
            data: Refresh
        };
    },

    setRefreshErr: (err) => {
        return {
            type: actions.SET_REFRESH_ERR,
            data: err
        };
    }
};

export default actions;

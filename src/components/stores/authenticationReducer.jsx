import { get, post } from '../Http';

const initialState = {
  loginInfo: {
    email: '',
    password: '',
  },
  currentUser: null,
  message: '',
  redirectToPreviousPage: false,
  redirectToHome: false,
  loading: false,
};

export const LOGIN_ACTION = 'login';
const LOGIN_SUCCESSFUL = 'loginSuccessful';
const LOGIN_FAIL = 'loginFail';
const UPDATE_LOGIN_INFO = 'updateLoginInfo';
export const LOGOUT_ACTION = 'logout';
const LOGOUT_SUCCESSFUL = 'logoutSuccessful';
const LOGOUT_FAIL = 'logoutFail';
const GET_CURRENT_USER = 'getCurrentUser';

export function authenticationReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ACTION: {
      return {
        ...state,
        loginInfo: {
          email: '',
          password: '',
        },
        isLoading: true,
      };
    }
    case LOGIN_SUCCESSFUL: {
      return {
        currentUser: action.currentUser,
        isLoading: true,
        redirectToPreviousPage: true,
      };
    }
    case LOGIN_FAIL: {
      return {
        isLoading: false,
        loginInfo: {
          email: '',
          password: '',
        },
      };
    }
    case UPDATE_LOGIN_INFO: {
      return {
        loginInfo: action.loginInfo,
      };
    }
    case LOGOUT_ACTION: {
      return {
        isLoading: true,
      };
    }
    case LOGOUT_SUCCESSFUL: {
      return {
        currentUser: null,
        redirectToHome: true,
        isLoading: true,
        redirectToPreviousPage: true,
      };
    }
    case LOGOUT_FAIL: {
      return {
        isLoading: false,
        message: action.message,
      };
    }
    case GET_CURRENT_USER: {
      return {
        currentUser: action.currentUser,
      };
    }
    default:
      return state;
  }
}

export const authenticationActions = {
  login(loginInfo) {
    return async (dispatch) => {
      dispatch({
        type: LOGIN_ACTION,
      });

      let currentUser;

      try {
        if (!loginInfo.email || !loginInfo.password) {
          return;
        }
        await post('/api/users/login', loginInfo);
        currentUser = await get('/api/users/currentUser');
        dispatch({
          type: LOGIN_SUCCESSFUL,
          currentUser,
          message: 'Login successful',
        });
      } catch (error) {
        dispatch({
          type: LOGIN_FAIL,
          message: 'Login fail',
        });
      }
    };
  },
  updateLoginInfo(loginInfo) {
    return {
      type: UPDATE_LOGIN_INFO,
      loginInfo,
    };
  },

  logout() {
    return async (dispatch) => {
      try {
        dispatch({
          type: LOGOUT_ACTION,
        });
        await post('/api/users/logout');
        dispatch({
          type: LOGOUT_SUCCESSFUL,
        });
      } catch (e) {
        dispatch({
          type: LOGIN_FAIL,
          message: 'Error occurs!',
        });
      }
    };
  },

  getCurrentUser() {
    return async (dispatch) => {
      const currentUser = await get('/api/users/currentUser');
      dispatch({
        type: GET_CURRENT_USER,
        currentUser,
      });
    };
  },
};


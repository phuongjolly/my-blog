import { post } from '../Http';

const initialState = {
  registerInfo: {
    name: '',
    email: '',
    password: '',
  },
  message: '',
  redirectToLogin: false,
  isLoading: false,
};

const REGISTER = 'register';
const REGISTER_SUCCESSFUL = 'registerSuccessful';
const REGISTER_FAIL = 'registerFail';
const UPDATE_REGISTER_INFO = 'updateRegisterInfo';
const RESET_REGISTER_INFO = 'resetRegisterInfo';

export function registerReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER: {
      return {
        ...state,
        isLoading: true,
        message: '',
        redirectToLogin: false,
      };
    }
    case REGISTER_SUCCESSFUL: {
      return {
        ...state,
        message: action.message,
        redirectToLogin: true,
        isLoading: true,
      };
    }
    case REGISTER_FAIL: {
      return {
        ...state,
        registerInfo: {
          name: '',
          email: '',
          password: '',
        },
        isLoading: false,
        message: action.message,
        redirectToLogin: false,
      };
    }
    case UPDATE_REGISTER_INFO: {
      return {
        ...state,
        registerInfo: action.registerInfo,
      };
    }
    case RESET_REGISTER_INFO: {
      return {
        ...state,
        registerInfo: action.registerInfo,
      };
    }
    default: return state;
  }
}

export const registerActions = {
  register() {
    return async (dispatch, getState) => {
      dispatch({
        type: REGISTER,
      });

      const { registerInfo } = getState().register;
      console.log(registerInfo);
      try {
        await post('/api/users/register', registerInfo);


        dispatch({
          type: REGISTER_SUCCESSFUL,
          message: 'Register successful',
        });
      } catch (e) {
        dispatch({
          type: REGISTER_FAIL,
          message: 'Register failed',
        });
      }
    };
  },

  updateRegisterInfo(registerInfo) {
    return {
      type: UPDATE_REGISTER_INFO,
      registerInfo,
    };
  },

  resetRegisterInfo() {
    return {
      type: RESET_REGISTER_INFO,
    };
  },
};

const initialState = {
  isActiveDialog: false,
  message: '',
};

const OPEN = 'openDialog';
const CLOSE = 'closeDialog';

export function dialogReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN: {
      return {
        ...state,
        isActiveDialog: true,
        message: action.message,
      };
    }
    case CLOSE: {
      return {
        ...state,
        isActiveDialog: false,
      };
    }

    default: return state;
  }
}

export const dialogActions = {
  openDialog(message) {
    return dispatch => dispatch({
      type: OPEN,
      message,
    });
  },

  closeDialog() {
    return dispatch => dispatch({
      type: CLOSE,
    });
  },
};

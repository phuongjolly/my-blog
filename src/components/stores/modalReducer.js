const initialState = {
  isActiveModalQuestion: false,
  message: '',
};

const OPEN = 'openModalQuestion';
const CLOSE = 'closeModalQuestion';

export function modalReducer(state = initialState, action) {
  switch (action.type) {
    case OPEN: {
      return {
        isActiveModalQuestion: true,
      };
    }
    case CLOSE: {
      return {
        isActiveModalQuestion: false,
      };
    }
    default: return state;
  }
}

export const modalActions = {
  openModal(message) {
    return (dispatch) => {
      dispatch({
        type: OPEN,
        message,
      });
    };
  },

  closeModal() {
    return (dispatch) => {
      dispatch({
        type: CLOSE,
      });
    };
  },
};

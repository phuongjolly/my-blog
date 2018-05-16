const initialState = {
    openModalDialog: false,
    message: ''
}

const OPEN = "open";
const CLOSE = "close";

export function modalReducer(state = initialState, action) {
    switch (action.type) {
        case OPEN: {
            return {
                openModalDialog: true
            }
        }
        case CLOSE: {
            return {
                openModalDialog: false
            }
        }
        default: return state;
    }
}

export function open(message) {
    return {
        type: OPEN,
        message
    }
}

export function close() {
    return {
        type: CLOSE
    }
}

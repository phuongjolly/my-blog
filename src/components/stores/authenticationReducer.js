const initialState = {
    currentUser: null,
};

export const LOGIN_ACTION = "login";
export const LOGOUT_ACTION = "logout";

export function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_ACTION: {
            return {
                currentUser: action.currentUser
            }
        }
        case LOGOUT_ACTION: {
            return {currentUser: null};
        }
        default:
            return state;
    }
}

// action creator
export function login(currentUser) {
    return {
        type: LOGIN_ACTION,
        currentUser
    }
}

export function logout() {
    return {
        type: LOGOUT_ACTION
    }
}


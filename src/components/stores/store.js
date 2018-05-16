import {applyMiddleware, combineReducers, createStore} from "redux";
import {authenticationReducer} from "./authenticationReducer";
import logger from "redux-logger";
import {modalReducer} from "./modalReducer";

const reducers = {
    authentication: authenticationReducer,
    showModalDialog: modalReducer
};

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(logger)
);
export default store;
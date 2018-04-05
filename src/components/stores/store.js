import {applyMiddleware, combineReducers, createStore} from "redux";
import {authenticationReducer} from "./authenticationReducer";
import logger from "redux-logger";

const reducers = {
    authentication: authenticationReducer
};

const store = createStore(
    combineReducers(reducers),
    applyMiddleware(logger)
);
export default store;
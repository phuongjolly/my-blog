import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { logger } from 'redux-logger';
import { authenticationReducer } from './authenticationReducer';
import { modalReducer } from './modalReducer';
import { postListReducer } from './postListReducer';
import { postReducer } from './postReducer';
import { dialogReducer } from './dialogReducer';
import { postEditorReducer } from './postEditorReducer';
import {registerReducer} from "./registerReducer";


const reducers = {
  authentication: authenticationReducer,
  questionModal: modalReducer,
  postList: postListReducer,
  singlePost: postReducer,
  dialogModal: dialogReducer,
  postEditor: postEditorReducer,
  register: registerReducer,
};

const store = createStore(
  combineReducers(reducers),
  applyMiddleware(thunk, logger),
);
export default store;

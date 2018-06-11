/* global fetch:false */

import { stateToHTML } from 'draft-js-export-html';
import { convertFromRaw } from 'draft-js';
import { ALIGNMENT_DATA_KEY } from '../plugins/ExtendedRichUtils';
import { get, post } from '../Http';

const initialState = {
  post: null,
  comments: [],
  isLoading: false,
  message: '',
  redirectToHome: false,
  redirectToRegister: false,
  goToPageNumber: 0,
  isShowInfoDialog: false,
};

const LOAD_POST = 'loadPost';
const LOAD_POST_SUCCESSFUL = 'loadPostSuccessful';
const LOAD_POST_FAIL = 'loadPostFail';
const DELETE_POST = 'deletePost';
const DELETE_POST_SUCCESSFUL = 'deletePostSuccessful';
const DELETE_POST_FAIL = 'deletePostFail';
const ADD_COMMENT = 'replyComment';
const ADD_COMMENT_SUCCESSFUL = 'replyCommentSuccessful';
const ADD_COMMENT_FAIL = 'replyCommentFail';

export function postReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_POST: {
      return {
        ...state,
        post: null,
        isLoading: true,
        redirectToHome: false,
        redirectToRegister: false,
        goToPageNumber: 0,
        contentToReply: '',
        comments: [],
        inputContent: '',
        isShowInfoDialog: false,
      };
    }
    case LOAD_POST_SUCCESSFUL: {
      return {
        ...state,
        post: action.data,
        isLoading: false,
        comments: action.comments,
        message: 'Load post successful',
        isShowInfoDialog: true,
      };
    }
    case LOAD_POST_FAIL: {
      return {
        ...state,
        isLoading: false,
        message: 'Load post failed',
      };
    }
    case DELETE_POST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case DELETE_POST_SUCCESSFUL: {
      return {
        ...state,
        redirectToHome: true,
        message: action.message,
      };
    }
    case DELETE_POST_FAIL: {
      return {
        ...state,
        redirectToHome: true,
        message: action.message,
      };
    }
    case ADD_COMMENT: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ADD_COMMENT_SUCCESSFUL: {
      return {
        ...state,
        isLoading: false,
        comments: [...state.comments, action.data],
      };
    }
    case ADD_COMMENT_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }
    default: return state;
  }
}

export const postActions = {
  loadPost(id) {
    return async (dispatch) => {
      dispatch({
        type: LOAD_POST,
      });

      try {
        const data = await get(`/api/posts/${id}`);

        if (data == null) {
          console.log('load failed');
          dispatch({
            type: LOAD_POST_FAIL,
          });
        } else {
          console.log(data);
          const options = {
            inlineStyles: {
              BOLD: { element: 'b' },
              ITALIC: {
                element: 'i',
              },
              UNDERLINE: {
                element: 'u',
              },
            },
            blockStyleFn: (block) => {
              const textAlignStyle = block.getData().get(ALIGNMENT_DATA_KEY);
              switch (textAlignStyle) {
                case 'RIGHT':
                  return {
                    element: 'div',
                    attributes: { class: 'align-right' },
                  };

                case 'CENTER':
                  return {
                    element: 'div',
                    attributes: { class: 'align-center' },
                  };
                case 'LEFT':
                  return {
                    element: 'div',
                    attributes: { class: 'align-left' },
                  };
                case 'JUSTIFY':
                  return {
                    element: 'div',
                    attributes: { class: 'align-justify' },
                  };
                default:
                  return '';
              }
            },
            defaultBlockTag: 'p',
          };
          const content = stateToHTML(convertFromRaw(JSON.parse(data.content)), options);

          // get comments
          const comments = await get(`/api/posts/${id}/comments`);
          console.log(comments);

          dispatch({
            type: LOAD_POST_SUCCESSFUL,
            data: { ...data, content },
            comments,
          });
        }
      } catch (e) {
        dispatch({
          type: LOAD_POST_FAIL,
        });
      }
    };
  },

  deletePost(id) {
    return async (dispatch) => {
      dispatch({
        type: DELETE_POST,
      });

      try {
        await fetch(`/api/posts/${id}/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        dispatch({
          type: DELETE_POST_SUCCESSFUL,
          message: 'Delete done!',
        });
      } catch (e) {
        dispatch({
          type: DELETE_POST_FAIL,
          message: 'Delete failed!',
        });
      }
    };
  },

  addComment(id, content) {
    return async (dispatch) => {
      dispatch({
        type: ADD_COMMENT,
      });
      try {
        const newComment = await post(`/api/posts/${id}/addNewComment`, { content });
        dispatch({
          type: ADD_COMMENT_SUCCESSFUL,
          data: newComment,
          message: 'Add comment successful',
        });
      } catch (e) {
        dispatch({
          type: ADD_COMMENT_FAIL,
          message: '',
        });
      }
    };
  },

};

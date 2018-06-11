import { get } from '../Http';

const initialState = {
  posts: [],
  isLoading: false,
  message: '',
};


const LOAD_POSTS_BY_TAG = 'loadPostByTag';
const LOAD_POSTS_BY_TAG_SUCCESSFUL = 'loadPostByTagSuccessful';
const LOAD_POSTS_BY_TAG_FAIL = 'loadPostByTagFail';

export function postTagsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_POSTS_BY_TAG: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case LOAD_POSTS_BY_TAG_SUCCESSFUL: {
      return {
        ...state,
        posts: action.data,
        isLoading: false,
      };
    }
    case LOAD_POSTS_BY_TAG_FAIL: {
      return {
        ...state,
        isLoading: false,
        message: action.message,
      };
    }
    default: return state;
  }
}

export const postTagsActions = {
  loadPostsByTag(name) {
    return async (dispatch) => {
      dispatch({
        type: LOAD_POSTS_BY_TAG,
      });

      try {
        const posts = await get(`/api/posts/tags/${name}`);
        dispatch({
          type: LOAD_POSTS_BY_TAG_SUCCESSFUL,
          data: posts,
        });
      } catch (e) {
        dispatch({
          type: LOAD_POSTS_BY_TAG_FAIL,
          message: 'Error occurs!',
        });
      }
    };
  },
};

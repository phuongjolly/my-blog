import { get } from '../Http';

const initState = {
  posts: [],
  isLoading: false,
  page: 1,
  totalItems: 0,
  currentUser: null,
};

const LOAD_POSTS = 'loadPosts';
const LOAD_POSTS_SUCCESSFUL = 'loadPosts_Successful';
const LOAD_POSTS_FAIL = 'loadPosts_Fail';

export function postListReducer(state = initState, action) {
  switch (action.type) {
    case LOAD_POSTS: {
      return {
        ...state,
        isLoading: true,
        page: action.page,
      };
    }
    case LOAD_POSTS_SUCCESSFUL: {
      return {
        ...state,
        posts: action.data,
        page: action.page,
        totalItems: action.totalItems,
        isLoading: false,
        currentUser: action.currentUser,
      };
    }
    case LOAD_POSTS_FAIL: {
      return {
        ...state,
        isLoading: false,
        message: 'Load posts failed!!!',
      };
    }
    default: return state;
  }
}

export const actions = {
  loadPosts(name = '') {
    return async (dispatch) => {
      dispatch({
        type: LOAD_POSTS,
        page: 1,
      });

      try {
        let posts;
        if (name === '') {
          posts = await get('/api/posts/');
          console.log('=======');
          console.log(posts);
        } else {
          posts = await get(`/api/posts/tags/${name}`);
        }

        let currentUser;
        try {
          currentUser = await get('/api/users/currentUser');
        } catch (e) {
          console.log('get currentUser is failed');
        }

        dispatch({
          type: LOAD_POSTS_SUCCESSFUL,
          data: posts,
          page: 1,
          totalItems: posts.length,
          currentUser,
        });
      } catch (e) {
        dispatch({
          type: LOAD_POSTS_FAIL,
        });
      }
    };
  },
};

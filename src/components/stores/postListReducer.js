import { get } from '../Http';

const initState = {
  posts: [],
  isLoading: false,
  page: 0,
  limitItem: 3,
  totalItems: 0,
  currentUser: null,
};

const LOAD_POSTS = 'loadPosts';
const LOAD_POSTS_SUCCESSFUL = 'loadPosts_Successful';
const LOAD_POSTS_FAIL = 'loadPosts_Fail';
const GET_TOTAL_ITEMS = 'getTotalItems';

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
        posts: state.posts.length > 0 ? state.posts.concat(action.data) : action.data,
        page: action.page,
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
    case GET_TOTAL_ITEMS: {
      return {
        ...state,
        totalItems: action.totalItems,
      };
    }
    default: return state;
  }
}

export const postListActions = {
  loadPosts(page = 0, size = 3) {
    console.log('call loadPosts');
    return async (dispatch) => {
      dispatch({
        type: LOAD_POSTS,
      });

      try {
        const posts = await get(`/api/posts/page?page=${page}&size=${size}`);
        let currentUser;
        try {
          currentUser = await get('/api/users/currentUser');
        } catch (e) {
          console.log('get currentUser is failed');
        }
        dispatch({
          type: LOAD_POSTS_SUCCESSFUL,
          data: posts,
          page,
          currentUser,
        });
      } catch (e) {
        dispatch({
          type: LOAD_POSTS_FAIL,
        });
      }
    };
  },

  getPostCount() {
    return async (dispatch) => {
      const totalItems = await get('/api/posts/totalItems');
      dispatch({
        type: GET_TOTAL_ITEMS,
        totalItems,
      });
    };
  },
};

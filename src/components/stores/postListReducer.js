import { get } from '../Http';

const initState = {
  posts: [],
  isLoading: false,
  page: 0,
  limitItem: 6,
  totalItems: 0,
  currentUser: null,
  needToLoad: false,
};

const LOAD_POSTS = 'loadPosts';
const LOAD_POSTS_SUCCESSFUL = 'loadPosts_Successful';
const LOAD_POSTS_FAIL = 'loadPosts_Fail';
const GET_TOTAL_ITEMS = 'getTotalItems';
const UPDATE_POSTS = 'updatePostList';
const UPDATE_NEED_TO_LOAD = 'updateNeedToLoad';

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
        needToLoad: false,
      };
    }
    case LOAD_POSTS_FAIL: {
      return {
        ...state,
        isLoading: false,
        message: 'Load posts failed!!!',
        needToLoad: false,
      };
    }
    case GET_TOTAL_ITEMS: {
      return {
        ...state,
        totalItems: action.totalItems,
      };
    }
    case UPDATE_POSTS: {
      return {
        ...state,
        posts: action.posts,
      };
    }
    case UPDATE_NEED_TO_LOAD: {
      return {
        ...state,
        needToLoad: action.needToLoad,
      };
    }
    default: return state;
  }
}

export const postListActions = {
  loadPosts(page = 0, size = 6) {
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

  updatePosts(posts) {
    console.log('post has just updated');
    console.log(posts);
    return {
      type: UPDATE_POSTS,
      posts,
    };
  },

  updateNeedToLoad(needToLoad) {
    return {
      type: UPDATE_NEED_TO_LOAD,
      needToLoad,
    };
  },
};

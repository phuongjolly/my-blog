import { AtomicBlockUtils, convertFromRaw, convertToRaw, EditorState, Entity, RichUtils } from 'draft-js';
import { get, post } from '../Http';
import ExtendedRichUtils from '../plugins/ExtendedRichUtils';

const initialState = {
  editorState: EditorState.createEmpty(),
  post: {
    title: '',
    description: '',
    content: '',
    avatarUrl: '',
    tags: [],
  },
  isSelectingMedia: false,
  urlType: '',
  message: undefined,
  redirectToPost: false,
  previousId: -1,
  isLoading: false,
  isShowInfoDialog: false,
};

const LOAD_POST = 'loadPostEditor';
const LOAD_POST_SUCCESSFUL = 'loadPostEditorSuccessful';
const LOAD_POST_FAIL = 'loadPostEditorFail';
const EDIT_POST_SUCCESSFUL = 'editPostSuccessful';
const EDIT_POST_FAIL = 'editPostFail';
const DISCARD_EDIT = 'discard_edit';
const DO_ALIGNMENT = 'doAlignment';
const TOGGLE_INLINE_STYLE = 'toggleInlineStyle';
const TOGGLE_BLOCK_TYPE = 'toggleBlockType';
const SELECT_IMAGE = 'selectImage';
const SELECT_LINK = 'selectLink';
const ADD_MEDIA = 'addMedia';
const ON_CHANGE_POST = 'onChangePost';
const ON_CHANGE_EDITOR = 'onChangeEditor';

export function postEditorReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_POST: {
      return {
        ...state,
        editorState: EditorState.createEmpty(),
        post: {
          title: '',
          description: '',
          content: '',
          avatarUrl: '',
          tags: [],
        },
        isSelectingMedia: false,
        urlType: '',
        message: undefined,
        redirectToPost: false,
        previousId: 0,
        isLoading: true,
        isShowInfoDialog: false,
      };
    }
    case LOAD_POST_SUCCESSFUL: {
      return {
        ...state,
        isLoading: false,
        post: action.data,
        editorState: action.editorState,
        isSelectingMedia: false,
        urlType: '',
        previousId: action.previousId,
      };
    }

    case LOAD_POST_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case EDIT_POST_SUCCESSFUL: {
      return {
        ...state,
        isLoading: true,
        post: action.data,
        message: action.message,
        isShowInfoDialog: action.isShowInfoDialog,
        redirectToPost: action.redirectToPost,
      };
    }
    case EDIT_POST_FAIL: {
      return {
        ...state,
        isLoading: false,
        redirectToPost: false,
      };
    }
    case DISCARD_EDIT: {
      return {
        ...state,
        editorState: action.editorState,
        post: {
          title: '',
          description: '',
          content: '',
          avatarUrl: '',
          tags: [],
        },
        isSelectingMedia: false,
        urlType: '',
        message: undefined,
        redirectToPost: true,
        previousId: -1,
        isLoading: false,
        isShowInfoDialog: false,
      };
    }
    case DO_ALIGNMENT: {
      return {
        ...state,
        editorState: action.newEditorState,
      };
    }
    case TOGGLE_INLINE_STYLE: {
      const { editorState } = state.postEditor;
      const newEditorState = RichUtils.toggleInlineStyle(editorState, action.style);
      return {
        ...state,
        editorState: newEditorState,
      };
    }
    case TOGGLE_BLOCK_TYPE: {
      return {
        ...state,
        editorState: action.newEditorState,
      };
    }
    case ADD_MEDIA: {
      return {
        ...state,
        editorState: action.editorState,
        isSelectingMedia: action.isSelectingMedia,
        urlType: action.urlType,
      };
    }
    case ON_CHANGE_POST: {
      return {
        ...state,
        post: action.data,
      };
    }
    case ON_CHANGE_EDITOR: {
      return {
        ...state,
        editorState: action.editorState,
      };
    }
    default: return state;
  }
}

export const postEditorActions = {
  loadPost(id, initialDecorator) {
    return async (dispatch) => {
      dispatch({
        type: LOAD_POST,
      });

      try {
        let data;
        let editorState;
        let newId = id;
        let previousId = -1;
        if (id >= 0) {
          data = await get(`/api/posts/${id}`);
          editorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(data.content)),
            initialDecorator,
          );
          previousId = id;
        } else {
          const latestId = await get('/api/posts/latest');
          newId = +(latestId + 1);
          editorState = EditorState.createEmpty(initialDecorator);
        }

        dispatch({
          type: LOAD_POST_SUCCESSFUL,
          data: { ...data, id: newId },
          editorState,
          previousId,
        });
      } catch (e) {
        dispatch({
          type: LOAD_POST_FAIL,
        });
      }
    };
  },

  savePost(newTag, avatarUrl) {
    return async (dispatch, getState) => {
      const { editorState } = getState().postEditor;
      const postObject = getState().postEditor.post;
      try {
        const tagsName = [];
        postObject.tags.map(tag => (
          tagsName.push(tag.name)
        ));
        let tag = null;
        if (newTag !== '' && !tagsName.includes(newTag)) {
          tag = { name: newTag };
        }
        console.log(postObject);

        await post('/api/posts', {
          ...postObject,
          content: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
          avatarUrl,
          tags: [...postObject.tags, tag],
        });

        dispatch({
          type: EDIT_POST_SUCCESSFUL,
          redirectToPost: true,
          message: 'Edit Successful',
          isShowInfoDialog: true,
        });
      } catch (e) {
        console.error(e);
        dispatch({
          type: EDIT_POST_FAIL,
        });
      }
    };
  },

  discardEdit(initialDecorator) {
    return dispatch => dispatch({
      type: DISCARD_EDIT,
      editorState: EditorState.createEmpty(initialDecorator),
    });
  },

  doAlignment(alignment) {
    return (dispatch, getState) => {
      const { editorState } = getState().postEditor;
      const newEditorState = ExtendedRichUtils.toggleAlignment(editorState, alignment);
      dispatch({
        type: DO_ALIGNMENT,
        newEditorState,
      });
    };
  },

  toggleInlineStyle(style) {
    return (dispatch) => {
      dispatch({
        type: TOGGLE_INLINE_STYLE,
        style,
      });
    };
  },

  toggleBlockType(type) {
    return (dispatch, getState) => {
      const { editorState } = getState().postEditor;
      const newEditorState = RichUtils.toggleBlockType(editorState, type);
      dispatch({
        type: TOGGLE_BLOCK_TYPE,
        newEditorState,
      });
    };
  },

  selectImage() {
    return {
      type: SELECT_IMAGE,
      isSelectingMedia: true,
      urlType: 'image',
    };
  },

  selectLink() {
    return (dispatch, getState) => {
      const { editorState } = getState().postEditor;
      const selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        dispatch({
          type: SELECT_LINK,
          isSelectingMedia: true,
          urlType: 'LINK',
        });
      }
    };
  },

  addMedia(url) {
    return (dispatch, getState) => {
      const { editorState, urlType } = getState().postEditor;
      let entityKey;
      let newEditorState;
      if (urlType === 'LINK') {
        entityKey = Entity.create(
          urlType,
          'MUTABLE',
          { url },
        );
        newEditorState = RichUtils.toggleLink(
          editorState,
          editorState.getSelection(),
          entityKey,
        );
      } else {
        entityKey = Entity.create(
          urlType,
          'IMMUTABLE',
          { src: url },
        );
        newEditorState = AtomicBlockUtils.insertAtomicBlock(
          editorState,
          entityKey,
          ' ',
        );
      }

      dispatch({
        type: ADD_MEDIA,
        editorState: newEditorState,
        isSelectingMedia: false,
        urlType: '',
      });
    };
  },

  onChangePost(postObject) {
    return {
      type: ON_CHANGE_POST,
      data: postObject,
    };
  },

  onChangeEditor(editorState) {
    return {
      type: ON_CHANGE_EDITOR,
      editorState,
    };
  },
};

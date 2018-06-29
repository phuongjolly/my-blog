import React from 'react';
import {
  Editor,
  RichUtils,
  CompositeDecorator, Entity,
} from 'draft-js';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import 'draft-js/dist/Draft.css';
import './PostEditor.css';
import { ALIGNMENT_DATA_KEY } from './plugins/ExtendedRichUtils';
import MyMediaEditor from './MyMediaEditor';
import MyImageUpload from './MyImageUpload';
import { postEditorActions } from './stores/postEditorReducer';

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 14,
    padding: 2,
  },
};

const Image = props => <img src={props.src} alt="content" />;

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'image') {
    media = <Image src={src} />;
  }

  return media;
};

class PostEditor extends React.Component {
  state = {
    newTag: '',
  };

  async componentDidMount() {
    this.focus();

    const { id } = this.props.match.params;
    this.props.loadPost(+id, this.decorator);
  }

  async onSaveClick() {
    this.props.savePost(this.state.newTag);
  }
  async onDiscardClick() {
    this.props.discardEdit(this.decorator);
  }

  onChange = (editorState) => {
    this.props.onChangeEditor(editorState);
  };

  onKeyStylingClick(style) {
    this.props.toggleInlineStyle(style);
  }

  setAlignment(alignment) {
    this.props.doAlignment(alignment);
  }

  setBlockStyling(type) {
    this.props.toggleBlockType(type);
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not handled';
  };

  blockStyleFn = (contentBlock) => {
    const textAlignStyle = contentBlock.getData().get(ALIGNMENT_DATA_KEY);
    switch (textAlignStyle) {
      case 'RIGHT':
        return 'align-right';
      case 'CENTER':
        return 'align-center';
      case 'LEFT':
        return 'align-left';
      case 'JUSTIFY':
        return 'align-justify';
      default:
        return '';
    }
  };

  mediaBlockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  }

  focus = () => {
    if (this.editor) {
      this.editor.focus();
    }
  };

  decorator = new CompositeDecorator([
    {
      strategy: findLinkEntities,
      component: Link,
    },
  ]);

  render() {
    const { editorState } = this.props;
    let $avatarPreview = '';
    if (this.props.post && this.props.post.avatarUrl) {
      $avatarPreview = <img src={this.props.post.avatarUrl} alt="avatar" />;
    } else {
      $avatarPreview = <img src="https://demokaliumsites-laborator.netdna-ssl.com/freelancer/wp-content/uploads/2015/03/8tracks_covers01_905-655x545.jpg" alt="avatar" />;
    }

    if (this.props.redirectToPost) {
      if (this.props.previousId >= 0) {
        return (<Redirect to={`/posts/${this.props.previousId}`} />);
      }

      return (<Redirect to="/posts" />);
    }

    return (
      <div className="editor-root">
        <div>
          <div className="ui fluid input post-title">
            <input
              type="text"
              placeholder="Title"
              onChange={event => this.props.onChangePost({
                  ...this.props.post,
                  title: event.target.value,
                })}
              value={this.props.post.title}
            />
          </div>
          <div className="ui fluid input post-description">
            <input
              type="text"
              placeholder="Description"
              onChange={event => this.props.onChangePost({
                  ...this.props.post,
                  description: event.target.value,
                })}
              value={this.props.post.description}
            />
          </div>
        </div>
        <div className="post-avatar">
          <MyImageUpload
            selectedPostAvatar={url => this.props.onChangePost({
                ...this.props.post,
                avatarUrl: url,
              })}
          />
          {$avatarPreview}
        </div>
        <div className="ui segment">
          <div className="ui icon buttons">
            <button className="ui button" onClick={() => this.setAlignment('LEFT')}>
              <i className="align left icon" />
            </button>
            <button className="ui button" onClick={() => this.setAlignment('CENTER')}>
              <i className="align center icon" />
            </button>
            <button className="ui button" onClick={() => this.setAlignment('RIGHT')}>
              <i className="align right icon" />
            </button>
            <button className="ui button" onClick={() => this.setAlignment('JUSTIFY')}>
              <i className="align justify icon" />
            </button>
            <button className="ui button" onClick={() => this.onKeyStylingClick('BOLD')}>
              <i className="bold icon" />
            </button>
            <button className="ui button" onClick={() => this.onKeyStylingClick('UNDERLINE')}>
              <i className="underline icon" />
            </button>
            <button className="ui button" onClick={() => this.onKeyStylingClick('LINE-THROUGH')}>
              <i className="text width icon" />
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('block-quote')}>
              <i className="quote left icon" />
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('code-block')}>
              <i className="code icon" />
            </button>
            <button className="ui button" onClick={() => this.props.selectLink()}>
              <i className="linkify icon" />
            </button>

            <button className="ui button mediaButton" onClick={() => this.props.selectImage()}>
              <i className="image icon" />
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('header-two')}>
                H2
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('header-three')}>
                H3
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('header-four')}>
                H4
            </button>
            <button className="ui button" onClick={() => this.setBlockStyling('header-five')}>
                H5
            </button>

          </div>
          <div className="editor-content">
            {this.props.isSelectingMedia &&
              <MyMediaEditor selectedMediaUrl={value => this.props.addMedia(value)} />}
            <div className="editor" onClick={this.focus}>
              <Editor
                editorState={editorState}
                onChange={this.onChange}
                handleKeyCommand={this.handleKeyCommand}
                ref={(element) => { this.editor = element; }}
                blockStyleFn={this.blockStyleFn}
                customStyleMap={styleMap}
                blockRendererFn={this.mediaBlockRenderer}
                placeholder="Tell your story"
                spellCheck
              />
            </div>
          </div>
        </div>
        <div className="tags">
          <div>Tags: </div>

          <div className="ui input">
            <input
              type="text"
              placeholder="Title"
              onChange={event => this.setState({ newTag: event.target.value })}
              value={this.state.newTag}
            />
          </div>
        </div>
        <div className="ui buttons">
          <button className="ui button" onClick={() => this.onDiscardClick()}>Discard</button>
          <div className="or" />
          <button className="ui positive button" onClick={() => this.props.savePost(this.state.newTag, this.props.post.avatarUrl)}>Save</button>
        </div>
      </div>
    );
  }
}

function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (entityKey != null && Entity.get(entityKey).getType() === 'LINK');
    },
    callback,
  );
}

const Link = (props) => {
  const { url } = Entity.get(props.entityKey).getData();
  console.log(`url here: ${{ url }.url}`);
  return (
    <a href={url} className="editorLink">
      {props.children}
    </a>
  );
};

export default connect(
  state => state.postEditor,
  postEditorActions,
)(PostEditor);

PostEditor.propTypes = {
  loadPost: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  savePost: PropTypes.func.isRequired,
  doAlignment: PropTypes.func.isRequired,
  toggleInlineStyle: PropTypes.func.isRequired,
  toggleBlockType: PropTypes.func.isRequired,
  discardEdit: PropTypes.func.isRequired,
  editorState: PropTypes.shape(),
  post: PropTypes.shape(),
  redirectToPost: PropTypes.bool,
  previousId: PropTypes.number,
  onChangePost: PropTypes.func.isRequired,
  addMedia: PropTypes.func.isRequired,
  onChangeEditor: PropTypes.func.isRequired,
  selectLink: PropTypes.func.isRequired,
  selectImage: PropTypes.func.isRequired,
  isSelectingMedia: PropTypes.bool,
};

PostEditor.defaultProps = {
  match: {
    params: {
      id: '',
    },
  },
  editorState: null,
  post: null,
  redirectToPost: false,
  previousId: -1,
  isSelectingMedia: false,
};

Image.propTypes = {
  src: PropTypes.string,
};

Image.defaultProps = {
  src: '',
};

Link.propTypes = {
  entityKey: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Link.defaultProps = {
  entityKey: '',
};

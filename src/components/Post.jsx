import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';
import './Post.css';
import './PostEditor.css';
import { modalActions } from './stores/modalReducer';
import { postActions } from './stores/postReducer';
import ModalQuestion from './ModalQuestion';
import { dialogActions } from './stores/dialogReducer';

class Post extends React.Component {
  state = {
    contentToReply: '',
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    this.props.loadPost(+id);
  }

  async componentDidUpdate() {
    if (this.props.redirectToHome) {
      this.props.openDialog(this.props.message);
    }
  }

  async deletePost() {
    const { id } = this.props.match.params;
    this.props.deletePost(+id);
  }

  async addComment(content) {
    const { id } = this.props.match.params;
    this.props.addComment(+id, content);
  }


  render() {
    let elementHTML = '';
    let controlButtons = '';
    let replyForm = '';
    let loginButton = '';
    let commentsForm = '';

    const postObject = this.props.post;
    if (postObject) {
      if (this.props.redirectToRegister) {
        return (<Redirect to="/user/register" />);
      }

      if (+this.props.goToPageNumber !== 0) {
        return <Redirect to={`/posts/${this.props.goToPageNumber}`} />;
      }

      if (this.props.redirectToHome) {
        return <Redirect to="/posts/" />;
      }

      elementHTML = ReactHtmlParser(postObject.content);

      if (this.props.currentUser) {
        if (this.props.currentUser.admin) {
          controlButtons = (
            <div className="post-button">
              <button className="ui button">
                <Link to={`/posts/${postObject.id}/edit`}>
                    Edit
                </Link>
              </button>
              <button className="ui button" onClick={() => this.props.openModal()}>
                  Delete
              </button>
            </div>
          );
        }

        replyForm = (
          <div>
            <form className="ui reply form">
              <div className="field">
                <textarea
                  value={this.state.contentToReply}
                  onChange={event => this.setState({ contentToReply: event.target.value })}
                />
              </div>
              <button type="button" className="ui button" onClick={() => this.addComment(this.state.contentToReply)}>Add Reply</button>
            </form>
          </div>);
      } else {
        loginButton = (
          <div>
            <Link to={{
                pathname: '/user/login',
                state: { currentState: this.props.match.url },
              }}
            >
              <div className="ui button">
                  Login to comment
              </div>
            </Link>
            <Link to="/user/register">
              <div className="ui button">
                  Register
              </div>
            </Link>
          </div>);
      }

      const { comments } = this.props;
      if (comments.length > 0) {
        commentsForm = (
          <div className="post-comments">
            <div className="ui threaded comments">
              <h3 className="ui dividing header">Comments</h3>
              {comments.map(comment => (
                <div className="comment" key={comment.id}>
                  <a className="avatar">
                    <img src="https://semantic-ui.com/images/avatar/small/matt.jpg" alt="avatar" />
                  </a>
                  <div className="content" >
                    <a className="author">{comment.user.name}</a>
                    <div className="metadata">
                      <span className="date">{comment.date}</span>
                    </div>
                    <div className="text">
                      {comment.content}
                    </div>
                    <div className="actions">
                      <button type="button">Reply</button>
                    </div>
                  </div>
                </div>
                ))}
            </div>
          </div>
        );
      }
    }

    return (
      <div className="post">
        {this.props.isLoading &&
        <div className="loading"><ReactLoading type="cubes" color="#666" /></div>
                }
        {controlButtons}
        <ModalQuestion
          doTask={() => this.deletePost()}
          closeModal={() => this.props.closeModal()}
          isActive={this.props.isActiveModalQuestion}
        />
        {postObject && (
        <div>
          <div className="post-title">
            <h1>
              {postObject.title}
            </h1>
          </div>
          <div className="post-description">
            <p>
              {postObject.description}
            </p>
          </div>
          <div className="editor">
            <div className="DraftEditor-root">
              <div className="DraftEditor-editorContainer">
                {elementHTML}
              </div>
            </div>
          </div>
          <div className="tag">
            {postObject.tags.map(tag => (
              <div key={tag.id}>
                <Link to={`/posts/tags/${tag.name}`}>
                  <div className="item">#{tag.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </div>
          )}
        <div className="social-button">
          <div className="likes">
            <i className="heart outline icon" />
            <p>157</p>
          </div>
          <div className="shares">
            <h4>Share</h4>
            <div className="social-links">
              <a href="https://www.facebook.com">Facebook</a>
              <a href="https://www.facebook.com">Twitter</a>
              <a href="https://www.facebook.com">Google+</a>
              <a href="https://www.facebook.com">Email</a>
            </div>
          </div>
        </div>
        <div className="navigation">
          <div className="previous">
                            Previous Page
          </div>
          <div>
            <i className="th large icon" />
          </div>
          <div className="next">
            <a href="https://www.facebook.com">
                        Next Page
            </a>
          </div>
        </div>
        {commentsForm}
        {replyForm}
        {loginButton}
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.authentication, ...state.singlePost, ...state.questionModal }),
  ({ ...postActions, ...modalActions, ...dialogActions }),
)(Post);

Post.propTypes = {
  loadPost: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    url: PropTypes.string,
  }),
  post: PropTypes.shape(),
  comments: PropTypes.arrayOf(PropTypes.shape()),
  currentUser: PropTypes.shape(),
  isLoading: PropTypes.bool,
  redirectToHome: PropTypes.bool,
  redirectToRegister: PropTypes.bool,
  goToPageNumber: PropTypes.number,
  deletePost: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isActiveModalQuestion: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  message: PropTypes.string,
};

Post.defaultProps = {
  match: {
    params: {
      id: '0',
    },
    url: '',
  },
  post: null,
  currentUser: null,
  comments: [],
  isLoading: false,
  redirectToHome: false,
  redirectToRegister: false,
  goToPageNumber: 0,
  isActiveModalQuestion: false,
  message: '',
};

import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import './PageContent.css';
import { actions } from './stores/postListReducer';

class PageContent extends React.Component {
  componentDidMount() {
    let { name } = this.props.match.params;
    if (name === undefined) {
      name = '';
    }
    this.props.loadPosts(name);
  }

  componentWillReceiveProps(newProps) {
    const { name } = newProps.match.params;
    const oldName = this.props.match.params.name;

    if (name !== oldName) {
      this.loadPosts(name);
    }
  }

  render() {
    let addNewButton = '';
    if (this.props.currentUser && this.props.currentUser.admin) {
      addNewButton = (
        <div className="item-box">
          <div className="addNew">
            <Link to="/posts/add">
              <i className="plus icon" />
            </Link>
          </div>
        </div>
      );
    }
    return (
      <div className="page-container">
        {this.props.isLoading &&
        <div className="loading"><ReactLoading type="cubes" color="#666" /></div>}
        {this.props.posts.map(post => (
                    post.display && (
                    <div className="item-box" key={post.id}>
                      <div className="photo">
                        <Link to={`/posts/${post.id}`}>
                          <img src={post.avatarUrl} alt="myBlog" />
                        </Link>
                      </div>
                      <div className="info-content">
                        <div className="info-header">{post.title}</div>
                        <div className="info-detail">
                          {post.description}
                        </div>
                      </div>
                    </div>
                    )
                ))}
        {addNewButton}
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.authentication, ...state.postList }),
  actions,
)(PageContent);


PageContent.propTypes = {
  isLoading: PropTypes.bool,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  totalItems: PropTypes.number,
  loadPosts: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
};

PageContent.defaultProps = {
  isLoading: false,
  posts: [],
  match: {
    params: {
      name: '',
    },
  },
  totalItems: 0,
  currentUser: null,
};

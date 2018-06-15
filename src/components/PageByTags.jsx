import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import queryString from 'query-string';
import './PageContent.css';
import { postTagsActions } from './stores/postTagsReducer';

class PageByTags extends React.Component {
  componentDidMount() {
    console.log('go to load post by tag');
    if (this.props.posts.length === 0) {
      const queryParsed = queryString.parse(this.props.location.search);
      this.props.loadPostsByTag(queryParsed.name);
    }
  }

  componentWillReceiveProps(newProps) {
    const oldName = queryString.parse(this.props.location.search).name;
    const { name } = queryString.parse(newProps.location.search);
    if (name !== oldName) {
      this.props.loadPostsByTag(name);
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
      <div>
        {this.props.isLoading &&
        <div className="loading"><ReactLoading type="cubes" color="#666" /></div>}
        <div className="page-container">
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
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.authentication, ...state.postsByTag }),
  postTagsActions,
)(PageByTags);


PageByTags.propTypes = {
  isLoading: PropTypes.bool,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  loadPostsByTag: PropTypes.func.isRequired,
  currentUser: PropTypes.shape(),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

PageByTags.defaultProps = {
  isLoading: false,
  posts: [],
  currentUser: null,
  location: {
    search: '',
  },
};

import React from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactLoading from 'react-loading';
import queryString from 'query-string';
import './PageContent.css';
import { postListActions } from './stores/postListReducer';

class PageContent extends React.Component {
  componentDidMount() {
    if (this.props.posts.length === 0) {
      const { name } = this.props.match.params;
      const queryParsed = queryString.parse(this.props.location.search);
      if (name === undefined) {
        this.props.loadPosts(queryParsed.page, queryParsed.size);
      }
    }
    this.props.getPostCount();
  }

  componentWillReceiveProps(newProps) {
    const oldPage = queryString.parse(this.props.location.search).page;
    const { page } = queryString.parse(newProps.location.search);

    if ((oldPage === undefined && oldPage === 1) || (page !== oldPage)) {
      this.props.loadPosts(+page, 3);
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
        {(((this.props.page + 1) * this.props.limitItem) < this.props.totalItems) &&
        <div className="show-more">
          <button className="show-more-button">
            <Link to={`/posts?page=${parseInt(this.props.page, 10) + 1}&size=${this.props.limitItem}`}>
              Show More
            </Link>
          </button>
        </div>
        }
      </div>
    );
  }
}

export default connect(
  state => ({ ...state.authentication, ...state.postList }),
  postListActions,
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
  page: PropTypes.number,
  limitItem: PropTypes.number,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  getPostCount: PropTypes.func.isRequired,
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
  page: 0,
  limitItem: 3,
  location: {
    search: '',
  },
};
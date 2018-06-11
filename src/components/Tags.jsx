import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import { postTagsActions } from './stores/postTagsReducer';
import './Tag.css';

class Tags extends React.Component {
  async componentDidMount() {
    const { name } = this.props.match.params;
    this.props.loadPostsByTag(name);
  }

  render() {
    return (
      <div className="tag">
        {this.props.isLoading &&
        <div className="loading"><ReactLoading type="cubes" color="#666" /></div>
        }
        <div className="title">{`List of Posts related to ${this.props.match.params.name}: `}</div>
        {this.props.posts.map((post, index) => (
          <div key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <div className="item">{`${index}. ${post.title}`}</div>
            </Link>
          </div>
                ))}
      </div>
    );
  }
}

export default connect(
  state => state.postsByTag,
  postTagsActions,
)(Tags);

Tags.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  loadPostsByTag: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape()),
  isLoading: PropTypes.bool,
};

Tags.defaultProps = {
  match: {
    params: {
      name: '',
    },
  },
  posts: [],
  isLoading: false,
};

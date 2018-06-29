import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { PropTypes } from 'prop-types';
import { authenticationActions } from './stores/authenticationReducer';

class Header extends React.Component {
  async onLogoutClick() {
    this.props.logout();
  }

  render() {
    if (this.props.redirectToHome) {
      console.log('home');
      window.location.replace('/posts');
    }

    let helloMessage;
    let loginButton;
    if (this.props.currentUser) {
      helloMessage = (
        <div className="hello-message">
          <div className="hello"> Hello </div>
          <div className="username">{this.props.currentUser.name}</div>
          <button className="ui button helloButton" onClick={() => this.onLogoutClick()}>Logout</button>
        </div>
      );
    } else {
      loginButton = (
        <div className="hello-message">
          <Link
            to={{
                        pathname: '/user/login',
                        state: { currentState: this.props.match.url },
                    }}
            className="ui link login-button"
          >
              Login
          </Link>
          <Link to="/user/register" className="ui link register-button">
                        Register
          </Link>
        </div>
      );
    }
    return (
      <div className="">
        <div className="main-header">
          <div className="header-logo">
            <img src="https://c2.staticflickr.com/2/1789/41965143275_b762350741_o.png" alt="icon" />
          </div>

          {helloMessage}
          {loginButton}
        </div>
        <div className="portfolio-container">
          <div className="portfolio-title-holder">
            <div className="portfolio-title">Portfolio</div>
            <div className="portfolio-content">My all projects will be presented here</div>
          </div>
          <div className="portfolio-menu">
            <div className="item">
              <Link to="/">Home</Link>
            </div>
            <div className="item">
              <Link to="/tags?name=projects">Projects</Link>
            </div>
            <div className="item">
              <Link to="/tags?name=news">Articles</Link>
            </div>
            <div className="item">
              <Link to="/tags?name=myCV">About</Link>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default withRouter(connect(
  state => state.authentication,
  authenticationActions,
)(Header));

Header.propTypes = {
  currentUser: PropTypes.shape(),
  logout: PropTypes.func.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
  redirectToHome: PropTypes.bool,
};

Header.defaultProps = {
  currentUser: null,
  match: {
    url: '',
  },
  redirectToHome: false,
};

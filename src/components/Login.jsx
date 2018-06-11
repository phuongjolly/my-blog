import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authenticationActions } from './stores/authenticationReducer';
import './Authentication.css';

class Login extends React.Component {
  async onLoginClick(event) {
    event.preventDefault();
    console.log('=====');
    console.log(this);
    this.props.login(this.props.loginInfo);
  }

  render() {
    if (this.props.redirectToPreviousPage) {
      if (this.props.history.location.state) {
        const previousState = this.props.history.location.state.currentState;
        return <Redirect to={previousState} />;
      }
      return <Redirect to="/posts" />;
    } else if (this.props.redirectToRegister) {
      return <Redirect to="/user/register" />;
    }

    return (
      <div className="authForm">
        <h3 className="errorMessage">{this.props.message}</h3>
        <form className="ui form" onSubmit={(event) => { this.onLoginClick(event); return false; }}>
          <div className="field">
            <label>Email </label>
            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              onChange={event => this.props.updateLoginInfo({
                ...this.props.loginInfo,
                email: event.target.value,
              })}
              value={this.props.loginInfo.email}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              required
              name="password"
              placeholder="Password"
              onChange={event => this.props.updateLoginInfo({
                ...this.props.loginInfo,
                password: event.target.value,
              })}
              value={this.props.loginInfo.password}
            />
          </div>
          <div className="formButton">
            <button className={this.props.isLoading ? 'ui loading button' : 'ui button'} type="submit">Login</button>
            <button className="ui button" type="button">
              <Link to="/user/register">
              Register
              </Link>
            </button>
          </div>
        </form>

      </div>
    );
  }
}

export default connect(
  state => state.authentication,
  authenticationActions,
)(Login);

Login.propTypes = {
  loginInfo: PropTypes.shape(),
  login: PropTypes.func.isRequired,
  redirectToPreviousPage: PropTypes.bool,
  redirectToRegister: PropTypes.bool,
  updateLoginInfo: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  message: PropTypes.string,
};

Login.defaultProps = {
  loginInfo: null,
  redirectToPreviousPage: false,
  redirectToRegister: false,
  isLoading: false,
  message: '',
};

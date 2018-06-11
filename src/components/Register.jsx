import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { registerActions } from './stores/registerReducer';

class Register extends React.Component {
  async onRegisterClick(event) {
    event.preventDefault();
    this.props.register();
  }

  componentWillUnmount() {
    if (this.props.redirectToLogin) {
      this.props.resetRegisterInfo();
    }
  }
  render() {
    if (this.props.redirectToLogin) {
      return (<Redirect to="/user/login" />);
    }
    const { registerInfo } = this.props;

    return (
      <div className="authForm">
        <h3 className="errorMessage">{this.props.message}</h3>
        <form className="ui form" onSubmit={(event) => { this.onRegisterClick(event); return false; }}>
          <div className="field">
            <label>First Name</label>
            <input
              required
              type="text"
              name="first-name"
              placeholder="First Name"
              onChange={event => this.props.updateRegisterInfo({
                ...registerInfo,
                name: event.target.value,
              })}
              value={registerInfo.name}
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              required
              name="email"
              placeholder="Email"
              onChange={event => this.props.updateRegisterInfo({
                ...registerInfo,
                email: event.target.value,
              })}
              value={registerInfo.email}
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              onChange={event => this.props.updateRegisterInfo({
                ...registerInfo,
                password: event.target.value,
              })}
              value={registerInfo.password}
            />
          </div>
          <div className="formButton">
            <button className={this.props.isLoading ? 'ui loading button' : 'ui button'} type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(
  state => state.register,
  registerActions,
)(Register);

Register.propTypes = {
  register: PropTypes.func.isRequired,
  redirectToLogin: PropTypes.bool,
  message: PropTypes.string,
  updateRegisterInfo: PropTypes.func.isRequired,
  registerInfo: PropTypes.shape(),
  isLoading: PropTypes.bool,
  resetRegisterInfo: PropTypes.func.isRequired,
};

Register.defaultProps = {
  redirectToLogin: false,
  message: '',
  registerInfo: null,
  isLoading: false,
};


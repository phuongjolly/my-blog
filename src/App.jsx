import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import { Switch } from 'react-router';
import { connect } from 'react-redux';
import createBrowserHistory from 'history/createBrowserHistory';
import PropTypes from 'prop-types';
import './App.css';
import PageContent from './components/PageContent';
import Post from './components/Post';
import Header from './components/Header';
import PostEditor from './components/PostEditor';
import Login from './components/Login';
import Register from './components/Register';
import MyProfile from './components/MyProfile';
import UserList from './components/UserList';
import UserRole from './components/UserRole';
import Loading from './components/Loading';
import Tags from './components/Tags';
import DialogModal from './components/DialogModal';
import { dialogActions } from './components/stores/dialogReducer';
import { authenticationActions } from './components/stores/authenticationReducer';

const customHistory = createBrowserHistory();

class App extends Component {
  async componentDidMount() {
    this.props.login(null);
  }

  render() {
    return (
      <Router history={customHistory}>
        <div className="App">
          <div className="container">
            <div className="wrapper">
              <Header />
              <Switch>
                <Route path="/loading" component={Loading} />
                <Route path="/user/me" component={MyProfile} />
                <Route path="/user/userList" component={UserList} />
                <Route path="/addRole" component={UserRole} />
                <Route path="/user/register" component={Register} />
                <Route path="/user/login" component={Login} />
                <Route path="/posts/tags/:name" component={Tags} />
                <Route path="/posts/add" component={PostEditor} />
                <Route path="/posts/:id/edit" component={PostEditor} />
                <Route path="/posts/:id" component={Post} />
                <Route path="/tags/:name" component={PageContent} />
                <Route component={PageContent} />
              </Switch>
              <DialogModal
                show={this.props.isActiveDialog}
                onClose={() => this.props.closeDialog()}
                message={this.props.message}
              >
                                    Here is some content for the modal
              </DialogModal>
            </div>
          </div>
          <div className="footer">
            <div className="social-links">
              <a href="https://www.facebook.com">Facebook</a>
              <a href="https://www.facebook.com">Twitter</a>
              <a href="https://www.facebook.com">Google+</a>
              <a href="https://www.facebook.com">Email</a>
            </div>
            <div className="copyright">
                                © Copyright 2018. All Rights Reserved.
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(
  state => ({ ...state.dialogModal, ...state.authentication }),
  ({ ...dialogActions, ...authenticationActions }),
)(App);

App.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  isActiveDialog: PropTypes.bool,
  message: PropTypes.string,
  login: PropTypes.func.isRequired,
};

App.defaultProps = {
  isActiveDialog: false,
  message: '',
};

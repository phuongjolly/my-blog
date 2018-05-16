import React, { Component } from 'react';
import './App.css';
import PageContent from "./components/PageContent";
import Post from "./components/Post";
import {Route, Router} from "react-router-dom";
import {Switch} from "react-router";
import createBrowserHistory from 'history/createBrowserHistory';
import Header from "./components/Header";
import PostEditor from "./components/PostEditor";
import Login from "./components/Login";
import Register from "./components/Register";
import {get} from "./components/Http"
import MyProfile from "./components/MyProfile";
import store from "./components/stores/store";
import {login} from "./components/stores/authenticationReducer";
import {Provider} from "react-redux";
import UserList from "./components/UserList";
import UserRole from "./components/UserRole";
import Loading from "./components/Loading";
import Tags from "./components/Tags";
import DialogModal from "./components/DialogModal";
import {close} from "./components/stores/modalReducer";

const customHistory = createBrowserHistory();

class App extends Component {
    state = {
        openModalDialog: false
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    async componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.updateModal());
        try {
            const currentUser = await get("/api/users/currentUser");
            if (currentUser) {
                store.dispatch(login(currentUser));
            }
        } catch (exception) {
            console.log("No logged in user.");
        }
    }

    updateModal(){
        const {openModalDialog} = store.getState().showModalDialog;
        this.setState({
            openModalDialog
        })
    }

    closeModal() {
        store.dispatch(close());
    }

    render() {

        return (
            <Provider store={store}>
                <Router history={customHistory}>
                    <div className="App">
                        <div className="wrapper">
                            <Header />
                            <Switch>
                                <Route path="/loading" component={Loading}/>
                                <Route path="/user/me" component={MyProfile}/>
                                <Route path="/user/userList" component={UserList}/>
                                <Route path="/addRole" component={UserRole}/>
                                <Route path="/user/register" component={Register}/>
                                <Route path="/user/login" component={Login}/>
                                <Route path="/posts/tags/:name" component={Tags}/>
                                <Route path="/posts/add" component={PostEditor}/>
                                <Route path="/posts/:id/edit" component={PostEditor}/>
                                <Route path="/posts/:id" component={Post} />
                                <Route path="/tags/:name" component={PageContent}/>
                                <Route component={PageContent}/>
                            </Switch>
                            <DialogModal show={this.state.openModalDialog}
                                         onClose={() => this.closeModal()}>
                                Here's some content for the modal
                            </DialogModal>
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
            </Provider>
        );
    }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import PageContent from "./components/PageContent";
import Post from "./components/Post";
import {Route, BrowserRouter as Router, Redirect} from "react-router-dom";
import {Switch} from "react-router";
import Header from "./components/Header";
import PostEditor from "./components/PostEditor";
import Login from "./components/Login";
import Register from "./components/Register";
import {get} from "./components/Http"
import MyProfile from "./components/MyProfile";
import store from "./components/stores/store";
import {login} from "./components/stores/authenticationReducer";
import {Provider} from "react-redux";

class App extends Component {

    async componentDidMount() {

        try {
            const currentUser = await get("/api/users/currentUser");
            if (currentUser) {
                store.dispatch(login(currentUser));
            }
        } catch (exception) {
            console.log("No logged in user.");
        }
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <div className="wrapper">
                            <Header />
                            <Switch>
                                <Route path="/user/me" component={MyProfile}/>
                                <Route path="/user/register" component={Register}/>
                                <Route path="/user/login" component={Login}/>
                                <Route path="/posts/add" component={PostEditor}/>
                                <Route path="/posts/:id/edit" component={PostEditor}/>
                                <Route path="/posts/:id" component={Post} />
                                <Redirect from="/posts/:id" to="/post/:id/edit"/>
                                <Route component={PageContent}/>
                            </Switch>
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

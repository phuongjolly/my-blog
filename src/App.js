import React, { Component } from 'react';
import './App.css';
import PageContent from "./components/PageContent";
import Post from "./components/Post";
import {Route, BrowserRouter as Router} from "react-router-dom";
import {Switch} from "react-router";
import Header from "./components/Header";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Header />
                    <Switch>
                        <Route path="/posts/:id" component={Post} />
                        <Route component={PageContent}/>
                    </Switch>
                </div>
            </Router>
        );
    }
    /*state = {
        users: []
    };

    async componentDidMount() {
        const response = await fetch('/api/users');
        const users = await response.json();
        this.setState({users});
    }

    render(){
      return (
          <div className="App">
              <h1>Users</h1>
              {this.state.users.map(user =>
                  <div key={user.id}>user: {user.name} Password: {user.password}</div>
              )}
          </div>
      );
    }*/
}

export default App;

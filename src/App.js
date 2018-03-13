import React, { Component } from 'react';
import './App.css';
import Header from "./components/Header";
import PageContent from "./components/PageContent";
import Post from "./components/Post";

class App extends Component {
  render() {
    return (
      <div className="App">
          <div className="main-header">
              <Header/>
          </div>
          <div className="portfolio-container">
              <div className="portfolio-title-holder">
                  <div className="portfolio-title">Portfolio</div>
                  <div className="portfolio-content">My all projects will be presented here</div>
              </div>
              <div className="portfolio-menu">
                  <div className="item">Home</div>
                  <div className="item">Project</div>
                  <div className="item">Articles</div>
                  <div className="item">About</div>
              </div>
          </div>
          <PageContent/>
         <Post/>

      </div>
    );
  }
}

export default App;

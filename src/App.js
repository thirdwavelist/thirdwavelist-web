import React, { Component } from "react";
import Routes from "./Routes";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1 className="title"><a className="no-style" href="/" alt="Home">Third Wave List</a></h1>
        <Routes />
        <div className="footer">
          <span>Made with <span role="img" aria-label="love">❤️</span> by <a className="no-style" href="https://www.twitter.com/tjalve">@tjalve</a> and <a className="no-style" href="https://www.twitter.com/anthonymonori">@anthonymonori</a>.</span>
          <br />
          <span>Copyright (c). Third Wave List, 2017 - {new Date().getFullYear()}. All rights reserved.</span>
        </div>
      </div>
    );
  }
}

export default App;

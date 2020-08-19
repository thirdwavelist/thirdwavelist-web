import React, { Component } from "react";
import Routes from "./Routes";
import { Navbar, NavbarBrand } from 'reactstrap';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar>
          <NavbarBrand className="title" href="/" alt="Home">Third Wave List</NavbarBrand>
          <a id="submit-link" href="/submit" alt="Submit café">Submit</a>
        </Navbar>
      
        <Routes />

        <div className="footer">
          <span>Made with <span role="img" aria-label="love">❤️</span> by <a className="no-style" target="_blank" rel="noopener noreferrer" href="https://www.twitter.com/tjalve">@tjalve</a> and <a className="no-style" target="_blank" rel="noopener noreferrer" href="https://www.twitter.com/hifromantal">@hifromantal</a>.</span>
          <br />
          <span>Copyright (c). Antal János Monori & Kristoffer Tjalve, 2017 - {new Date().getFullYear()}. All rights reserved.</span>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import Routes from "./Routes";
import { Nav, Title } from "reactbulma"
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav>
        <Nav.Center>
          <Nav.Item>
            <Title>ThirdWaveList</Title>
          </Nav.Item>
        </Nav.Center>
        </Nav>
        <Routes />
      </div>
    );
  }
}

export default App;

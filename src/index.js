import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { injectGlobal } from "styled-components";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import "react-bulma-components/dist/react-bulma-components.min.css";
import spectralScFont from "./fonts/SpectralSC-ExtraLight.ttf"
import '../node_modules/font-awesome/css/font-awesome.min.css';

import "./index.css";

injectGlobal`
@font-face {
  font-family: 'Spectral SC';
  src: url(${spectralScFont});
}`;

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
registerServiceWorker();
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Manifesto from "./containers/Manifesto"
import NotFound from "./containers/NotFound"

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/manifesto" exact component={Manifesto} />
    <Route component={NotFound} />
  </Switch>;
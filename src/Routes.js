import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound"
import CafeDetail from "./containers/CafeDetail"

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/:city/:name" component={CafeDetail} />
    <Route component={NotFound} />
  </Switch>;
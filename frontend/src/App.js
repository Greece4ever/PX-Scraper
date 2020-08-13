import React, { useEffect } from 'react';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom'
import Folder_preview from './pages/folder_preview';
import Home from "./pages/Home";
import Sign_in from "./pages/signin";
import jquery from 'jquery';
import GetStarted from './pages/start'
import FolderDetail from "./pages/folder_detail"

const App = () => {
  useEffect(() => {
    jquery('#load-wrapper').fadeOut('slow')
  })
  return (
    <Router>
      <Switch>
        <Route path="/folders" exact component={Folder_preview} />
        <Route path="/" exact component={Home} />
        <Route path="/accounts/register" exact component={Sign_in} />
        <Route path="/getstarted" exact component={GetStarted} />
        <Route path="/folders/:id" component={FolderDetail} />
      </Switch>
    </Router>
  )

};

export default App;
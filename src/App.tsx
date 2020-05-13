import React from 'react';
import {HashRouter, Redirect, Route} from 'react-router-dom';
import './App.css';

import Login from './containers/Login';
import MenuBar from './components/MenuBar/MenuBar';
import Chat from './containers/Chat';

const App = () => {
  return (
    <div className="App">
      <MenuBar/>
      <HashRouter>
        <Route path={'/'} render={() => <Redirect to={'/login'}/>} exact/>
        <Route path={'/login'} component={Login} exact/>
        <Route path={'/chat'} component={Chat} exact/>
      </HashRouter>
    </div>
  );
}

export default App;

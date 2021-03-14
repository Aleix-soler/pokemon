import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Pokemon from './components/lluita/lluita';
import Inici from './components/inici/inici';
import login from './components/login/login';

class App extends Component {
  render() {    
    return (
      <Router>
        <div className="App" >
          <div className="container">
            <Switch>
              <Route exact path="/lobby/" component={Inici} />
              <Route exact path="/" component={login}/>
              <Route  path="/lluita/:room" component={Pokemon} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

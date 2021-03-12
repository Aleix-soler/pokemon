import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import Pokemon from './components/lluita/lluita';
import Inici from './components/inici/inici';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App" >
          <div className="container">
            <Switch>
              <Route exact path="/" component={Inici} />
              <Route  path="/lluita/:room/:nom" component={Pokemon} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;

import React, { Component } from 'react';
import axios from 'axios';
import getPokemon from './components/pokemon';
import getMoviment from './components/moviments';

class App extends Component {
  state = {
    pokemon:{}
  }

  componentDidMount(){
      getPokemon(123).then(res => {
       this.setState({pokemon : res});
       console.log(res);
      })
      getMoviment(11).then(res =>{
        console.log(res);
      })
    }

  render() {
    return (
      <div>
        
      </div>
    );
  }
}

export default App;
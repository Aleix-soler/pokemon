import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


class App extends Component {
  componentDidMount(){
    this.getDito();
  }
  getDito(){
    axios.get(`https://pokeapi.co/api/v2/pokemon/ditto`)
    .then(res => {
      const pokemon = res.data;
      console.log(pokemon);
    })
  }

  render() {
    return (
     <div>
       <p>Hola</p>
     </div>
    );
  }
}

export default App;

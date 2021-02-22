import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


class App extends Component {
  state = {
    nom:'',
    imatge:''
  }

  componentDidMount(){
    this.getDito();
  }
  async getDito(){
    let random = Math.floor(Math.random() * 151) + 1;
   await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
    .then(res => {
      const pokemon = res.data;
      console.log(pokemon);
      console.log(pokemon.sprites.front_default);
      this.setState({imatge:pokemon.sprites.front_default})
      this.setState({nom:pokemon.name})
    })
  }

  render() {
    return (
     <div>
       <p>{this.state.nom.toUpperCase()}</p>
      <img src={this.state.imatge} />
     </div>
    );
  }
}

export default App;

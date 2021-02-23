import React, { Component } from 'react';
import './App.css';
import axios from 'axios';


class App extends Component {
  state = {
    nom:'',
    imatge:'',
    habilitats:[],
    pokemon:{}
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
      this.setState({pokemon : pokemon})
      this.getHabilitats(pokemon)
    })
  }
  getHabilitats(pokemon){
    let  aux = pokemon.moves;
    let moviments = [];
    for (let i = 0; i < 4; i++) {
      moviments[i] = aux[Math.floor(Math.random() * aux.length)] 
    }
    this.setState({habilitats : moviments})
    console.log();
  }  

  render() {
    return (
     <div>
       <p>{this.state.nom.toUpperCase()}</p>
       <p>{this.state.habilitats[0]?.move.name}</p>
      <img src={this.state.imatge} />
     </div>
    );
  }
}

export default App;

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
     <div id={"interficie"}>
       <div id={"nom"}>
          <p>{this.state.nom}</p>
          <div id={"vida"}></div>
          <p>100%</p> {/*Canviar per valor d'api*/}
       </div>
      <img id={"sprite"} src={this.state.imatge} />
      <table id={"moviments"}>
        <tr>
          <th>{this.state.habilitats[0]?.move.name}</th>
          <th>{this.state.habilitats[1]?.move.name}</th>
        </tr>
        <tr>
          <th>{this.state.habilitats[2]?.move.name}</th>
          <th>{this.state.habilitats[3]?.move.name}</th>
        </tr>
      </table>
     </div>
    );
  }
}

export default App;

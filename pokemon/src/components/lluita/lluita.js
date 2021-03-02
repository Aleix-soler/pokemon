/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import getPokemon from '../pokemon';
import getMoviment from '../moviments';
import styles from './lluita.css';
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://172.24.1.38:3000/";

class App extends Component {
  state = {
    pokemon:{
      nom : '',
      imatge : '',
      moviments : [{id: 0 , moviment: ""}],
      stats: { atack : 0 , defensa : 0 , vida : 0 }
    },

    moviment:{
      tipus: {nom: '', color:''},
      descripcio:'',
      accuracy: 0,
      power: 0,
      pp : 0
}
  }

  componentDidMount(){
    const socket = socketIOClient(ENDPOINT);
        socket.on("FromAPI", data => {
          console.log(data);
        });
        socket.emit("pokemonsInici");
        socket.on("pokemonData", (pokemons) => {
          console.log("infoPokemon");
          console.log(JSON.parse(pokemons));
        })
      var random = Math.floor(Math.random() * 151) + 1;
      getPokemon(random).then(res => {
       this.setState({pokemon : res});
       console.log("HEREE");
       console.log(res);
      })
      getMoviment(11).then(res =>{
        console.log(res);
      })
    }


  render() {
    
    return (
     <div id={"interficie"}>
        <div id={"pokemons"}>
          <div id={"nom"}>
            <p>{this.state.pokemon.nom}</p>
            <div id={"vida"}></div><p style={{fontSize: 15}}>{this.state.pokemon.stats.vida} PS</p>
          </div>
          <div id={"nomEnemic"}>
            <p>{this.state.pokemon.nom}</p>
            <div id={"vidaEnemic"}></div><p style={{fontSize: 15}}>{this.state.pokemon.stats.vida} PS</p>
          </div>
          <img id={"spriteBack"} src={this.state.pokemon.imatgeBack} />
          <img id={"spriteFront"} src={this.state.pokemon.imatgeFront} />
        </div>
        <div class="bottom-menu">
          <div class="battle-text text-box-left">
        </div>
      <div class="box">
        <div class="actions">
          <button>{this.state.pokemon.moviments[0].moviment}</button>
          <button>Water Pulse</button>
          <button>Surf</button>
          <button>Tacle</button>
        </div>
      </div>
      </div>
     </div>
    );
  }
}

export default App;
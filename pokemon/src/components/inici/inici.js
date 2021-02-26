
import React, { Component } from "react";
import style from "./inici.css";
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://172.24.1.44:3000/";

class Inici extends Component {
  state = {
    pokemons : [],
    loading : true
  };

  componentDidMount(){
   this.getPokemons();

  }

  async getPokemons(){
     const socket = socketIOClient(ENDPOINT);
    await socket.on("FromAPI", data => {
      console.log(data);
    });
    socket.emit("pokemonsInici");
    socket.on("pokemonData", (pokemons) => {
      console.log("infoPokemon");
      console.log(pokemons);
      this.state.pokemons = JSON.parse(pokemons)
      console.log(JSON.parse(pokemons));
      this.setState({loading : false})
    })    
  }

  renderPokemons(){
    console.log("entra");
    if(this.state.pokemons != undefined){
   return(
     this.state.pokemons.map((element)=>{
       return(

        <div id="pic1">
        <img
          id="img1"
          src={element.img}
          onmouseover="this.style.opacity=1;"
          onmouseout="this.style.opacity=0.5;"
        />
        <p>{element.nom}</p>
        <div class="destacado">
          ATK: {element.stats.atack}
          DEF: {element.stats.defensa}
          PS: {element.stats.vida}
        </div>
      </div>
       )
     })
   )
  }
  }

  render() {
    return (
        <div id="contenedor">
          { this.state.loading ? null :  this.renderPokemons()} 
        </div>
    );
  }
}

export default Inici;

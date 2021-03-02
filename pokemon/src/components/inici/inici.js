/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import style from "./inici.css";
import socketIOClient from "socket.io-client";  
import { Link, Route, Router } from "react-router-dom";
const ENDPOINT = "http://172.24.3.74:3000/";
const socket = socketIOClient(ENDPOINT);

class Inici extends Component {
  
  state = {
    pokemons : [],
    loading : true
  };
  componentDidMount(){
   this.getPokemons();
  }

  async getPokemons(){
    socket.emit("pokemonsInici");
    socket.on("pokemonData", (pokemons) => {
      console.log("infoPokemon");
      console.log(pokemons);
      this.state.pokemons = JSON.parse(pokemons)
      console.log(JSON.parse(pokemons));
      this.setState({loading : false})
    })    
  }
  /*
  async reroll(){
    await socket.emit("rerollPokemon")
    socket.on("pokemonReroll", (pokemons) => {
      console.log("infoPokemon");
      console.log(pokemons);
      console.log(JSON.parse(pokemons));
      this.setState({pokemons : JSON.parse(pokemons)})
     
      this.setState({loading : false})
    })  
  }
  */
  
  renderPokemons(){
    console.log("entra");
    if(this.state.pokemons != undefined){
   return(
     this.state.pokemons.map((element)=>{
       return(
        <div> 
          <div id="pic1">
            <img
              id="img1"
              src={element.img}
              onmouseover="this.style.opacity=1;"
              onmouseout="this.style.opacity=0.5;"
            />
        <p>{element.nom}</p>
        <div class="destacado">
          <span style={{ display:'flex',alignContent:'center',justifyContent:'center'}}>
            <p style={{fontSize:15 , padding: '2px', border: '1px solid black', marginLeft: '2px', backgroundColor: 'red', color: 'white'}}>ATK: {element.stats.atack} </p>
            <p style={{fontSize:15 , padding: '2px', border: '1px solid black', marginLeft: '2px', backgroundColor: 'blue', color: 'white'}}>DEF: {element.stats.defensa} </p> 
            <p style={{fontSize:15 , padding: '2px', border: '1px solid black', marginLeft: '2px', backgroundColor: 'green', color: 'white'}}>PS: {element.stats.vida} </p>  
          </span>
        </div>
      </div>
      </div>
       )
     })
   )
  }
  }

  render() {
    return (
      <div>
        <div id="logo">
          <img src="../logo.png"></img>
        </div>
         <div id="contenedor">
          <div  style={{ display:'flex',flexDirection: 'row', justifyContent: 'center'}}> 
            {this.state.loading ? null :  this.renderPokemons()} 
          </div>
        </div>

      </div>
       
    );
  }
}

export default Inici;

/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import style from "./inici.css";
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://172.24.2.92:3000/";
const socket = socketIOClient(ENDPOINT);

class Inici extends Component {
  
  state = {
    pokemons : [],
    loading : true,
    value: ''
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


  reroll(pokeReroll){
    socket.emit ('reroll', {posicio: pokeReroll })
      socket.on("pokemons", (msg)=>{
        console.log(msg);
        this.setState({pokemons : JSON.parse(msg)})
      })
  }


  renderPokemons(){
    console.log("entra");
    console.log(this.state.pokemons);
    if(this.state.pokemons != undefined && this.state.pokemons != null){
   return(
     this.state.pokemons.map((element,index)=>{
       return(
        <div key={index}> 
          <div id="pic1">
            <img
              id="img1"
              src={element.imatgeFront}
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
          <button onClick={()=>this.reroll(index)}>Reroll</button>
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

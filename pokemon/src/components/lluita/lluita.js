import React, { Component } from 'react';
import getPokemon from '../pokemon';
import getMoviment from '../moviments';
import styles from './App.css';

class Lluita extends Component {
  state = {
    pokemon:{
      nom : '',
      imatge : '',
      moviments : [{id: 0 , moviment: ""}],
      stats: { atack : 0 , defensa : 0 , vida : 0 }
    }
  }

  componentDidMount(){
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
       <div id={"nom"}>
          <p>{this.state.pokemon.nom}</p>
          <div id={"vida"}></div>
          <p>{this.state.pokemon.stats.vida} PS</p> 
       </div>
       <img id={"sprite"} src={this.state.pokemon.imatge} />
      <table id={"moviments"}>
        <tr>  
          <th>{this.state.pokemon.moviments[0]?.moviment}</th>
          <th>{this.state.pokemon.moviments[1]?.moviment}</th>
        </tr>
        <tr>
          <th>{this.state.pokemon.moviments[2]?.moviment}</th>
          <th>{this.state.pokemon.moviments[3]?.moviment}</th>
        </tr>
      </table>
     </div>
    );
  }
}

export default Lluita;
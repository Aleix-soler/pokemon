import React, { Component } from 'react';
import getPokemon from './components/pokemon';
import getMoviment from './components/moviments';

class App extends Component {
  state = {
    pokemon:{
      nom : '',
      imatge : '',
      moviments : [{id: 0 , moviment: ""}],
      stats: { atack : 0 , defensa : 0 , vida : 0 }
    }
  }

  componentDidMount(){
      getPokemon(123).then(res => {
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
<<<<<<< HEAD
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
=======
      <img id={"sprite"} src={this.state.pokemon.imatge} />
>>>>>>> 5629a7cb76f68b50e0342944bb1625e0dad8c0fb
     </div>
    );
  }
}

export default App;
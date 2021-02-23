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
      <img id={"sprite"} src={this.state.pokemon.imatge} />
     </div>
    );
  }
}

export default App;
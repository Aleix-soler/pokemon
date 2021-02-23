import React, { Component } from 'react';
import axios from 'axios';
import getPokemon from './components/pokemon';
import getMoviment from './components/moviments';

class App extends Component {
  state = {
    pokemon:{}
  }

  componentDidMount(){
      getPokemon(123).then(res => {
       this.setState({pokemon : res});
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
          <p>{this.state.nom}</p>
          <div id={"vida"}></div>
          <p>100%</p> {/*Canviar per valor d'api*/}
       </div>
      <img id={"sprite"} src={this.state.imatge} />
      <ul id={"moviments"}>{this.state.habilitats[0]?.move.name}</ul>
     </div>
    );
  }
}

export default App;
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import getPokemon from '../pokemon';
import getMoviment from '../moviments';
import styles from './lluita.css';
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://192.168.100.31:4444/";
const socket = socketIOClient(ENDPOINT);

class App extends Component {
  state = {
    percent: 0,

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
},
  }
  componentWillUnmount() {
    console.log("entrsdasd");
    socket.close('connect');
  }

  componentDidMount(){
    const room = this.props.match.params.room;
    const nomUser = this.props.location.userId;
    
    console.log("GAME id =>"+room);
    console.log("Nom =>"+nomUser);
    this.interval = setInterval(() => {
      this.setToRoom(room,nomUser);  
    }, 1000);
    console.log("LLUITA STATE",this.state)
    }

    setToRoom(room,userId){
      console.log("Room=>"+room+" User_ID=>"+userId);
     
        socket.emit('ROOM', { room, userId });
      socket.on('RECEIVE_ID', (userId) => {
        console.log("ENTREAS PARARERASF");
        console.log(userId);
        //Mirar si ha passat la id dels 2 players
        if(userId.player1 !== null && userId.player1 !== ''){
          if(userId.player2 !== null && userId.player2 !== ''){
            this.renderPokemons(userId)
          }
        }
      });
    }

    renderPokemons(userId){
      clearInterval(this.interval);
      if(userId.player1 == this.props.location.userId){
        socket.emit('SEND_POKEMON',userId.player2)
      }else{
        socket.emit('SEND_POKEMON',userId.player1)
      }
      socket.on('POKEMONS', (msg)=>{
        this.setState({
          pokemons: msg
        })
      })
      console.log("Pokemons State=>", this.state)
    }

    vida(hostia){
      let aux = this.state.pokemon.vida;
      this.state.percent = hostia * 100 / this.state.pokemon.stats.vida;
      this.state.percent *= 2.7;
      document.getElementById("vida").style.marginRight = this.state.percent + "px";
      this.state.pokemon.stats.vida = this.state.pokemon.stats.vida - hostia;
      if (this.state.pokemon.stats.vida <= aux/2){
        document.getElementById("vida").style.backgroundColor = "yellow";
      } 
      else if (this.state.pokemon.stats.vida <= aux/4){
        document.getElementById("vida").style.backgroundColor = "red";
      }
    }

  render() {
    
    return (
     <div id={"interficie"}>
        <div id={"pokemons"}>
          <div id={"nom"}>
            <p>{this.state.pokemon.nom}</p>
            <div id={"barra"}>
              <div id={"vida"}></div>
            </div>
            <p style={{fontSize: 15}}>{this.state.pokemon.stats.vida} PS</p>
          </div>
          <div id={"nomEnemic"}>
            <p>{this.state.pokemon.nom}</p>
            <div id={"barraEnemic"}>
              <div id={"vidaEnemic"}></div>
            </div>
            <p style={{fontSize: 15}}>{this.state.pokemon.stats.vida} PS</p>
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
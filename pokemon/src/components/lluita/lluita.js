/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import getPokemon from '../pokemon';
import getMoviment from '../moviments';
import styles from './lluita.css';
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://172.24.2.92:4444/";
const socket = socketIOClient(ENDPOINT);

class App extends Component {
  state = {
    pokemonTeam : [],
    pokemonRival :[],
    render : false,
  }

  componentWillUnmount() {
    socket.close('connect');
  }

  componentDidMount(){
    const room = this.props.match.params.room;
    const nomUser = this.props.location.userId;
    const pokemons = this.props.location.pokemons;
    this.setState({
      pokemonTeam : pokemons
    })
   // console.log("GAME id =>"+room);
   //console.log("Nom =>"+nomUser);
    this.interval = setInterval(() => {
      this.setToRoom(room,nomUser, pokemons);  
    }, 500);
    }

    setToRoom(room,userId ,pokemonsJugador){
      // console.log("Room=>"+room+" User_ID=>"+userId);
       socket.emit('ROOM', { room, userId , pokemonsJugador });
        socket.on('RECEIVE_ID', (userId) => {
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
     // console.log("Aquest soc jo =>"+ this.props.location.userId);
     // console.log("Player1 =>"+ userId.player1);
     // console.log("Player2 =>"+userId.player2); 

      if(userId.player1 == this.props.location.userId){
        socket.emit('SEND_POKEMON',userId.player2)
        this.PokemonsRival()
      }else if(userId.player2 == this.props.location.userId){
        socket.emit('SEND_POKEMON',userId.player1)
        this.PokemonsRival()
      }  
    
    }

    PokemonsRival(){
      console.log("arriba?");
      socket.on('POKEMONS', (msg)=>{  
        if(this.state.pokemonRival.length == 0){
          console.log("entra i mostra aquest pokemons");
          console.log(msg);
          this.setState({pokemonRival : msg })
        }
      })
      this.setState({render : true})
    }

  render() {
    
    return (
     <div id={"interficie"}>
        <div id={"pokemons"}>
          <div id={"nom"}>
            <p>{this.state.pokemonTeam[0]?.nom}</p>
            <div id={"vida"}></div><p style={{fontSize: 15}}>{this.state.pokemonTeam[0]?.stats.vida} PS</p>
            <div id={"barra"}></div>
          </div>
          <div id={"nomEnemic"}>
            <p>{this.state.pokemonRival[0]?.nom}</p>
            <div id={"vidaEnemic"}></div><p style={{fontSize: 15}}>{this.state.pokemonRival[0]?.stats.vida} PS</p>
            <div id={"barraEnemic"}></div>
          </div>
          <img id={"spriteBack"} src={this.state.pokemonTeam[0]?.imatgeGif.back_default} />
          <img id={"spriteFront"} src={this.state.pokemonRival[0]?.imatgeGif.front_default} />
        </div>
        <div class="bottom-menu">
          <div class="battle-text text-box-left">
        </div>
      <div class="box">
        <div class="actions">
        </div>
      </div>
      </div>
     </div>
    );
  }
}

export default App;

/*
    {
      nom : '',
      imatgeBack : '',
      imatgeFront : '',
      imatgeGif :{ front_default : '' , back_default : ''},
      moviments : [],
      stats: { atack : 0 , defensa : 0 , vida : 0 , speed : 0 },

      moviment:{
        nom : '',
        tipus: {nom: '', color:''},
        descripcio:'',
        accuracy: 0,
        power: 0,
        pp : 0
      }
    },
    */
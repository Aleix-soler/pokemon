/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import styles from './lluita.css';
import socketIOClient from "socket.io-client";  
import url from '../Connections';
const ENDPOINT = url.SocketUrl;
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
    this.interval = setInterval(() => {
      this.setToRoom(room,nomUser, pokemons);  
    }, 500);
    }

    setToRoom(room,userId ,pokemonsJugador){
      // console.log("Room=>"+room+" User_ID=>"+userId);
       socket.emit('ROOM', { room, userId , pokemonsJugador });
        socket.on('RECEIVE_ID', (userId) => {
        console.log(userId);
            this.renderPokemons(userId)
      });
    }

    renderPokemons(userId){
      clearInterval(this.interval);
     // console.log("Aquest soc jo =>"+ this.props.location.userId);
     // console.log("Player1 =>"+ userId.player1);
     // console.log("Player2 =>"+userId.player2); 
        socket.emit('SEND_POKEMON',userId,this.props.match.params.room)
        this.PokemonsRival(userId)
    }


    PokemonsRival(userId){
      console.log("arriba?");
     
      socket.on('POKEMONS', (msg)=>{ 
          console.log("Missatge");
          console.log(msg)
        
        if(msg.player2 != undefined || msg.player2 != null){
          if( userId.player1 == this.props.location.userId ){          
              this.setState({pokemonRival : msg.player2})
              this.setState({render : true})
          }else if(userId.player2 == this.props.location.userId){  
              this.setState({pokemonRival : msg.player1})
              this.setState({render : true})
        }
      }
      })    
    }

    vida(hostia){
      let aux = this.state.pokemon.vida;
      this.state.percent = hostia * 100 / this.state.pokemon.stats.vida;
      document.getElementById("vida").style.marginRight = this.state.percent + "%";
      this.state.pokemon.stats.vida = this.state.pokemon.stats.vida - hostia;
      if (this.state.pokemon.stats.vida <= aux/2){
        document.getElementById("vida").style.backgroundColor = "yellow";
      } 
      else if (this.state.pokemon.stats.vida <= aux/4){
        document.getElementById("vida").style.backgroundColor = "red";
      }
    }

    enviarAtack(numMviment){
      console.log("Entra enviat Atack");
        socket.emit('SEND_ATTACK',{ moviment :numMviment, room :this.props.match.params.room});
        socket.on('ATACK',(atac)=>{
          console.log(atac);
        })
    }

  render() {
    return (
      <div id={"interficie"}>
        <div id={"pokemons"}>
          <div id={"nom"}>
            <p>{this.state.pokemonTeam[0]?.nom}</p>
            <div id={"barra"}>
              <div id={"vida"}></div>
            </div>
            {/*<div id={"puntsVida"}><p style={{fontSize: 10}}>{this.state.pokemonRival[0]?.stats.vida} PS</p></div>*/}
          </div>
          <div id={"nomEnemic"}>
            <p>{this.state.pokemonRival[0]?.nom}</p>
            <div id={"barraEnemic"}>
              <div id={"vidaEnemic"}></div>
            </div>
            {/*<div id={"puntsVida"}><p style={{fontSize: 10}}>{this.state.pokemonRival[0]?.stats.vida} PS</p></div>*/}
          </div>
          <img id={"spriteBack"} src={this.state.pokemonTeam[0]?.imatgeGif.back_default} />
          <img id={"spriteFront"} src={this.state.pokemonRival[0]?.imatgeGif.front_default} />
        </div>
        <div class="bottom-menu">
          <div class="battle-text text-box-left">
        </div>
        {this.state.render ?  
        (
        <div class="box">
          <div class="actions">
          <button onClick={()=>{this.enviarAtack(0)}}>{this.state.pokemonTeam[0]?.moviments[0] ? this.state.pokemonTeam[0]?.moviments[0].nom : 'UPS'}</button>
          <button>{this.state.pokemonTeam[0]?.moviments[1] ? this.state.pokemonTeam[0]?.moviments[1].nom : 'UPS'}</button>
          <button>{this.state.pokemonTeam[0]?.moviments[2] ? this.state.pokemonTeam[0]?.moviments[2].nom : 'UPS'}</button>
          <button>{this.state.pokemonTeam[0]?.moviments[3] ? this.state.pokemonTeam[0]?.moviments[3].nom : 'UPS'}</button>
          </div>
        </div>
        ) 
        :
        null
        }
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
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import styles from './lluita.css';
import { Redirect } from 'react-router-dom';
import socketIOClient from "socket.io-client";  
import url from '../Connections';
const ENDPOINT = url.SocketUrl;
const socket = socketIOClient(ENDPOINT);


class App extends Component {
  state = {
    pokemonTeam : [],
    pokemonRival :[],
    render : false,
    isYourTurn : true,
    selected: 0,
    rivalSelected: 0,
    guanyador: false
  }

  componentDidMount(){

    const room = this.props.match.params.room;
    const nomUser = this.props.location.userId;
    const pokemons = this.props.location.pokemons;
    const selectedProps = this.props.location.selected;

    console.log("USERID",this.props);

    this.setState({
      pokemonTeam : pokemons,
      selected: selectedProps
    })
    console.log(pokemons);
    this.interval = setInterval(() => {
      this.setToRoom(room,nomUser, pokemons);  
    }, 500);

    socket.on('ATACK',(atac)=>{
      console.log(atac);
      this.vida(atac,this.state.selected);
      if(!this.checkPS(this.state.selected)){
        let trobat = false;
        let aux;
        for (let index = 0; index < 5; index++) {
          if(this.checkPS(index) && !trobat){
            aux = index
            trobat = true;
          }
        }
        if(trobat){
          this.changeSelectedPokemon(aux);
        }else{
          this.gameOver(room, nomUser);
          this.setState({
            gameover: true,
            guanyador: false
          })
        }
      }
      this.setState({isYourTurn : true});
    });

    socket.on("GUANYADOR", info=>{
      console.log("GUANYADOR");
      console.log(info);
      this.setState({
        gameover: true,
        guanyador: true
      })
    });

    socket.on("SELECTED", (info)=>{
      console.log(info);
      this.setState({ rivalSelected: info })
      this.vida(0, this.state.rivalSelected);
      if(!this.state.isYourTurn){this.setState({isYourTurn : true})}
    })
    }

    setToRoom(room,userId ,pokemonsJugador){
      // console.log("Room=>"+room+" User_ID=>"+userId);
       socket.emit('ROOM', { room, userId , pokemonsJugador });
       console.log("ROOM=>",room,", USERID=>", userId);
        socket.on('RECEIVE_ID', (userId) => {
        console.log(userId);
        if(this.props.location.userId != userId.player1){
          this.setState({
            enemyId: userId.player1
          })
        }else{
          this.setState({
            enemyId: userId.player2
          })
        }
        console.log("ENEMY ID=>",this.state.enemyId)
        this.renderPokemons(userId);
        
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

    
    gameOver(room, userId){
      console.log("S'ha finito la partida");
      socket.emit('GAME_OVER', {room: room, userId: userId})
      socket.close('connect');
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
              this.setState({isYourTurn : false});

          }else if(userId.player2 == this.props.location.userId){  
              this.setState({pokemonRival : msg.player1})
              this.setState({render : true})
              this.setState({isYourTurn : true})
        }
      }
      })    
    } 

    vida(hostia,id){
      if(this.state.isYourTurn){
        console.log("La vida que li queda es"+  this.state.pokemonRival[id].stats.vidaQueLiQueda);
        this.state.pokemonRival[id].stats.vidaQueLiQueda -=  hostia;
      }else{
        console.log("La vida que li queda es"+  this.state.pokemonTeam[id].stats.vidaQueLiQueda);
        this.state.pokemonTeam[id].stats.vidaQueLiQueda -= hostia;
      }
    }

    checkPS(pos){
      if(this.state.pokemonTeam[pos].stats.vidaQueLiQueda <= 0){
        //No te ps
        return false;
      }else{
        return true;
      }
    }

    enviarAtack(numMviment){
      //mirar si no ha fallat l'api
      if(this.state.pokemonTeam[this.state.selected]?.moviments[numMviment] == undefined || this.state.pokemonTeam[this.state.selected]?.moviments[numMviment] == null){
        var Damage =  80;
        this.setState({isYourTurn : false})
      }else{
      //mirar si un moviment no te poder i assignar-li 50 de poder
      if(this.state.pokemonTeam[this.state.selected]?.moviments[numMviment].power <= 0){
        console.log("No te poder");
        console.log(this.state.pokemonTeam[this.state.selected].moviments[numMviment]);
        this.state.pokemonTeam[this.state.selected].moviments[numMviment].power = 50;
      }
      this.setState({isYourTurn : false})
      var Damage = 5+((((2/5 + 2) * this.state.pokemonTeam[this.state.selected]?.moviments[numMviment].power * (this.state.pokemonTeam[this.state.selected].stats.atack/this.state.pokemonRival[this.state.rivalSelected].stats.defensa))/30)+2);
      }
        
      this.vida(Damage,this.state.rivalSelected);

      console.log("Envia atac Amb un total de mal de =>" + Damage);
        socket.emit('SEND_ATTACK',{ moviment : Damage, room :this.props.match.params.room});
    }

    changeSelectedPokemon(pos){
      if(this.checkPS(pos)){
        setTimeout(()=>{  this.setState({isYourTurn : false})},10)
        socket.emit("SELECTED_POKEMONS", {room:this.props.match.params.room, userId:this.props.location.userId, selected:pos});
        this.setState({
          selected: pos
        })
        this.vida(0, pos);
      }else{
        console.log("NO PS");
      }
    }

  renderBotonsPokemons(){
      let imgHeight = "100px";
      let imgWidth = "100px";

    return(
    this.state.pokemonTeam.map((element , index) =>{
      let classe
      if(this.state.pokemonTeam[index].stats.vidaQueLiQueda<=0){
        classe = "noHP";
      }else{
        classe = "HP";
      }
      if(index != this.state.selected){
        return(
          <img class={classe} height={imgHeight} width={imgWidth} onClick={()=>{if(this.state.isYourTurn)this.changeSelectedPokemon(index)}} src={element.imatgeGif.front_default}></img>
        )
      }
    })
    )
  }
  
  render() {
    const gameOver = this.state.gameover ?
    <Redirect  to={{
      pathname: `/game_over`,
      userId: this.props.location.userId,
      enemyId: this.state.enemyId,
      guanyador: this.state.guanyador,
      perdedor: this.state.player2
    }}/>
    :
    null;
    return (
      <div id={"interficie"}>
        {gameOver}
        <div id={"myPokemons"}>
          {this.state.render ? this.renderBotonsPokemons() : null}
        </div>
        <div id={"pokemons"}>
          <div id={"nom"}>
            <div id={"informacio"}>
              <p>{this.state.pokemonTeam[this.state.selected]?.nom}</p>
            </div>
            <div id={"barra"}>
              <input type="range" class={this.state.vidaAliat} id="vol" name="vol" min="0" max={this.state.pokemonTeam[this.state.selected]?.stats.vida} value={this.state.pokemonTeam[this.state.selected]?.stats.vidaQueLiQueda}/>
            </div>
            <div id={"puntsVida"}><p style={{fontSize: 10}}>{Math.floor(this.state.pokemonTeam[this.state.selected]?.stats.vidaQueLiQueda)} PS</p></div>
          </div>
          <div id={"nomEnemic"}>
            <p>{this.state.pokemonRival[this.state.rivalSelected]?.nom}</p>
            <div id={"barraEnemic"}>
              <input type="range" class={this.state.vidaRival} id="volE" name="volE" min="0" max={this.state.pokemonRival[this.state.rivalSelected]?.stats.vida} value={this.state.pokemonRival[this.state.rivalSelected]?.stats.vidaQueLiQueda}/>
            </div>
          <div id={"puntsVida"}><p style={{fontSize: 10}}>{Math.floor(this.state.pokemonRival[this.state.rivalSelected]?.stats.vidaQueLiQueda)} PS</p></div>
          </div>
          <img id={"spriteBack"} src={this.state.pokemonTeam[this.state.selected]?.imatgeGif.back_default} />
          <img id={"spriteFront"} src={this.state.pokemonRival[this.state.rivalSelected]?.imatgeGif.front_default} />
        </div>
        <div class="bottom-menu">
          <div class="battle-text text-box-left">
        </div>
        {this.state.render ?  
        (
        <div class="box">
          {this.state.isYourTurn ?
          (
            <div class="actions">
            {/*<button onClick={() =>this.zeroPS()}>ZERO PS</button>*/}
            <button onClick={()=>{this.enviarAtack(0)}} style={this.state.pokemonTeam[this.state.selected]?.moviments[0] ? {backgroundColor: this.state.pokemonTeam[this.state.selected]?.moviments[0].tipus.color } : null}>
              {this.state.pokemonTeam[this.state.selected]?.moviments[0] ? this.state.pokemonTeam[this.state.selected]?.moviments[0].nom : 'MISSIGNO POWER'}
            </button>
            <button onClick={()=>{this.enviarAtack(1)}} style={this.state.pokemonTeam[this.state.selected]?.moviments[1] ? {backgroundColor: this.state.pokemonTeam[this.state.selected]?.moviments[1].tipus.color } : null}>
              {this.state.pokemonTeam[this.state.selected]?.moviments[1] ? this.state.pokemonTeam[this.state.selected]?.moviments[1].nom : 'MISSIGNO POWER'}
              </button>
              <button onClick={()=>{this.enviarAtack(2)}} style={this.state.pokemonTeam[this.state.selected]?.moviments[2] ? {backgroundColor: this.state.pokemonTeam[this.state.selected]?.moviments[2].tipus.color } : null}>
              {this.state.pokemonTeam[this.state.selected]?.moviments[2] ? this.state.pokemonTeam[this.state.selected]?.moviments[2].nom : 'MISSIGNO POWER'}
              </button>
              <button onClick={()=>{this.enviarAtack(3)}} style={this.state.pokemonTeam[this.state.selected]?.moviments[3] ? {backgroundColor: this.state.pokemonTeam[this.state.selected]?.moviments[3].tipus.color } : null}>
              {this.state.pokemonTeam[this.state.selected]?.moviments[3] ? this.state.pokemonTeam[this.state.selected]?.moviments[3].nom : 'MISSIGNO POWER'}
              </button>
            </div>
          ):
          (
            <div class="actions">
              <h1>Esperant el rival ...</h1>
            </div>
          )
        }
         
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
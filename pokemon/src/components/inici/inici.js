/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import style from "./inici.css";
import { Redirect } from 'react-router-dom';
import getPokemon from '../pokemon'
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://172.24.3.98:4444/";
const socket = socketIOClient(ENDPOINT);



class Inici extends Component {
  
  state = {
    pokemons : [],
    loading : true,
    error: null,
    gameId: null,
    waiting: false,
  };
  componentDidMount(){
    console.log("HEY P");
    console.log(this.props.location.userId);
    this.loadPokemons();

    socket.on('connection', () => {
      console.log('CONNECTED');
    });
  
    // TODO: this is a bug
    socket.on('START_GAME', (game) => {
      this.receiveGame(game);
      console.log("La room es =>"+game.room);
    });
  }

  //Crea la room i si no la troba amb x segons salta un error
  play(){
    socket.emit('CREAR_ROOM',{pokemons : this.state.pokemons , nom :this.props.location.userId})
    this.setState({ waiting: true }, () => {
      setTimeout(() => {
        socket.on('RECEIVE_GAME', (game) => { //Promise amb timeout
          this.receiveGame(game);
        });
      }, 500);
      this.stopWaiting = setTimeout(() => {
        socket.removeListener('RECEIVE_GAME');
        this.setState({
          error: 'Could not find an opponent at this time',
          waiting: false,
        });
        setTimeout(() => {
          this.setState({ error: null });
        }, 2000);
      }, 10000);
    });
  }
  //Un cop hi ha algu esperant va directe a la sala Creada
  receiveGame = (game) => {
    clearTimeout(this.stopWaiting);
    this.setState({ waiting: false }, () => {
      socket.removeListener('RECEIVE_GAME');
      socket.emit('JOIN_GAME', game);
    });
    console.log("Els pokemons que rep =>"); console.log(game);

    this.setState({
      gameId: game.room,
      gameNom : game.name
    });
  }
  
  async  loadPokemons(){
    for (let i = 0; i < 6; i++) {
     await getPokemon().then((res)=>{
         this.state.pokemons[i] = res
     })  
    }
    this.setState({loading : false})
}

  async reroll(pokeReroll){
    await getPokemon().then((res)=>{
      let aux = this.state.pokemons;
      aux[pokeReroll] = res;
      this.setState({pokemons : aux})
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
              src={element.imatgeGif.front_default ? element.imatgeGif.front_default : element.imatgeFront }
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
 
  onTodoChange(value){
    this.setState({
         name: value
    });
  }
  logout(){
    this.setState({
      logout: true
    })
  }
  registres(){
    this.setState({
      registres: true
    })
  }



  render() {

    const redirect = this.state.gameId ?
    <Redirect  to={{
      pathname: `/lluita/${this.state.gameId}`,
      gameId: this.state.gameId, 
      userId : this.props.location.userId,
      pokemons : this.state.pokemons,
    }}/>
    :
    null;
    const logout = this.state.logout ?
    <Redirect  to={{
      pathname: `/`,
    }}/>
    :
    null;    
    const registre = this.state.registres ?
    <Redirect  to={{
      pathname: `/registres`,
    }}/>
    :
    null;

    const buttons = this.state.waiting ? 
      <h1 id="buscarPartida">S'Esta Buscant Partida</h1> 
     :
     <div id="divButons">
      <button id="registre" onClick={()=>this.registres()}>REGISTRES</button>
      <button id="jugar" onClick={()=>this.play()}>PLAY</button>
      <button id="logout" onClick={() => this.logout()}>LOGOUT</button>
     </div>;
      
    return (
      
      <div>
        {registre}
        {logout}
        {redirect}
        <div id="logo">
          <img src="../logo.png" width="600" height="400"></img>
        </div>
        <div id="contenedor">
          {buttons}
          <div  style={{ display:'flex',flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}> 
            {this.state.loading ? null :  this.renderPokemons()} 
          </div>
        </div>
      </div>
       
    );
  }
}

export default Inici;

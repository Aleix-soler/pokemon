/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable no-unused-vars */

import React, { Component } from "react";
import style from "./inici.css";
import { Redirect } from 'react-router-dom';
import getPokemon from '../pokemon';
import socketIOClient from "socket.io-client";  
const ENDPOINT = "http://192.168.0.172:4444/";
const socket = socketIOClient(ENDPOINT);
var error = '';
var errorClase = '';



class Inici extends Component {
  
  state = {
    pokemons : [],
    loading : true,
    error: null,
    gameId: null,
    waiting: false,
    selected: 0,
  };
  componentDidMount(){
    console.log("HEY P");
    //POSAR USERID AL LOCALSTORAGE
    console.log("USERID PROPS=>", this.props.location);
    this.funcioInici();
    this.checkUSER();
    setTimeout(()=>{
      this.loadPokemons();
    },500)

    socket.on('connection', () => {
      console.log('CONNECTED');
    });
  
    // TODO: this is a bug
    socket.on('START_GAME', (game) => {
      this.receiveGame(game);
      console.log("La room es =>"+game.room);
    });
  }
  async funcioInici(){
    
  }
  //COMPROBA SI TE USERID SI NO ES AIXI ET REDIRIEGIX A L'INICI
  checkUSER(){
    console.log(this.props.location.userId)
    if(this.props.location.userId == undefined || this.props.location.userId == null){
      var jugar = document.getElementById("jugar");
      var reg = document.getElementById("registre");
      jugar.disabled = true;
      jugar.style.backgroundColor="lightgrey";
      reg.disabled = true;
      reg.style.backgroundColor="lightgrey";
      errorClase = "textError";
      error = "No tens Identificador, Torna a loginejar-te per obtenir-lo!";
    }else{
      errorClase = "";
      error = "";
    }
  }

  //Crea la room i si no la troba amb x segons salta un error
  play(){
    //BOTO CANCELAR COLOR VERMELL
    setTimeout(()=>{
      var buto = document.getElementById("cancelar");
      if(buto){
        buto.style.backgroundColor="orangered";
      }
    }, 10);
    //SOCKET
    socket.emit('CREAR_ROOM',{pokemons : this.state.pokemons , nom :this.props.location.userId})
    this.setState({ waiting: true, error: null }, () => {
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
      await getPokemon(i).then((res)=>{
        this.state.pokemons[i] = res
      })  
    }
    this.setState({loading : false})
}

  async reroll(pokeReroll){
    await getPokemon(pokeReroll).then((res)=>{
      let aux = this.state.pokemons;
      aux[pokeReroll] = res;
      this.setState({pokemons : aux})
  })  
  }
  async select(id){
    this.setState({
      selected: id
    })
  }


  renderPokemons(){
    console.log("entra");
    console.log(this.state.pokemons);
    if(this.state.pokemons != undefined && this.state.pokemons != null){
      let classe, text;
   return(

     this.state.pokemons.map((element,index)=>{
       if(index == this.state.selected){
         classe = "chosen";
         text = "selected";
       }else{
         classe = "active";
         text = "select";
       }
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
          <div class="classButons">
            <button class={classe} onClick={()=>this.select(index)}>{text}</button>
            <button class="reroll" onClick={()=>this.reroll(index)}>&#8634;</button>
          </div>
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
  cancelarBusqueda(){
    this.setState({
      waiting: false
    })
    setTimeout(()=> {
      var buto = document.getElementById("jugar");
      buto.style.backgroundColor = "limegreen";
      socket.removeListener('RECEIVE_GAME'); 
    },10);

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
    const logout = this.state.logout || this.state.check ?
    <Redirect  to={{
      pathname: `/`,
    }}/>
    :
    null;    
    const registre = this.state.registres ?
    <Redirect  to={{
      pathname: `/registres`,
      userId:  this.props.location.userId
    }}/>
    :
    null;

    const buttons = this.state.waiting ? 
      <div>
        <h1 id="buscarPartida">S'Esta Buscant Partida</h1>
        <button id="cancelar" onClick={() => this.cancelarBusqueda()}>Cancelar</button>
      </div> 
     :
     <div id="divButons">
      <button id="registre" onClick={()=>this.registres()}>REGISTRES</button>
      <button id="jugar" onClick={()=>this.play()}>PLAY</button>
      <button id="logout" onClick={() => this.logout()}>LOGOUT</button>
     </div>;
      
    return (
      
      <div id="inici">
        {registre}
        {logout}
        {redirect}
        <div id="logo">
          <img src="../logo.png" width="600" height="400"></img>
        </div>
        <div id="contenedor">
          {buttons}
          <div id={errorClase}>{error}</div>
          <div  style={{ display:'flex',flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', width: '100%'}}> 
            {this.state.loading ? null :  this.renderPokemons()} 
          </div>
        </div>
      </div>      
    );
  }
}

export default Inici;

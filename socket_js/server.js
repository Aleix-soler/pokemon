const express = require('express');
const httpServer = require('http').Server(express);
const axios = require('axios');
const util = require('util');
const serverRival = "http://127.0.0.1:3000";

var getMove = require('./pokemon_data/moviments');
var pokemonData = require('./pokemon_data/getPokemonData');
const { log } = require('console');
// const { default: getPokemon } = require('../pokemon/src/components/pokemon');

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

var vida;
var atac;
var defensa;
var test = 2;

//INFO GET POKEMON DATA
var random;
var randomHabilitat;
var pokemons = [];
var pokemonsReroll = [];
var habilitats = [];
var numExcluitPokemon = [];


io.on("connection", socket => {
    console.log("[SERVER] Nou client =>", socket.handshake.address);
    socket.on("atacar", atac => {
        enviarAtac();
        socket.emit("atac", true);
    })
    socket.on("pokemonsInici", () => {
        socket.emit("pokemonData", JSON.stringify(pokemons));
        console.log("POKEMONS ENVIATS",pokemons)
    })
    socket.on("reroll", (msg)=>{
      let posicio = msg.posicio ; 
      console.log(posicio);
      getPokemon(checkRandom()).then((msg)=>{
        console.log(msg);
        pokemons[posicio] = msg
        socket.emit("pokemons",JSON.stringify(pokemons))
      })  
       
    })

})


httpServer.listen(3000, () => {
    console.log("[SERVER] Listening at port 3000");
    getPokemondata();
})



//FUNCIONS
function calcularAtac(){

}

function infoAtac(pokeInfo){

}

function checkRandom(){
    let trobat = false;
    random = Math.floor(Math.random()*151)+1;
    for (let j = 0; j < numExcluitPokemon.length; j++) {
        if(random==numExcluitPokemon[j]){
            random = Math.floor(Math.random()*151)+1;
            numExcluitPokemon.push(random);
            trobat = true;
            checkRandom();
        }
    }
    if(!trobat){ return(random) }
}

async function getPokemondata(){
    for (let i = 0; i < 6; i++) {
        let random = checkRandom()
     await getPokemon(random).then((res)=>{
         pokemons[i] = res
     })  
    }
}

async function getPokemon(random){
    let pokemon = {}
 await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
    .then(res => {
      const response = res.data;
      pokemon.imatgeBack =response.sprites.back_default
      pokemon.imatgeFront =response.sprites.front_default
      pokemon.nom =response.name
      pokemon.moviments =  getHabilitats(response);
      pokemon.stats = getStats(response);      
    })
    return(pokemon)
}

function getHabilitats(pokemon){
    let  aux = pokemon.moves;
    let moviments = [];
    for (let i = 0; i < 4; i++) {
      let nMoviment = Math.floor(Math.random() * aux.length);
      moviments[i] = { id : nMoviment , moviment : aux[nMoviment].move.name} 
    }
    return(moviments)
}  

  function getStats(pokemon){
    let stats = {atack : 0 , defensa : 0 , vida : 0}
    pokemon.stats.forEach(element => {
      switch(element.stat.name){
        case "attack":
           stats.atack = element.base_stat
          break;
        case "defense":
          stats.defensa = element.base_stat
          break;
        case "hp":
          stats.vida = element.base_stat
          break;
      }
    });
    return(stats)
  }

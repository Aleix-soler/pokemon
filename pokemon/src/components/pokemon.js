/* eslint-disable default-case */
import axios from 'axios';
import getMoviment from './moviments';
var numExcluitPokemon = [];
var random;
const API_SERVER = "192.168.0.172";

export const getPokemon = async (pos) =>{
    let pokemon = {
            nom : '',
            imatgeBack : '',
            imatgeFront : '',
            imatgeGif :{ front_default : '' , back_default : ''},
            moviments : [],
            stats: { atack : 0 , defensa : 0 , vida : 0 , speed : 0 , vidaQueLiQueda : 0 }
    }
    random = checkRandom();
    //random = Math.floor(Math.random()*151)+1;

    let finito = false;
    let vegades = 0;
  while(!finito){
    try{
      await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
      .then(res => {
        
        const response = res.data;
        pokemon.imatgeBack =response.sprites.back_default
        pokemon.imatgeFront =response.sprites.front_default
        pokemon.nom =response.name
        console.log(response.sprites.versions["generation-v"]["black-white"].animated["back_default"]);

        if(Math.floor(Math.random()*20)+1 == 4){
          pokemon.imatgeGif.back_default = response.sprites.versions["generation-v"]["black-white"].animated["back_shiny"]
          pokemon.imatgeGif.front_default = response.sprites.versions["generation-v"]["black-white"].animated["front_shiny"]
        }else{
        pokemon.imatgeGif.back_default = response.sprites.versions["generation-v"]["black-white"].animated["back_default"]
        pokemon.imatgeGif.front_default = response.sprites.versions["generation-v"]["black-white"].animated["front_default"]
        }
        pokemon.moviments =  getHabilitats(response);
        pokemon.stats = getStats(response);
    
      })
      finito = true;
      return(pokemon)
    }catch(exception){
      //console.log(exception)
      console.log("NUMERO RANDOM ANTERIOR =>",random)
      random = checkExcep(pos);
      console.log("PETAT POKEMON")
      console.log("NUMERO RANDOM =>",random)
      vegades++;
      if(vegades == 3){
        finito = true;
      }
    }
  }
}

function checkRandom(){
  //console.log("ARRAY LENGTH =>",numExcluitPokemon.length)
  let trobat = false;
  random = Math.floor(Math.random()*151)+1;
  //console.log("Entra checkRandom");
  for (let j = 0; j < numExcluitPokemon.length; j++) {
      if(random==numExcluitPokemon[j]){
          random = Math.floor(Math.random()*151)+1;
          trobat = true;
          checkRandom();
      }
  }
  if(!trobat){ 
    if(numExcluitPokemon.length==6){
      numExcluitPokemon=[];
    }
    numExcluitPokemon.push(random);
    return(random) 
  }
}
function checkExcep(pos){
  //console.log("ARRAY LENGTH =>",numExcluitPokemon.length)
  let trobat = false;
  random = Math.floor(Math.random()*151)+1;
  //console.log("Entra checkRandom");
  for (let j = 0; j < numExcluitPokemon.length; j++) {
      if(random==numExcluitPokemon[j]){
          random = Math.floor(Math.random()*151)+1;
          trobat = true;
          checkRandom();
      }
  }
  if(!trobat){ 
    numExcluitPokemon[pos] = random;
    return(random) 
  }
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
        stats.vidaQueLiQueda = element.base_stat;
        break;
      case "speed":
        stats.speed = element.base_stat
        break;
    }
  });
  return(stats)
}

function getHabilitats(pokemon){
    let  aux = pokemon.moves;
    let moviments = [];
    for (let i = 0; i < 4; i++) {
      let nMoviment = Math.floor(Math.random() * aux.length);
       getMoviment(nMoviment).then((res)=>{
        moviments[i] = res
       })
    }
    return(moviments)
  }  

  export default getPokemon;
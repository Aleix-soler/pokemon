 function comprovarVida(state,hostia){
   console.log("Entra amb un mal de  =>"+hostia);
    console.log("es el teu turn?? =>"+state.isYourTurn);
    if(state.isYourTurn){
      console.log("La vida que li queda es"+ state.pokemonRival[state.rivalSelected].stats.vidaQueLiQueda);
        return(state.pokemonRival[state.rivalSelected].stats.vidaQueLiQueda -=  hostia)
    }else{
      console.log("La vida que li queda es"+  state.pokemonTeam[state.selected].stats.vidaQueLiQueda);
      return(state.pokemonTeam[state.selected].stats.vidaQueLiQueda -= hostia)
    }
  }

  function hasPs(vida){
    if(vida <= 0){
      return false;
    }else{
      return true;
    }
  }
  
  export { hasPs , comprovarVida}
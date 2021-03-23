
export default function comprovarDamage(numMoviment,moviment,state){

    if(moviment.moviments[numMoviment].power <= 0){
        console.log("No te poder");
        return(25);
      }
      var Damage = 5+((((2/5 + 2) * moviment.moviments[numMoviment].power * (state.pokemonTeam[state.selected].stats.atack/state.pokemonRival[state.rivalSelected].stats.defensa))/30)+2);
      return(Damage)
    }


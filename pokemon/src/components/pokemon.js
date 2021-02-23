import axios from 'axios';

export const getPokemon = async (random) =>{
    let pokemon = {
            nom : '',
            imatge : '',
            moviments : [],
            stats: { atack : 0 , defensa : 0 , vida : 0 }
    }
  await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
  .then(res => {
    const response = res.data;
    console.log(response);
    pokemon.imatge =response.sprites.front_default
    pokemon.nom =response.name
    pokemon.moviments =  getHabilitats(response);
    pokemon.stats = getStats(response);

  })
  return(pokemon)
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
  console.log(stats);
  return(stats)
}

function getHabilitats(pokemon){
    let  aux = pokemon.moves;
    let moviments = [];
    for (let i = 0; i < 4; i++) {
      let nMoviment = Math.floor(Math.random() * aux.length);
      moviments[i] = { id : nMoviment , moviment : aux[nMoviment]} 
    }
    return(moviments)
  }  

  export default getPokemon;
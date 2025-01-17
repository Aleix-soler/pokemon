const axios = require('axios');
const TYPE_COLORS = {
    bug: 'B1C12E',
    dark: '4F3A2D',
    dragon: '755EDF',
    electric: 'FCBC17',
    fairy: 'F4B1F4',
    fighting: '823551D',
    fire: 'E73B0C',
    flying: 'A3B3F7',
    ghost: '6060B2',
    grass: '74C236',
    ground: 'D3B357',
    ice: 'A3E7FD',
    normal: 'C8C4BC',
    poison: '934594',
    psychic: 'ED4882',
    rock: 'B9A156',
    steel: 'B5B5C3',
    water: '3295F6'
  };

module.exports = {
    getMoviment: async function (random) {
        let moviment = {
              tipus: {nom: '', color:''},
              descripcio:'',
              accuracy: 0,
              power: 0,
              pp : 0
        }
      await axios.get(`https://pokeapi.co/api/v2/move/${random}`)
      .then(res => {
        const response = res.data;
        moviment.nom = response.name;
        moviment.tipus = {nom:response.type.name, color : "#"+TYPE_COLORS[response.type.name]};
        moviment.power = response.power;
        moviment.pp = response.pp;
        moviment.accuracy = response.accuracy;
        moviment.descripcio = response.flavor_text_entries[0]?.flavor_text;
      })
      //console.log("movement done");
      return(moviment)
    }
}
const axios = require('axios');

module.exports = {
    getStats:  async function(pokemon){
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
}
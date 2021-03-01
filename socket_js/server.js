const express = require('express');
const httpServer = require('http').Server(express);
const axios = require('axios');
const util = require('util');
const serverRival = "http://172.24.1.0:3000";

var getMove = require('./pokemon_data/moviments');
var pokemonData = require('./pokemon_data/getPokemonData');

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
    socket.on("rerollPokemon", () => {
        pokemons = [];
        getPokemonData().then(() => {
            socket.emit("pokemonData", JSON.stringify(pokemons));
        });
    })
    setInterval(() => {
        //socket.emit("FromAPI", test);
    }, 1000);
})


httpServer.listen(3000, () => {
    console.log("[SERVER] Listening at port 3000");
    getPokemondata();
})



//FUNCIONS

function checkRandom(){
    random = Math.floor(Math.random()*151)+1;
    for (let j = 0; j < numExcluitPokemon.length; j++) {
        if(random==numExcluitPokemon[j]){
            random = Math.floor(Math.random()*151)+1;
            numExcluitPokemon.push(random);
            checkRandom();
        }
    }
}

function triarHabilitats(pokemon, i){
    let aux = pokemon.moves;
    randomHabilitat = Math.floor(Math.random()*aux.length);
    habilitats.push(aux[randomHabilitat]);
}

async function getPokemondata(){
    for (let i = 0; i < 6; i++) {
        checkRandom();
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
        .then(res => {
            let pokemon = res.data;
            triarHabilitats(pokemon, i);
            numExcluitPokemon.push(random);
            getMove.getMoviment(randomHabilitat).then((moviment) => {
                pokemonData.getStats(pokemon).then((stats) => {
                    pokemons.push({"nom": pokemon.name, "img": pokemon.sprites.front_default, "moviment": moviment, "stats":stats});
                })
            })
        })
    }
}
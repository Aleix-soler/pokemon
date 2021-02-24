const express = require('express');
const httpServer = require('http').Server(express);
const axios = require('axios');
const util = require('util');

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});


var vida;
var atac;
var defensa;
var test = 2;
var random;
var pokemons = [];
var habilitats = [];
var numExcluitPokemon = [];

io.on("connection", socket => {
    getPokemondata();
    console.log("new client");
    socket.on("infoPokemon", valor => {
        vida = valor[0];
        atac = valor[1];
        defensa = valor[2];
    });
    setInterval(() => {
        socket.emit("FromAPI", test);
    }, 1000);
})

function checkRandom(){
    random = Math.floor(Math.random()*151)+1;
    for (let j = 0; j < numExcluitPokemon.length; j++) {
        if(random==numExcluitPokemon[j]){
            random = Math.floor(Math.random()*151)+1;
            numExcluitPokemon.push(random);
            checkRandom();
        }
    }
    //console.log("random checked");
}

function triarHabilitats(pokemon, i){
    let aux = pokemon.moves;
    habilitats.push(aux[Math.floor(Math.random()*aux.length)]);
}

async function getPokemondata(){
    for (let i = 0; i < 3; i++) {
        checkRandom();
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${random}`)
        .then(res => {
            let pokemon = res.data;
            triarHabilitats(pokemon, i);
            numExcluitPokemon.push(random);
            pokemons.push({"nom": pokemon.name, "img": pokemon.sprites.front_default, "habilitats": habilitats[i]});
        })
    }
    console.log(pokemons);
    console.log(numExcluitPokemon);
}

httpServer.listen(3000, () => {
    console.log("Listening at port 3000");
})
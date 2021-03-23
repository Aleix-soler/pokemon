const { Socket } = require('dgram');
const express = require('express');
const httpServer = require('http').Server(express);

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
var pokemons =[]
var pokemonSelected=[]
var clientRooms = []


io.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED');
  

  socket.on('CREAR_ROOM', (game) => {
    console.log('GAME RECEIVED', game.nom);
    game.room = Math.floor(Math.random() * 100000000); 
    io.emit('RECEIVE_GAME', game);
  });

  socket.on('JOIN_GAME', (data) => {
     io.emit('START_GAME', data.game);
  })

  socket.on('ROOM', (data) => {
    const { room, userId  } = data;
   // console.log("L'userId =>"+userId+"Envia els pokemons"+data.pokemonsJugador);
    if( typeof clientRooms["Room"+room]?.player1 === 'undefined' ){
      clientRooms["Room"+room] = {player1 : userId , player2 : '' };
      pokemons["Team"+userId] = data.pokemonsJugador;
      pokemonSelected["Pokemon"+userId] = data.selected
    }else if(clientRooms["Room"+room].player2 == ''){
      clientRooms["Room"+room].player2 = userId ;
      pokemons["Team"+userId] = data.pokemonsJugador;
      pokemonSelected["Pokemon"+userId] = data.selected
    }
  
    socket.join(room);
    socket.emit('RECEIVE_ID', clientRooms["Room"+room]);
    console.log(`USER ${userId} JOINED ROOM #${room}`);
  });

  
  socket.on('SEND_POKEMON',(userId,room)=>{
    console.log("Arriba la peticio?");
    console.log("Here"+pokemonSelected["Pokemon"+userId.player1]);
    socket.join(room);
    io.to(room).emit('POKEMONS',
    { player1:pokemons["Team"+userId.player1],
      player1Pokemon: pokemonSelected["Pokemon"+userId.player1],
      player2:pokemons["Team"+userId.player2],
      player2Pokemon: pokemonSelected["Pokemon"+userId.player2]
    })
   // io.emit('POKEMONS',{player1:pokemons["Team"+userId.player1],player2:pokemons["Team"+userId.player2]})
  })
  
  socket.on('SEND_ATTACK',data =>{
    console.log(data.moviment);
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("ATACK",data.moviment)
  })

  socket.on('SELECTED_POKEMONS', data => {
    console.log(data.userId);
    console.log(data.selected);
    console.log(data.room)
    socket.broadcast.to(data.room).emit("SELECTED", (data.userId, data.selected));
  })  
  
  socket.on('GAME_OVER', data => {
    console.log(data)
    console.log("GAME OVER")
    socket.broadcast.to(data.room).emit("GUANYADOR", data.userId);
  })
  
});

httpServer.listen(4444, () => {
    console.log("[SERVER] Listening at port 4444");
})

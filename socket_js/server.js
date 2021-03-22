const { Socket } = require('dgram');
const express = require('express');
const httpServer = require('http').Server(express);

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});
var currentRoomId
var pokemons =[]
var clientRooms = []
io.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED');
  // here you can start emitting events to the client
  socket.on('CREAR_ROOM', (game) => {
    console.log('GAME RECEIVED', game.nom);
    game.room = Math.floor(Math.random() * 100000000); 
    io.emit('RECEIVE_GAME', game);
  });

  socket.on('JOIN_GAME', (game) => {
   // socket.join(game.room)
   console.log(game);
   pokemons["Team"+game.nom] = game.pokemons;
     io.emit('START_GAME', game);
  })

  socket.on('ROOM', (data) => {
    // console.log(data);
    const { room, userId  } = data;
   // console.log("L'userId =>"+userId+"Envia els pokemons"+data.pokemonsJugador);
    if( typeof clientRooms["Room"+room]?.player1 === 'undefined' ){
      clientRooms["Room"+room] = {player1 : userId , player2 : '' };
      pokemons["Team"+userId] = data.pokemonsJugador;
    }else if(clientRooms["Room"+room].player2 == ''){
      clientRooms["Room"+room].player2 = userId ;
      pokemons["Team"+userId] = data.pokemonsJugador;
    }
  
    socket.join(room);
    socket.emit('RECEIVE_ID', clientRooms["Room"+room]);
    console.log(`USER ${userId} JOINED ROOM #${room}`);
  });

  
  socket.on('SEND_POKEMON',(userId,room)=>{
    console.log("Arriba la peticio?");
    console.log(userId);
    console.log(room);
    socket.join(room);
    io.to(room).emit('POKEMONS',{player1:pokemons["Team"+userId.player1],player2:pokemons["Team"+userId.player2]})
   // io.emit('POKEMONS',{player1:pokemons["Team"+userId.player1],player2:pokemons["Team"+userId.player2]})
  })
  
  socket.on('SEND_ATTACK',data =>{
    //console.log(data)
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

/*

socket.on('SEND_POKEMON',(userId)=>{
    console.log("Arriba la peticio?");
    console.log(userId);
    //console.log(pokemons[userId]);
    io.emit('POKEMONS',pokemons["Team"+userId])
  })
  */

/*

socket.on('SEND_POKEMON',(userId)=>{
    console.log("Arriba la peticio?");
    console.log(userId);
    //console.log(pokemons[userId]);
    io.emit('POKEMONS',pokemons["Team"+userId])
  })
  */
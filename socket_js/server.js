const express = require('express');
const httpServer = require('http').Server(express);

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

var pokemons =[]
var clientRooms = []
io.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED');
  // here you can start emitting events to the client
  socket.on('CREAR_ROOM', (game) => {
    console.log('GAME RECEIVED', game.nom);
    game.room = Math.floor(Math.random() * 100000000);
    console.log( "Nom array =>"+game.nom);
    pokemons[game.nom] = game.pokemons;
    
    io.emit('RECEIVE_GAME', game);
  });

  socket.on('JOIN_GAME', (game) => {
   // socket.join(game.room)
     io.emit('START_GAME', game);
  })

  socket.on('MOVE_PIECE', (data) => {
    console.log('RECEIVED MOVE', data);
    io.emit('PUSH_MOVE', data);
  });

  socket.on('ROOM', (data) => {
    const { room, userId } = data;
    if( typeof clientRooms["Room"+room]?.player1 === 'undefined' ){
      clientRooms["Room"+room] = {player1 : userId , player2 : '' }; 
    }else if(clientRooms["Room"+room].player2 == ''){
      clientRooms["Room"+room].player2 = userId ;
    }
    console.log( clientRooms["Room"+room]);
    socket.join(room);
    socket.emit('RECEIVE_ID', clientRooms["Room"+room]);
    console.log(`USER ${userId} JOINED ROOM #${room}`);
  });
  socket.on('SEND_POKEMON',(userId)=>{
    console.log(userId);
    console.log(pokemons[userId]);
    io.emit('POKEMONS',pokemons[userId])
  })

  socket.on('SELECT_PIECE', (data) => {
    io.emit('PUSH_SELECT_PIECE', data);
  });


  socket.on('SET_IDS', (ids) => {
    io.emit('RECEIVE_IDS', ids);
  })

});


httpServer.listen(4444, () => {
    console.log("[SERVER] Listening at port 4444");
})


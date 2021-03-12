const express = require('express');
const httpServer = require('http').Server(express);

const io = require('socket.io')(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

var pokemons =[]

io.on('connection', (socket) => {
  console.log('SOCKET IS CONNECTED');
  // here you can start emitting events to the client
  socket.on('CREAR_ROOM', (game) => {
    console.log('GAME RECEIVED', game.nom);
   
    pokemons[game.nom] = game.pokemons;
    game.room = Math.floor(Math.random() * 100000000);
    io.emit('RECEIVE_GAME', game);
  });

  socket.on('JOIN_GAME', (game) => {
   // socket.join(game.room)
    io.in(game.room).emit('PROVA',game.nom)
    io.emit('START_GAME', game);
  })

  socket.on('MOVE_PIECE', (data) => {
    console.log('RECEIVED MOVE', data);
    io.emit('PUSH_MOVE', data);
  });

  socket.on('ROOM', (data) => {
    const { room, userId } = data;
    console.log('INCOMING ROOM', room);
    socket.join(room);
    socket.emit('RECEIVE_ID', userId);
    console.log(`USER ${userId} JOINED ROOM #${room}`);
  });

  socket.on('PROVES' , (data) =>{
    console.log("Entra"+data.room);
    socket.to(data.room).emit('SEND',data.id)
  })
 
  socket.on('SET_IDS', (ids) => {
    io.emit('RECEIVE_IDS', ids);
  })

});


httpServer.listen(4444, () => {
    console.log("[SERVER] Listening at port 4444");
})


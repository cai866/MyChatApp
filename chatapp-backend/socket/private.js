module.exports = function (io) {
    io.on('connection', socket => {
        socket.on('join chat', data => { //when receive refresh event from client, server will send a refresh page event back to client
            socket.join(data.room1);
            socket.join(data.room2);
         
        });
   

        socket.on('start_typing', data => {
            io.to(data.receiver).emit('is_typing', data);
        });

        socket.on('stop_typing', data => {
            io.to(data.receiver).emit('has_stopped_typing', data);
        });


    });
};
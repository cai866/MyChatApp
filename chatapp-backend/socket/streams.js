module.exports = function (io, User, _) {
    const user = new User();
    io.on('connection', socket => {
        socket.on('refresh', data => { //when receive refresh event from client, server will send a refresh page event back to client
            io.emit('refreshPage', {});
        });

        socket.on('online', data => { //when receive refresh event from client, server will send a refresh page event back to client
            socket.join(data.room);
            user.EnterRoom(socket.id, data.user, data.room);
            const list = user.getList(data.room);
            io.emit('usersOnline', _.uniq(list));
        });

        socket.on('disconnect', () => {
            const user = userData.removeUser(socket.id);
            if(user) {
                const userArray = userData.getList(user.room);
                const arr = _uniq(userArray);
                console.log(arr);
                _.remove(arr, n => n===user.name);
                io.emit('usersOnline', arr);
            }
        });
    });
};
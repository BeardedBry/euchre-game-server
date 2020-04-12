var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/proto', function(req, res){
    res.sendFile(__dirname + '/indexProto.html');
});

app.use('/static', express.static('public'))

// chat namespace
const chat = io.of('/chat');

// io socket
chat.on('connection', function(socket){
    console.log('a user has connected');

    // on a user disconnecting
    socket.on('disconnect', function(){
        //console.log('disconnected');
        chat.clients((error, clients) => {
            if (error) throw error;
            //console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
            const removedUser = removeUser(clients);
            chat.emit('user left', removedUser, users);
        });
    });

    // receive 'user joined' 
    socket.on('user joined', function(userObj){
        console.log(`${userObj.name} has joined`)
        addUser(userObj);
        chat.emit('user joined', userObj, users);
    });

    // receive 'chat message' 
    socket.on('chat message', function(msgObject){
        console.log(msgObject);
        chat.emit('all msg', msgObject); // sends to all connected sockets.
    });


    // room functions //

    // join room
    socket.on('join', function(roomNum){
        console.log('user wants to join room:', roomNum);
        socket.join(roomNum);
    })

    // leave room
    socket.on('leave', function(roomNum){
        console.log('user wants to leave room:', roomNum);
        socket.leave(roomNum);
    });

    socket.on('room message', function(roomNum){
        chat.to(roomNum).emit('ping room', roomNum);
    });

});


const addUser = (user) => {
    users.push(user);
}

const removeUser = (clients) => {
    try{
        var currentUsers = users.map(user => user.id);
        var disconnectId = compare(currentUsers, clients);
        disconnectedIndex = currentUsers.findIndex((userId) => userId === disconnectId);
        //console.log('disconnectedIndex: ', disconnectedIndex);

        var [removedUser] = users.splice(disconnectedIndex, 1);
        console.log('disconnected: ' + removedUser.name);
        return removedUser;
    }catch(e){
        console.error('trouble removing user',e);
    }
}

const port = 3005;
http.listen(port, function(){
    console.log(`listening on port ${port}`);
});


// helper functions //

// compare two arrays, return element that is missing.
function compare(arr1, arr2){
    var nonmatch;
    for(let i = 0; i < arr1.length; i++){
        let missing = arr2.filter((a2) => arr1[i] === a2);
        if(!missing.length){
            nonmatch = arr1[i];
            break;
        }
    }
    //console.log('non match:', nonmatch);
    return nonmatch;
}
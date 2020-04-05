var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const users = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'))

io.on('connection', function(socket){
    console.log('a user has connected');

    // on a user disconnecting
    socket.on('disconnect', function(){
        console.log('disconnected');
        io.clients((error, clients) => {
            if (error) throw error;
            //console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
            const removedUser = removeUser(clients);
            io.emit('user left', removedUser, users);
        });
        //io.emit('user left', users);
    });

    // recieve 'user joined' 
    socket.on('user joined', function(userObj){
        console.log(`${userObj.name} has joined`)
        addUser(userObj);
        io.emit('user joined', userObj, users);
    });

    // socket.on('user left', function(){
    //     console.log('user has left');
    // })

    // recieve 'chat message' 
    socket.on('chat message', function(msgObject){
        console.log(msgObject);
        io.emit('all msg', msgObject); // sends to all connected sockets.
    });
});


const addUser = (user) => {
    users.push(user);
}

const removeUser = (clients) => {
    var currentUsers = users.map(user => user.id);
    var disconnectId = compare(currentUsers, clients);
    disconnectedIndex = currentUsers.findIndex((userId) => userId === disconnectId);
    
    var [removedUser] = users.splice(1,disconnectedIndex);
    console.log('disconnected: ' + removedUser.name);
    return removedUser;
}

// compare two arrays
function compare(arr1, arr2){
    var nonmatch;
    for(let i = 0; i < arr1.length; i++){
        let missing = arr2.filter((a2) => arr1[i] === a2);
        if(!missing.length){
            nonmatch = arr1[i];
            break;
        }
    }
    return nonmatch;
}


http.listen(3005, function(){
    console.log('listening on port 3000');
});
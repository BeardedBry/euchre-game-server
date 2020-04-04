var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use('/static', express.static('public'))

io.on('connection', function(socket){
    console.log('a user has connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    // recieve 'user joined' 
    socket.on('user joined', function(userObj){
        console.log(`${userObj.user} has joined`)
        io.emit('user joined', userObj);
    })

    // recieve 'chat message' 
    socket.on('chat message', function(msgObject){
        console.log(msgObject);
        io.emit('all msg', msgObject); // sends to all connected sockets.
    })
})

http.listen(3005, function(){
    console.log('listening on port 3000');
});
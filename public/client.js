/*
TODO

 - set a dn (display: none) class on everything at the start except the nameForm
 - remove these classes on submission of name form.
 - investigate storing user names and profiles. persistant data.
 - Join a new io namespace for joining a game.

*/


//(function(){
    var socket = io('/chat');
    var messageUl = document.querySelector('#messages');
    var onlineUl = document.querySelector('#online-ul');
    var chatForm = document.querySelector('#chatForm');
    var gameTables = document.querySelectorAll("#game-ul button");
    var userName = 'Brian';
    var userList = [];


    // join a game
    function joinRoom(room){
        socket.emit('join room', room);
    }

    function leaveRoom(room){
        socket.emit('leave room', room);
    }

    function roomTest(){
        //console.log('you are in room!')
        socket.emit('room');
    }

    socket.on('room one event', function(){
        console.log('message to users in room 1!');
    });
    
    // Choose display name
    // document.querySelector('#nameForm').addEventListener('submit', function setName(e){
    //     e.preventDefault();
    //     var nameInput = this.querySelector('#name');
    //     if(nameInput.value.length > 0){
    //         userName = nameInput.value;
    //         console.log('name set to ' + userName);
    //         document.querySelector('#wrapper').style.display = 'none';
    //         document.querySelector('#main').style.display = 'block';
    //         document.body.style.backgroundColor = '#EEE';
    //         socket.emit('user joined', {
    //             name: userName,
    //             id: socket.id
    //         });
    //         document.querySelector('#m').focus();
    //         return this.removeEventListener('submit', setName);
    //     }
    // });

    setTimeout(()=>{
        socket.emit('user joined', {
            name: userName,
            id: socket.id
        });
    },500)

    // Send message
    chatForm.addEventListener('submit', function(e){
        e.preventDefault();
        var msgInput = this.querySelector('#m');
        socket.emit('chat message', {
            message: msgInput.value,
            name: userName,
            time: new Date()
        });
        // do something
        msgInput.value = '';
    });

    // Receive user joined
    socket.on('user joined', function(userObj, users){
        var liSpan = newLi(`<span class="anouncement-user">${userObj.name}</span> has joined the chat.`,['anouncement']);
        console.log('user joined', userObj);
        //console.log(users);
        userList = users;
        updateOnlineUi();
        messageUl.appendChild(liSpan);
    })

    // user left
    socket.on('user left', function(removedUser, users){
        var liSpan = newLi(`<span class="anouncement-user">${removedUser.name}</span> has left the chat.`,['anouncement']); 
        userList = users;
        updateOnlineUi();
        messageUl.appendChild(liSpan);
    });

    // Receive Message
    socket.on('all msg', function(msgObject){
        var time = handleTime(msgObject.time);
        var li = newLi(`<strong>${msgObject.name}</strong>: ${msgObject.message} <span class="message-time">${time}</span>`);
        messageUl.appendChild(li);
    });

    // return formatted time
    function handleTime(date){
        var today = new Date(date);
        var hour = today.getHours();
        var minutes = today.getMinutes();

        if(minutes < 10){
            minutes = '0' + minutes;
        }
        var meridiem = 'pm';

        if (hour > 12){
            hour = hour - 12;
        }else{
            meridiem = 'am';
        }
        return (hour + ":" + minutes + ' ' + meridiem);
    }


    // UI functions

    // build <li>
    function newLi(html, classes){
        var li = document.createElement('LI');
        li.innerHTML = html;

        if(classes && classes.length){
            classes.map(function(className){
                li.classList.add(className);
            });
        }

        return li;
    }

    function updateOnlineUi(){
        // remove old list.
        var oldList = onlineUl.querySelectorAll('li');
        oldList.forEach(function(item){
            onlineUl.removeChild(item);
        });
        // make new list
        userList.map(function(user){
            let li = newLi(`${user.name}`);
            onlineUl.appendChild(li);
        });
    }

//})();
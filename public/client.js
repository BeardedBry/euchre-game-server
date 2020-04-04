(function(){
    var socket = io();
    var messageUl = document.querySelector('#messages');
    var chatForm = document.querySelector('#chatForm');
    var userName = '';
    
    // Choose display name
    document.querySelector('#nameForm').addEventListener('submit', function setName(e){
        e.preventDefault();
        var nameInput = this.querySelector('#name');
        if(nameInput.value.length > 0){
            userName = nameInput.value;
            console.log('name set to ' + userName);
            document.querySelector('#name-screen').style.display = 'none';
            document.querySelector('#chat-screen').style.display = 'block';
            document.body.style.backgroundColor = '#EEE';
            socket.emit('user joined', {
                user: userName
            });
            return this.removeEventListener('submit', setName);
        }
    });

    // Send message
    chatForm.addEventListener('submit', function(e){
        e.preventDefault();
        var msgInput = this.querySelector('#m');
        socket.emit('chat message', {
            message: msgInput.value,
            user: userName
        });
        // do something
        msgInput.value = '';
    });

    // Recieve user joined
    socket.on('user joined', function(userObj){
        var liSpan = newLi(`<span class="anouncement-user">${userObj.user}</span> has joined the chat.`,['anouncement']);
        console.log('user joined', userObj);
        messageUl.appendChild(liSpan);
    })

    // Recieve Message
    socket.on('all msg', function(msgObject){
        //var li = document.createElement('LI');
        //li.innerHTML = `<strong>${msgObject.user}</strong>: ${msgObject.message}`;
        var li = newLi(`<strong>${msgObject.user}</strong>: ${msgObject.message}`);
        messageUl.appendChild(li);
    });


    // UI

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

})();
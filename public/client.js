(function(){
    var socket = io();
    var messageUl = document.querySelector('#messages');
    var chatForm = document.querySelector('#chatForm');
    var userName = '';
    
    document.querySelector('#nameForm').addEventListener('submit', function setName(e){
        e.preventDefault();
        var nameInput = this.querySelector('#name');
        if(nameInput.value.length > 0){
            userName = nameInput.value;
            console.log('name set to ' + userName);
            document.querySelector('#name-screen').style.display = 'none';
            document.querySelector('#chat-screen').style.display = 'block';
            document.body.style.backgroundColor = '#EEE';
            return this.removeEventListener('submit', setName);
        }
    });


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

    socket.on('all msg', function(msgObject){
        var li = document.createElement('LI');
        li.innerHTML = `<strong>${msgObject.user}</strong>: ${msgObject.message}`;
        messageUl.appendChild(li);
    });
})();
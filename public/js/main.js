const form = document.getElementById("chat-form");
const chatDiv = document.querySelector(".chat-messages-inner");
const chatDiv2 = document.querySelector(".chat-messages");

const roomName = document.getElementById("room-name");
const usersUL = document.getElementById("users");
const typer = document.getElementById('typers')
const socket = io();
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});


//Join room
socket.emit("joinRoom", { username, room });
socket.on("roomUsers", ({ room, users }) => {
  typer.innerHTML = ''
  displayRoomName(room);
  displayUsers(users);
  users.forEach(user => {
    typer.innerHTML+=`<li id='${user.username}' style="display:none;"></li>`
  });

});

//Handling incoming messages
socket.on("message", (message) => {
  if(message.username!=='ChatBox Bot'){
    li =  document.getElementById(message.username)
    li.style.display = 'none'
    li.innerHTML = ''
  }
  if(message.username!==username){
    outputMessage(message, ['outer'] , message.username,'other')
    chatDiv2.scrollTop = chatDiv2.scrollHeight;
    console.log(chatDiv2.scrollTop);

  } else {
    outputMessage(message, ['outer', 'right'], 'You', 'self');
    chatDiv2.scrollTop = chatDiv2.scrollHeight;
    console.log(chatDiv2.scrollTop);
}
  chatDiv2.scrollTop = chatDiv2.scrollHeight;
});
socket.on("prev_messages", messages=>{
  messages.forEach((message)=>{
    msg = {
      text: message.message,
      time: message.time,
      name: message.name
    }
    console.log(message);
    if(message.name!==username){
      outputMessage(msg, ['outer'] , msg.name,'other')
      chatDiv2.scrollTop = chatDiv2.scrollHeight;
      console.log(chatDiv2.scrollTop);
  
    } else {
      outputMessage(msg, ['outer', 'right'], 'You', 'self');
      chatDiv2.scrollTop = chatDiv2.scrollHeight;
      console.log(chatDiv2.scrollTop);
  }
    chatDiv2.scrollTop = chatDiv2.scrollHeight;
  });
  })

//Handling currently typing
socket.on("typing_display", ({username, message}) => {
  li = document.getElementById(`${username}`)
  li.style.color = '#634f4f'
  if (message!=='') {
    li.style.display='list-item'
    li.innerHTML = `<i>${username} is typing...</i>`
  } else {
    li.style.display='none'
    li.innerHTML = ''
  }
});


//Listener for form submissions
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMsg", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Listener for typing event
form.addEventListener("input", (e) => {
  if (e.target.value !== "") {
    socket.emit("typing", { username, room });
  } else {
    socket.emit("typing_remove", room );
  }
});

// Function to output message to screen
function outputMessage(message, classes, name, classname ) {
    const div = document.createElement("div");
    div.classList.add(...classes)
    div.innerHTML = `<div class="message ${classname}"><p class="meta">${name} <span>${message.time}</span></p>
      <p class="text">
          ${message.text}
      </p></div>`;
    chatDiv.appendChild(div);
}

//Populates room info
function displayRoomName(room) {
  roomName.innerText = room;
}

//Populates user info
function displayUsers(users) {
  usersUL.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    usersUL.appendChild(li);
  });
}

function changeLeave(){
  const leaveBtn = document.querySelector('.btn-leave')
  if(window.innerWidth<=340){
    leaveBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>'
  } else {
    leaveBtn.innerHTML = 'Leave Room'
  }
}
changeLeave()
window.addEventListener('resize', changeLeave)

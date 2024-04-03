const socket = io();

var username;
var chats = document.querySelector(".chats");
var users_list = document.querySelector(".users-list");
var users_count = document.querySelector(".users-count");
var msg_send = document.querySelector("#user-send");
var user_msg = document.querySelector("#user-msg");

// Taking user name
do {
  username = prompt("Enter your Name: ");
} while (!username);

// It will be called when new user is joined
socket.emit("new-user-joined", username);

// Notifying that user is joined

socket.on("user-connected", (socket_name) => {
  userJoinLeft(socket_name, "joined");
});

// function to create joined/left status div

function userJoinLeft(name, status) {
  // create a new <div> element
  let div = document.createElement("div");

  // user-join name ki class add karo so that yaha new <div> main same styling lag jai as 'user-join' class
  div.classList.add("user-join");
  // content that we will display in the <div>
  let content = `<p><b>${name}</b> ${status} the chat</p>`;
  div.innerHTML = content; // div ke ander kya likha hoga add kardo in form of HTML
  // jabhi koi neya user join hoga ek new div create hoke content add hoga and chats query Selector main append hojaiga new div
  chats.appendChild(div);
  // jabhi koi neya message aye screen upar chalte jai and neya message neeche ate jai
  chats.scrollTop = chats.scrollHeight;
}

// Notifying that user has left
socket.on("user-disconnected", (socket_name) => {
  userJoinLeft(socket_name, "left");
});

// For updating user list and user count

socket.on("user-list", (users) => {
  // user-list <div> ke ander contetnt pura gayeb ho jaiga
  users_list.innerHTML = "";
  // values nikal rahe hai users ke and values = user's name store kar rahe hai in users_arr
  users_arr = Object.values(users);
  for (i = 0; i < users_arr.length; i++) {
    // creating a <p> tag
    let p = document.createElement("p");
    // har bar har name ke liye ek <p> tag banega and inner text hojaiga user's name jo array main store hai
    p.innerText = users_arr[i];
    // users_list <div> class mai values bhara do ek ek name
    users_list.appendChild(p);
  }
  users_count.innerHTML = users_arr.length;
});

// For sending message

// jab button pe click karein to input field main jo likha hai wo chala jaiga server ke pass

msg_send.addEventListener("click", () => {
  // Object variable mai username and message of user store hoga
  let data = {
    user: username,
    msg: user_msg.value,
  };
  // message not blank
  if (user_msg.value != "") {
    appendMessage(data, "outgoing"); // outgoing taki pata chale message bhej rahe hai
    // server ko emit/message kardo ki ek data/message arha hai
    socket.emit("message", data);
    // user input field value blank kardo
    user_msg.value = "";
  }
});
function appendMessage(data, status) {
  // create a new <div> tag
  let div = document.createElement("div");

  // message name ki class add karo so that yaha new <div> main same styling lag jai as 'message' class
  div.classList.add("message", status);

  // content that we will display in the <div>

  let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
  // div ke ander kya likha hoga add kardo in form of HTML
  div.innerHTML = content;

  // jabhi koi neya message bhejega ek new div create hoke content add hoga and chats query Selector main append hojaiga new div
  chats.appendChild(div);

  // jabhi koi neya message aye screen upar chalte jai and neya message neeche ate jai
  chats.scrollTop = chats.scrollHeight;
}

// Server ka broadcast hua message sare clients dekh paye
socket.on("message", (data) => {
  appendMessage(data, "incoming");
});

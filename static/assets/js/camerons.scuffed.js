let ws; // global ws to be set on load, so its accessible everywhere

//// WEBSOCKET SETUP AND LISTENERS ////

// create our websocket connection on page loading
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8765");

  // on load send message to websocket, to check IMAGE_STATE state
  ws.onopen = () => {
    ws.send("CHECK_IMAGE");
  };

  // What to do when getting a message from the server
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "chat") {
      appendText(message.message, message.room);
    }

    // if our message has to do with current image states, run our function
    if (message.type === "state") {
      check_state();
    }

    function check_state() {
      document
        .getElementById("bg")
        .classList.toggle("active", !message.image_state);
      console.log("Shared Image State:", message.image_state);
    }
  });
});

// add click listener onto our witness button, on press change bg of page for EVERYONE (websockets)
document.getElementById("li-witness").addEventListener("click", witness);
function witness() {
  // send message to backend telling it our image changed
  ws.send("IMAGE_STATE");
}

//// MONKEY CHAT ////

//////  Chatrooms  //////
// what to do upon opening chat 1
document.getElementById("chat1_btn").addEventListener("click", openChat1);
function openChat1() {
  // setup divs
  // hide chat 2
  document.getElementById("chat2_div").setAttribute("hidden", "");
  // show chat 1
  document.getElementById("chat1_div").removeAttribute("hidden");

  // send the div of the chat were typing in along with the users text to our function that handles submitting text
  let chat1_box = document.getElementById("chat1_div");
  submitOnEnter("chat1_txt", "chat1_div");
}

// what to do upon opening chat 2
document.getElementById("chat2_btn").addEventListener("click", openChat2);
function openChat2() {
  // setup divs
  // hide chat 1
  document.getElementById("chat1_div").setAttribute("hidden", "");
  // show chat 2
  document.getElementById("chat2_div").removeAttribute("hidden");

  // send the div of the chat were typing in along with the users text to our function that handles submitting text
  let chat1_box = document.getElementById("chat2_div");
  submitOnEnter("chat2_txt", "chat2_div");
}

//////  Sending Text To Users  //////
// just a function that takes the id of an input field for the chatroom were in, and the div our our current rooms chatbox
// allows you to press enter from within the input field to submit instead of having to tie a submit button to it
function submitOnEnter(input_id, div) {
  var input = document.getElementById(`${input_id}`);

  // Execute a function when the user presses a key on the keyboard
  input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click

      // here were packaging the data needed for displaying our messages to all users
      const input_text = input.value;

      let data = {
        type: "chat",
        message: input_text,
        room: div,
      };

      // then here were sending it off to our websocket for processing
      ws.send(JSON.stringify(data));
    }
  });
}

// send the users inputted text to our chatroom
function appendText(message, room) {
  let chatbox = document.getElementById(room);
  let textline = document.createElement("p");
  textline.className = "chat-message";
  textline.innerText = message;
  chatbox.append(textline);
}

let ws; // global ws to be set on load, so its accessible everywhere

//// INITIAL WEBSOCKET SETUP ////

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

    // if our message has to do with current image states, run our function
    if (message.type === "state") {
      check_state();
    }

    function check_state() {
      document.getElementById("bg").classList.toggle("active", !message.image_state);
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

// just a function that takes the id of an input field
// and allows you to press enter from within the input field to submit instead of having to tie a submit button to it
function submit_on_enter(input_id) {
  var input = document.getElementById(`${input_id}`);

  // Execute a function when the user presses a key on the keyboard
  input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click

      const input_text = input.value
      test_func(input_text)
    }
  });
}

// send the users inputted text to our chatroom
function test_func(text) {
  console.log("submit_chat:", text)
}

// what to do upon opening chat 1
document.getElementById("chat1_btn").addEventListener("click", chat1)
function chat1() {
  // setup divs
    let chat1_box = document.getElementById("chat1_div")
    let chat1_usertxt = document.createElement("p")
    // hide chat 2
    document.getElementById("chat2_div").setAttribute("hidden", "")
    // show chat 1
    document.getElementById("chat1_div").removeAttribute("hidden")

  // setup chat input
    submit_on_enter("chat1_txt")
}

// what to do upon opening chat 2
document.getElementById("chat2_btn").addEventListener("click", chat2)
function chat2() {

  // setup divs
    // hide chat 1
    document.getElementById("chat1_div").setAttribute("hidden", "")
    // show chat 2
    document.getElementById("chat2_div").removeAttribute("hidden")

    // setup chat input
      submit_on_enter("chat2_txt")
}
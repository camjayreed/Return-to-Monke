let ws; // global ws to be set on load, so its accessible everywhere

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

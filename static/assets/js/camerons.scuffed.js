
let ws; // global ws to be set on load, so its accessible everywhere

// create our websocket connection on page loading
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8765");

    // on load send message to websocket, to check IMAGE_SHOWN state
    setTimeout(() => {
        ws.send("IMAGE_STATE");}, 1000);

    // What to do when getting a message from the server
    ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        if (message.type === "state") {
            document.getElementById("bg").classList.toggle("active");
            console.log("updating image")
        }
    });
});

// add click listener onto our witness button, on press change bg of page for EVERYONE (websockets)
document.getElementById("li-witness").addEventListener("click", witness);
function witness() {
    // send message to backend telling it our image changed
    ws.send("Monke Clicked");
}
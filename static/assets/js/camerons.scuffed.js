
let ws; // global ws to be set on load, so its accessible everywhere

// create our websocket connection on page loading
document.addEventListener("DOMContentLoaded", () => {
  ws = new WebSocket("ws://localhost:8765");

    // on load send message to websocket, to check IMAGE_STATE state
    setTimeout(() => {
        ws.send("CHECK_IMAGE");}, 1000);

    // What to do when getting a message from the server
    ws.addEventListener("message", (event) => {
        const message = JSON.parse(event.data);

        // initial image check
        if (message.check_image === false) {
            // set bg image and make the server turn IMAGE_STATE to true
            document.getElementById("bg").classList.toggle("active");
            console.log("Shared Image State: True")
        } else if (message.check_image === true) {
            // set bg image to original state
            document.getElementById("bg").classList.remove("active");
            console.log("Shared Image State: False")
            }

        // on clicking witness button
        if (message.image_state === false) {
            // set bg image and make the server turn IMAGE_STATE to true
            document.getElementById("bg").classList.toggle("active");
            console.log("Shared Image State: True")
        } else if (message.image_state === true) {
            // set bg image to original state
            document.getElementById("bg").classList.remove("active");
            console.log("Shared Image State: False")
            }

        // now we need a if statement that checks message.IMAGE_STATE value
        // if true, document.getElementById("bg").classList.remove("active");
        // if false, document.getElementById("bg").classList.toggle("active");
        // true == deafult bg, false == new bg
    });
});

// add click listener onto our witness button, on press change bg of page for EVERYONE (websockets)
document.getElementById("li-witness").addEventListener("click", witness);
function witness() {
    // send message to backend telling it our image changed
    ws.send("IMAGE_STATE");
}
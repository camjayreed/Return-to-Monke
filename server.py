import websockets
import asyncio
import json
from websockets.exceptions import ConnectionClosed

CONNECTED = set()
IMAGE_SHOWN = False

# ws = the private, live connection between the server and ONE client (one browser tab)
# this handler runs once per connection
async def handler(ws):
    CONNECTED.add(ws)

    try:
        # while this connection is open:
        # listen for message
        async for message in ws:
            global IMAGE_SHOWN
            print("Received:", message)

            # all were doing here is on our user clicking the change image button on the frontend
            # we recieve a message, check the current image_state, set it to the opposite
            # and send back the current state for changing on the front
            if message == "Monke Clicked":
                print(IMAGE_SHOWN)
                if IMAGE_SHOWN == False:
                    IMAGE_SHOWN = True
                    await ws.send(json.dumps({"type": "state", "image_shown": IMAGE_SHOWN}))
                else:
                    IMAGE_SHOWN = False
                    await ws.send(json.dumps({"type": "state", "image_shown": IMAGE_SHOWN}))

            # on loading our html page, send back current image state
            if message == "IMAGE_STATE":
                await ws.send(json.dumps({"type": "state", "image_shown": IMAGE_SHOWN}))

    finally:
        CONNECTED.remove(ws)

# sends a message to all clients connected
async def broadcast(message):
    for ws in CONNECTED.copy():
        try:
            await ws.send(message)
        except ConnectionClosed:
            pass

async def main():
    # This is the "start listening" part.
    # websockets.serve(...) sets up a server that:
    # - listens on host/port
    # - accepts incoming websocket connections
    # - for each connection, calls handler(ws)
    print("Starting WebSocket server on ws://localhost:8765")

    async with websockets.serve(handler, "localhost", 8765):
        # Keep the server running forever.
        # (Otherwise main() would end immediately and the server would shut down.)
        await asyncio.Future()

if __name__ == "__main__":
    # This starts asyncio's event loop and runs main().
    asyncio.run(main())
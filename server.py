import websockets
import asyncio
import json
from websockets.exceptions import ConnectionClosed

CONNECTED = set()
IMAGE_STATE = False

# ws = the private, live connection between the server and ONE client (one browser tab)
# this handler runs once per connection
async def handler(ws):
    CONNECTED.add(ws)
    print(f"Client Connected: {ws}")

    try:
        # while this connection is open:
        # listen for message
        async for message in ws:
            global IMAGE_STATE
            print("Received:", message)

            if message == "CHECK_IMAGE":
                await ws.send(json.dumps({"type": "state", "check_image": IMAGE_STATE}))

            # only thing missing now is sending the broadcast to everyone on click
            if message == "IMAGE_STATE":
                if IMAGE_STATE == False:
                    IMAGE_STATE = True
                    await broadcast(json.dumps({"type": "state", "image_state": IMAGE_STATE}))
                    print(IMAGE_STATE)
                else:
                    IMAGE_STATE = False
                    await broadcast(json.dumps({"type": "state", "image_state": IMAGE_STATE}))
                    print(IMAGE_STATE)

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
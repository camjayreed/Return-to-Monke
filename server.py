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
    global IMAGE_STATE

    # needed a bit of help from Mr.Ai here, i was having trouble catching data and having it error because i was initially trying to process strings on loading the site
    # so he helped me implement the 2 trys and the except
    try:
        async for message in ws:
            print("Received:", message)

            try:
                # try to parse message as json
                data = json.loads(message)
                msg_type = data.get("type")

                if msg_type == "chat":
                    # recieve the data
                    room = data.get("room")
                    message = data.get("message")

                    # broadcast the data to all clients for processing
                    await broadcast(
                        json.dumps({"type": "chat", "message": message, "room": room})
                    )

            # handle if not json
            except json.JSONDecodeError:

                if message == "CHECK_IMAGE":
                    await ws.send(
                        json.dumps({"type": "state", "image_state": IMAGE_STATE})
                    )

                # only thing missing now is sending the broadcast to everyone on click
                if message == "IMAGE_STATE":
                    IMAGE_STATE = not IMAGE_STATE  # flip it to the opposite bool
                    await broadcast(
                        json.dumps({"type": "state", "image_state": IMAGE_STATE})
                    )
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

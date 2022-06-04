#!/usr/bin/env python
from typing import List, NewType, NoReturn

import asyncio
import websockets
import json
from datetime import datetime

from instructions import robotInstructions

Vector3 = NewType('Vector3', {'x': float, 'y': float, 'z': float})


class PythonClient:
    def __init__(self):
        self.uri = 'ws://localhost:5000'
        self.id = datetime.now().strftime("%S%f")
        self.ws = {}

    # setup websocket connection and call robotInstruction() - (don't modify!)
    async def main(self) -> NoReturn:
        print('Main started')
        print('Connecting to websocket server')
        async with websockets.connect(self.uri) as websocketClient:
            self.ws = websocketClient
            print('Websocket connection established!')
            data = {
                "id": self.id,
                "function": "userIdent",
            }
            dataJSON = json.dumps(data)
            await self.ws.send(dataJSON)
            await self.robotInstructions()

    # gets positions of all known objects by returning a list of coordinates
    async def getAllObjectPositions(self) -> List[Vector3]:
        data = {
            "id": self.id,
            "function": "getPositions",
            "message": "Requesting positions of all objects",
            "arguments": "",
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)
        answer = await self.ws.recv()
        print(answer)
        positions = json.loads(answer)['arguments']
        return positions

    # returns coordinates of the center of the gripper
    # center is the point in the center of the closed gripper
    async def getGripperPosition(self) -> Vector3:
        data = {
            "id": self.id,
            "function": "getGripperPosition",
            "message": "Requesting position of gripper",
            "arguments": "",
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)
        answer = await self.ws.recv()
        print(answer)
        gripperPosition = json.loads(answer)['arguments']
        return gripperPosition

    # returns a boolean if the gripper is currently holding an object
    async def isHoldingObject(self) -> bool:
        data = {
            "id": self.id,
            "function": "isHoldingObjectQuestion",
            "message": "Requesting if gripper is currently holding an object",
            "arguments": "",
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)
        answer = await self.ws.recv()
        print(answer)
        isHoldingObject = json.loads(answer)['arguments']
        return isHoldingObject

    # rotate robot grippers clamps in 0.25° sized steps till given destinationValue is reached
    # 0 is completely open, 45 is completely closed
    # (e.g. rotateGripper(45))

    async def rotateGripper(self, destinationValue: float) -> NoReturn:
        data = {
            "id": self.id,
            "function": "rotateGripper",
            "message": "Rotate Gripper.",
            "arguments": [destinationValue],
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)

    # rotate one specific segment in 0.25° sized steps till given destinationValue is reached
    # 0 is central position. destinationValue can be positive or negative
    # segmentId has to be an int and destinationValue has to be a float
    # segmentIds ranged from 0 to 5
    # (e.g. rotateSegment(3, 120))
    async def rotateSegment(self, segmentId: int, destinationValue: float) -> NoReturn:
        data = {
            "id": self.id,
            "function": "rotateSegment",
            "message": "Rotate Segment.",
            "arguments": [segmentId, destinationValue],
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)

    # rotate all segments in 0.25° sized steps till given destination value is reached
    # 0 is central position. destinationValue can be positive or negative
    # destinationValues have to be an array of the destinated degrees of every segment
    # (e.g rotateSegments([30, 20, -10, 40, 30, 120]))
    async def rotateSegments(self, destinationValues: List[float]) -> NoReturn:
        data = {
            "id": self.id,
            "function": "rotateSegments",
            "message": "Rotate Segments.",
            "arguments": destinationValues,
        }
        # convert into JSON:
        dataJSON = json.dumps(data)
        print("Message sent to websocket-server: ", dataJSON)
        await self.ws.send(dataJSON)


# --------------------------------------------------------------------------
# --------------------------------------------------------------------------
    # insert your instructions to communicate with IronArm into this function

    async def robotInstructions(self) -> NoReturn:
        await robotInstructions(self)

# --------------------------------------------------------------------------
# --------------------------------------------------------------------------


pyCl = PythonClient()
asyncio.run(pyCl.main())

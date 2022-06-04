const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });
let clients = {};
let robotClient;
let userClient;

wss.on("connection", ws => {

    console.log("Info: ", "New client connected!");
    let clientId;


    ws.on("message", data => {
        console.log('Message recieved: ', data);
        let parsedData = JSON.parse(data);

        // -------------------------------------------------------------------------------------
        // messages from robot / world
        if (parsedData.function === "robotIdent") {
            console.log('Info: ', 'New client set as robotClient');
            robotClient = ws;
        }

        // sends true, if object is hold, sends false, if not
        if (parsedData.function === "isHoldingObjectAnswer") {
            let wsSendData = {
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            userClient.send(JSON.stringify(wsSendData));
        }

        if (parsedData.function === "sendPositions") {
            let wsSendData = {
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            userClient.send(JSON.stringify(wsSendData));
        }

        // asks, for robots gripper position
        if (parsedData.function === "sendGripperPosition") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            userClient.send(JSON.stringify(wsSendData));
        }

        // -------------------------------------------------------------------------------------
        // messages from webClient
        if (parsedData.function === "userIdent") {
            clientId = parsedData.id;
            clients[clientId] = ws;
            userClient = ws; // only usable with single user
        }

        // asks for all positions of all objects in the scene (including Robot)
        if (parsedData.function === "getPositions") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

        // asks, if robot gripper holds an object
        if (parsedData.function === "isHoldingObjectQuestion") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

        // asks, for robots gripper position
        if (parsedData.function === "getGripperPosition") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

        // gives instruction to rotate (open/close) gripper
        if (parsedData.function === "rotateGripper") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

        // gives instruction to rotate one specific segment
        if (parsedData.function === "rotateSegment") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

        // gives instruction to rotate all segments to individual degrees 
        if (parsedData.function === "rotateSegments") {
            let wsSendData = {
                id: parsedData.id,
                function: parsedData.function,
                message: parsedData.message,
                arguments: parsedData.arguments
            }
            robotClient.send(JSON.stringify(wsSendData));
        }

    })

    ws.on("close", () => {
        console.log('Info: ', 'Client has disconnected!');
        delete clients[clientId];
    })

});
const ws = new WebSocket('ws://localhost:5000')

import { robotArm, scene, world } from './threeFiles/threeMain.js'
import { ONE_DEGREE } from './settings.js'

export default class WsClient {
    constructor() {
        this.configureWsClient()
    }

    configureWsClient = () => {
        ws.addEventListener('open', () => {
            console.log('We are connected!')
            let wsSendData = {
                function: 'robotIdent',
                message: 'robot connected',
                arguments: '',
            }
            setTimeout(() => {
                ws.send(JSON.stringify(wsSendData))
            }, 1000)
        })

        ws.addEventListener('message', (e) => {
            console.log(e.data)
            let parsedData = JSON.parse(e.data)

            if (parsedData.function === 'getPositions') {
                let positions = []
                for (let i = 0; i < world.bodies.length; i++) {
                    positions.push({
                        id: world.bodies[i].id,
                        position: world.bodies[i].position,
                    })
                }
                let wsSendData = {
                    function: 'sendPositions',
                    message: 'Delivering positions of all objects.',
                    arguments: positions,
                }
                ws.send(JSON.stringify(wsSendData))
            }

            if (parsedData.function === 'isHoldingObjectQuestion') {
                let wsSendData = {
                    function: 'isHoldingObjectAnswer',
                    message: 'Answer, if gripper is currently holding an object.',
                    arguments: robotArm.grippers[0].isHoldingObject,
                }
                ws.send(JSON.stringify(wsSendData))
            }

            if (parsedData.function === 'getGripperPosition') {
                let wsSendData = {
                    function: 'sendGripperPosition',
                    message: 'Sends current gripper position.',
                    arguments: robotArm.grippers[0].grippingPoint.position,
                }
                ws.send(JSON.stringify(wsSendData))
            }

            if (parsedData.function === 'rotateGripper') {
                let destinationValue = parsedData.arguments[0]
                robotArm.grippers[0].destinationValue =
                    destinationValue * ONE_DEGREE
                robotArm.grippers[0].isActive = true
            }

            if (parsedData.function === 'rotateSegment') {
                let segmentId = parsedData.arguments[0]
                let destinationValue = parsedData.arguments[1]
                robotArm.segments[segmentId].destinationValue =
                    destinationValue * ONE_DEGREE
                robotArm.segments[segmentId].isActive = true
            }

            if (parsedData.function === 'rotateSegments') {
                let destinationValues = parsedData.arguments
                for (let i = 0; i < robotArm.segments.length; i++) {
                    robotArm.segments[i].destinationValue =
                        destinationValues[i] * ONE_DEGREE
                    robotArm.segments[i].isActive = true
                }
            }
        })
    }

    send = (message) => {
        ws.send(message)
    }
}

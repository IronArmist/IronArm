import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// cannon.js for physics
import * as CANNON from 'cannon-es';

import RobotArmSegment from './RobotArmSegment.js';
import RobotArmDualGripper from './RobotArmDualGripper.js';

import InstructionControl from './InstructionControl.js';
import SliderControl from './SliderControl.js';

// gltf-loader
const loader = new GLTFLoader();

export const loadRobotArm = (scene, world, robotArm, gltf) => {
    loader.load(
        gltf,
        function (gltf) {
            gltf.scene.name = "RobotArm"
            scene.add(gltf.scene);
            let Socket = gltf.scene.children.find(object => {
                return object.name === "Socket";
            });

            let newSegmentRotationAxis = Socket.children[0];
            let newSegment = newSegmentRotationAxis.children[0];
            let rotateAround = newSegmentRotationAxis.name.slice(-1)[0]; // get last char of name-string for rotation-axes marker

            robotArm.segments.push(new RobotArmSegment(scene, world, robotArm, newSegmentRotationAxis, newSegment, newSegment.name, rotateAround));
            while (newSegmentRotationAxis.children[1]) {
                if (newSegmentRotationAxis.children[1].name.includes("Segment")) {
                    newSegmentRotationAxis = newSegmentRotationAxis.children[1];
                    newSegment = newSegmentRotationAxis.children[0];
                    rotateAround = newSegmentRotationAxis.name.slice(-1)[0];
                    robotArm.segments.push(new RobotArmSegment(scene, world, robotArm, newSegmentRotationAxis, newSegment, newSegment.name, rotateAround));
                }
            }

            let Gripper1RotationAxis = newSegment.children[0];
            let Gripper11 = Gripper1RotationAxis.children[0];
            let Gripper12 = Gripper11.children[0];

            let Gripper2RotationAxis = newSegment.children[1];
            let Gripper21 = Gripper2RotationAxis.children[0];
            let Gripper22 = Gripper21.children[0];

            rotateAround = Gripper1RotationAxis.name.slice(-1)[0];

            let DualGripper = new RobotArmDualGripper(
                scene,
                world,
                robotArm,
                Gripper1RotationAxis,
                [Gripper11, Gripper12],
                Gripper2RotationAxis,
                [Gripper21, Gripper22],
                'Gripper',
                rotateAround,
                1);

            robotArm.grippers.push(DualGripper);

            // create followingSegments for all segments to realize parent-child-behaviour
            for (let i = 0; i < robotArm.segments.length; i++) {
                for (let j = i + 1; j < robotArm.segments.length; j++) {
                    robotArm.segments[i].followingSegments.push(robotArm.segments[j]);
                }
                robotArm.segments[i].followingSegments.push(robotArm.grippers[0]);
            }

            // create slider controls for robot arm
            new SliderControl(robotArm);
            new InstructionControl(robotArm);

            console.log('ROBOT ARM LOADED!');
        },
        function (error) {
            console.error(error);
        }
    );
};

// only for testing, body willl not be updated in simulation
export const loadObject = (scene, world, gltf) => {
    loader.load(
        gltf,
        function (gltf) {
            let objectMesh = gltf.scene.children[0];
            let objectBody = new CANNON.Body({
                mass: 1, // kg
                shape: new CANNON.Sphere(1),
            })
            objectBody.position.set(-1.1, 0, -1) // m
            world.addBody(objectBody)

            world.addBody(objectBody);
            scene.add(objectMesh);
            console.log('OBJECT LOADED!');
        },
        function (error) {
            console.error(error);
        }
    );
};

export const loadRoom = (scene, world, gltf) => {
    loader.load(
        gltf,
        function (gltf) {
            scene.add(gltf.scene);
            console.log('ROOM LOADED!');
        },
        function (error) {
            console.error(error);
        }
    );
};


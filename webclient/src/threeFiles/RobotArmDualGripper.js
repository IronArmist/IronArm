import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { QUARTER_DEGREE } from '../settings.js';

export default class RobotArmGripper {

    constructor(scene, world, robotArm, rotationAxis1, gripper1Objects, rotationAxis2, gripper2Objects, name = "Gripper", axis = "z", direction = 1) {
        this.scene = scene;
        this.world = world;
        this.robotArm = robotArm;

        this.rotationAxis1 = rotationAxis1;
        this.rotationAxis2 = rotationAxis2;
        this.gripper1Objects = gripper1Objects;
        this.gripper2Objects = gripper2Objects;

        // point of gripper and offset, where gripped object gets constrained to. will be defined later by size of gripper elements
        this.grippingPoint;
        this.grippingPointVisualization
        this.grippingPointOffsetY;

        // each side of the dual gripper needs an own cannon physics compound body
        this.cannonCompoundBodyA;
        this.cannonCompoundBodyVisualizationA;

        this.cannonCompoundBodyB;
        this.cannonCompoundBodyVisualizationB;

        this.name = "Gripper";
        this.axis = axis;
        this.rotationStepSize = QUARTER_DEGREE;
        this.direction = direction;  // either 1 or -1, accordingly to order of grippers in the gripperObjects-array

        this.tolerance = 0.0025;
        this.isActive = false;
        this.destinationValue = 0;
        this.createPhysicsBody();

        // following markers are needed for setting constraints between gripper and objects
        this.lastActionWasClosing = false;
        this.lastActionWasOpening = false;
        this.isHoldingObject = false;
        this.heldObject = {};
        this.holdingConstraint = {};
    };

    createPhysicsBody = () => {
        let axisHeight =
            this.rotationAxis1.geometry.boundingBox.max.y
            - this.rotationAxis1.geometry.boundingBox.min.y;
        let axisWidth =
            this.rotationAxis1.geometry.boundingBox.max.x
            - this.rotationAxis1.geometry.boundingBox.min.x;
        let axisDepth =
            this.rotationAxis1.geometry.boundingBox.max.z
            - this.rotationAxis1.geometry.boundingBox.min.z;

        let gripper11Height = this.gripper1Objects[0].geometry.boundingBox.max.y
            - this.gripper1Objects[0].geometry.boundingBox.min.y;
        let gripper11Width =
            this.gripper1Objects[0].geometry.boundingBox.max.x
            - this.gripper1Objects[0].geometry.boundingBox.min.x;
        let gripper11Depth =
            this.gripper1Objects[0].geometry.boundingBox.max.z
            - this.gripper1Objects[0].geometry.boundingBox.min.z;


        let gripper11OffsetPositionX = gripper11Width / 2 * -1;

        let gripper12Height = this.gripper1Objects[1].geometry.boundingBox.max.y
            - this.gripper1Objects[1].geometry.boundingBox.min.y;
        let gripper12Width =
            this.gripper1Objects[1].geometry.boundingBox.max.x
            - this.gripper1Objects[1].geometry.boundingBox.min.x;
        let gripper12Depth =
            this.gripper1Objects[1].geometry.boundingBox.max.z
            - this.gripper1Objects[1].geometry.boundingBox.min.z;


        let gripper12OffsetPositionY = gripper12Height / 2 - gripper11Height / 2;

        let targetVec3 = new THREE.Vector3();
        let positionX = this.rotationAxis1.getWorldPosition(targetVec3).x;
        let positionY = this.rotationAxis1.getWorldPosition(targetVec3).y;
        let positionZ = this.rotationAxis1.getWorldPosition(targetVec3).z;


        this.grippingPointOffsetY = gripper11Height + gripper12Height;
        this.grippingPointOffsetX = gripper11Width / 2;

        // *** first side ***
        let cannonCompoundBodyA = new CANNON.Body({
            type: CANNON.Body.KINEMATIC,
            mass: 0, // kg
            position: new CANNON.Vec3(positionX, positionY, positionZ),
        });
        this.world.addBody(cannonCompoundBodyA);
        this.cannonCompoundBodyA = cannonCompoundBodyA;

        // rotation axis body as a cube
        cannonCompoundBodyA.addShape(
            new CANNON.Box(new CANNON.Vec3(axisWidth / 2, axisHeight / 2, axisDepth / 2)),
            new CANNON.Vec3(0, 0, 0)
        );

        // first side bottom part body as a cube
        cannonCompoundBodyA.addShape(
            new CANNON.Box(new CANNON.Vec3(gripper11Width / 2, gripper11Height / 2, gripper11Depth / 2)),
            new CANNON.Vec3(gripper11OffsetPositionX, 0, 0)
        );

        // first side top part body as a cube
        cannonCompoundBodyA.addShape(
            new CANNON.Box(new CANNON.Vec3(gripper12Width / 2, gripper12Height / 2, gripper12Depth / 2)),
            new CANNON.Vec3(gripper11OffsetPositionX * 2, gripper12OffsetPositionY, 0)
        );

        // visualization of top part
        let bodyVisualizationMaterialOpaque = new THREE.MeshStandardMaterial({
            color: 0x111111,
            transparent: true,
            opacity: 0.3
        });

        // compound visualization of Object3D
        let cannonCompoundBodyVisualizationA = new THREE.Group();
        this.scene.add(cannonCompoundBodyVisualizationA);
        this.cannonCompoundBodyVisualizationA = cannonCompoundBodyVisualizationA;


        // rotation axis body visualization
        let rotationAxis1Geometry = new THREE.BoxGeometry(
            cannonCompoundBodyA.shapes[0].halfExtents.x * 2,
            cannonCompoundBodyA.shapes[0].halfExtents.y * 2,
            cannonCompoundBodyA.shapes[0].halfExtents.z * 2
        )
        let rotationAxis1Mesh = new THREE.Mesh(rotationAxis1Geometry, bodyVisualizationMaterialOpaque);
        rotationAxis1Mesh.position.copy(cannonCompoundBodyA.shapeOffsets[0]);

        // comment in following line, to make rotationAxisMesh visible
        // cannonCompoundBodyVisualizationA.add(rotationAxis1Mesh);

        // first side bottom part body visualization
        let firstSegmentBottomGeometry = new THREE.BoxGeometry(
            cannonCompoundBodyA.shapes[1].halfExtents.x * 2,
            cannonCompoundBodyA.shapes[1].halfExtents.y * 2,
            cannonCompoundBodyA.shapes[1].halfExtents.z * 2
        )
        let firstSegmentBottomMesh = new THREE.Mesh(firstSegmentBottomGeometry, bodyVisualizationMaterialOpaque);
        firstSegmentBottomMesh.position.copy(cannonCompoundBodyA.shapeOffsets[1]);

        // comment in following line, to make firstSegmentBottomMesh visible
        cannonCompoundBodyVisualizationA.add(firstSegmentBottomMesh);

        // second side top part body visualization
        let firstSegmentTopGeometry = new THREE.BoxGeometry(
            cannonCompoundBodyA.shapes[2].halfExtents.x * 2,
            cannonCompoundBodyA.shapes[2].halfExtents.y * 2,
            cannonCompoundBodyA.shapes[2].halfExtents.z * 2
        )
        let firstSegmentTopMesh = new THREE.Mesh(firstSegmentTopGeometry, bodyVisualizationMaterialOpaque);
        firstSegmentTopMesh.position.copy(cannonCompoundBodyA.shapeOffsets[2]);

        // comment in following line, to make firstSegmentTopMesh visible
        cannonCompoundBodyVisualizationA.add(firstSegmentTopMesh);

        // *** second side ***
        let cannonCompoundBodyB = new CANNON.Body({
            type: CANNON.Body.KINEMATIC,
            mass: 0, // kg
            position: new CANNON.Vec3(positionX, positionY, positionZ),
        });
        this.world.addBody(cannonCompoundBodyB);
        this.cannonCompoundBodyB = cannonCompoundBodyB;

        // rotation axis body as a cube
        cannonCompoundBodyB.addShape(
            new CANNON.Box(new CANNON.Vec3(axisWidth / 2, axisHeight / 2, axisDepth / 2)),
            new CANNON.Vec3(0, 0, 0)
        );

        // first side bottom part body as a cube
        cannonCompoundBodyB.addShape(
            new CANNON.Box(new CANNON.Vec3(gripper11Width / 2, gripper11Height / 2, gripper11Depth / 2)),
            new CANNON.Vec3(gripper11OffsetPositionX * -1, 0, 0)
        );

        // first side top part body as a cube
        cannonCompoundBodyB.addShape(
            new CANNON.Box(new CANNON.Vec3(gripper12Width / 2, gripper12Height / 2, gripper12Depth / 2)),
            new CANNON.Vec3(gripper11OffsetPositionX * 2 * -1, gripper12OffsetPositionY, 0)
        );

        // visualization of bottom part

        // compound visualization of Object3D
        let cannonCompoundBodyVisualizationB = new THREE.Group();
        this.scene.add(cannonCompoundBodyVisualizationB);
        this.cannonCompoundBodyVisualizationB = cannonCompoundBodyVisualizationB;


        // rotation axis body visualization
        let rotationAxis2Geometry = new THREE.BoxGeometry(
            cannonCompoundBodyB.shapes[0].halfExtents.x * 2,
            cannonCompoundBodyB.shapes[0].halfExtents.y * 2,
            cannonCompoundBodyB.shapes[0].halfExtents.z * 2
        )
        let rotationAxis2Mesh = new THREE.Mesh(rotationAxis2Geometry, bodyVisualizationMaterialOpaque);
        rotationAxis2Mesh.position.copy(cannonCompoundBodyB.shapeOffsets[0]);

        // comment in following line, to make rotationAxisMesh visible
        cannonCompoundBodyVisualizationB.add(rotationAxis2Mesh);


        // first side bottom part body visualization
        let secondSegmentBottomGeometry = new THREE.BoxGeometry(
            cannonCompoundBodyB.shapes[1].halfExtents.x * 2,
            cannonCompoundBodyB.shapes[1].halfExtents.y * 2,
            cannonCompoundBodyB.shapes[1].halfExtents.z * 2
        )
        let secondSegmentBottomMesh = new THREE.Mesh(secondSegmentBottomGeometry, bodyVisualizationMaterialOpaque);
        secondSegmentBottomMesh.position.copy(cannonCompoundBodyB.shapeOffsets[1]);

        // comment in following line, to make secondSegmentBottomMesh visible
        cannonCompoundBodyVisualizationB.add(secondSegmentBottomMesh);

        // second side top part body visualization
        let secondSegmentTopGeometry = new THREE.BoxGeometry(
            cannonCompoundBodyB.shapes[2].halfExtents.x * 2,
            cannonCompoundBodyB.shapes[2].halfExtents.y * 2,
            cannonCompoundBodyB.shapes[2].halfExtents.z * 2
        )
        let secondSegmentTopMesh = new THREE.Mesh(secondSegmentTopGeometry, bodyVisualizationMaterialOpaque);
        secondSegmentTopMesh.position.copy(cannonCompoundBodyB.shapeOffsets[2]);

        // comment in following line, to make firstSegmentBottomMesh visible
        cannonCompoundBodyVisualizationB.add(secondSegmentTopMesh);


        // *** gripping point ***
        let grippingPoint = new CANNON.Body({
            type: CANNON.Body,
            mass: 0, // kg
            position: new CANNON.Vec3(
                positionX,
                positionY + Math.sqrt((gripper11Width * gripper11Width) + (gripper12Height * gripper12Height)) + 0.5,
                positionZ
            ),
        });

        this.world.addBody(grippingPoint);
        this.grippingPoint = grippingPoint;

        // visualization of grippingPoint (comment in for testing purposes)
        // grippingPoint.addShape(
        //     new CANNON.Box(
        //         new CANNON.Vec3(0.05, 0.35, 0.05),
        //         new CANNON.Vec3(0, 0, 0))
        // );

        // let grippingPointVisualization = new THREE.Group();
        // this.scene.add(grippingPointVisualization);
        // this.grippingPointVisualization = grippingPointVisualization;
        // let grippingPointGeometry = new THREE.BoxGeometry(
        //     0.05, 0.35, 0.05
        // )
        // let grippingPointMesh = new THREE.Mesh(grippingPointGeometry, bodyVisualizationMaterialOpaque);
        // grippingPointMesh.position.copy(grippingPoint.shapeOffsets[0]);

        // // comment in following line, to make grippingPoint visible
        // grippingPointVisualization.add(grippingPointMesh);

        this.updateCannonCompoundBodyQuaternionAndPosition()

    }

    closeGripper = () => {
        if (this.rotationAxis1.rotation.z * this.direction > -0.75) {
            this.rotationAxis1.rotation.z -= this.rotationStepSize * this.direction;
            this.rotationAxis2.rotation.z += this.rotationStepSize * this.direction;
        } else {
            this.isActive = false;
            this.openIsActive = false;
        }
        this.updateCannonCompoundBodyQuaternionAndPosition();
    };

    openGripper = () => {
        if (this.rotationAxis1.rotation.z * this.direction < 0) {
            this.rotationAxis1.rotation.z += this.rotationStepSize * this.direction;
            this.rotationAxis2.rotation.z -= this.rotationStepSize * this.direction;

        } else {
            this.isActive = false;
            this.openIsActive = false;
        }
        this.updateCannonCompoundBodyQuaternionAndPosition();
    };

    calculateDistance = (rotation) => {
        let remainingDistance = Math.abs(
            Math.abs(rotation) - Math.abs(this.destinationValue)
        );
        return remainingDistance;
    };

    calculateRotationStep = (rotation) => {
        let rotationStep =
            rotation < this.destinationValue
                ? this.rotationStepSize
                : this.rotationStepSize * -1;
        return rotationStep;
    }

    rotate = () => {
        let rotationStep, remainingDistance;
        switch (this.axis) {
            case 'x':
                rotationStep = this.calculateRotationStep(this.rotationAxis2.rotation.x);
                remainingDistance = this.calculateDistance(this.rotationAxis2.rotation.x)
                break;
            case 'y':
                rotationStep = this.calculateRotationStep(this.rotationAxis2.rotation.y);
                remainingDistance = this.calculateDistance(this.rotationAxis2.rotation.y)
                break;
            case 'z':
                rotationStep = this.calculateRotationStep(this.rotationAxis2.rotation.z);
                remainingDistance = this.calculateDistance(this.rotationAxis2.rotation.z)
                break;
            default:
                console.log('No axis defined. Rotation impossible!')
                this.isActive = false;
                return;
        };

        let nearEnough = remainingDistance < this.tolerance;

        if (nearEnough) {
            this.isActive = false;
        } else {
            if (rotationStep < 0) {
                this.lastActionWasClosing = false;
                this.lastActionWasOpening = true;
            } else {
                this.lastActionWasClosing = true;
                this.lastActionWasOpening = false;
            }
            switch (this.axis) {
                case 'x':
                    this.rotationAxis1.rotation.x -= rotationStep;
                    this.rotationAxis2.rotation.x += rotationStep;
                    break;
                case 'y':
                    this.rotationAxis1.rotation.y -= rotationStep;
                    this.rotationAxis2.rotation.y += rotationStep;
                    break;
                case 'z':
                    this.rotationAxis1.rotation.z -= rotationStep;
                    this.rotationAxis2.rotation.z += rotationStep;
                    break;
            };

        };

        this.updateCannonCompoundBodyQuaternionAndPosition(true);

        if (this.isHoldingObject === false && this.lastActionWasClosing) {
            this.isGripperInContact();
        }
        else if (this.isHoldingObject === true && this.lastActionWasOpening === true) {
            this.deleteHoldingConstraint();
        };
    };


    isGripperInContact = () => {
        let sideAisInContact = false;
        let sideAsContact = {};
        let sideBisInContact = false;
        let sideBsContact = {};

        for (let i = 0; i < this.world.contacts.length; i++) {
            if (this.world.contacts[i].bi === this.cannonCompoundBodyA) {
                sideAisInContact = true;
                sideAsContact = this.world.contacts[i].bj;
                console.log("Part of Gripper is in contact with body" + this.world.contacts[i].bj.id)
            } else if (this.world.contacts[i].bj === this.cannonCompoundBodyA) {
                sideAisInContact = true;
                sideAsContact = this.world.contacts[i].bi;
                console.log("Part of Gripper is in of contact with body " + this.world.contacts[i].bi.id)
            }
        }

        if (sideAisInContact) {
            for (let i = 0; i < this.world.contacts.length; i++) {
                if (this.world.contacts[i].bi === this.cannonCompoundBodyB) {
                    sideBisInContact = true;
                    sideBsContact = this.world.contacts[i].bj;
                    console.log("Part of Gripper is in contact with body" + this.world.contacts[i].bj.id)
                } else if (this.world.contacts[i].bj === this.cannonCompoundBodyB) {
                    sideBisInContact = true;
                    sideBsContact = this.world.contacts[i].bi;
                    console.log("Part of Gripper is in of contact with body " + this.world.contacts[i].bi.id)
                }
            }
        }

        if (sideAisInContact && sideBisInContact && sideAsContact === sideBsContact) {
            this.createHoldingConstraint(sideAsContact);
        }

    }

    createHoldingConstraint = (object) => {
        console.log("GRIP ENGAGED!");
        this.isHoldingObject = true;
        this.heldObject = object;
        let holdingConstraint = new CANNON.LockConstraint(
            this.grippingPoint,
            object,
            {
                collideConnected: false
            }
        );
        this.world.addConstraint(holdingConstraint);
        this.holdingConstraint = holdingConstraint;
    }

    deleteHoldingConstraint = () => {
        console.log("CONTACT LOST!");
        this.isHoldingObject = false;
        this.heldObject = {};
        this.world.removeConstraint(this.holdingConstraint);
        this.holdingConstraint = {};
    }

    ancestorHasMoved = () => {
        this.updateCannonCompoundBodyQuaternionAndPosition();
    }

    updateCannonCompoundBodyQuaternionAndPosition = () => {
        let targetVec3 = new THREE.Vector3();
        let targetQuat = new THREE.Quaternion();
        this.cannonCompoundBodyA.position =
            new CANNON.Vec3(
                this.rotationAxis1.getWorldPosition(targetVec3).x,
                this.rotationAxis1.getWorldPosition(targetVec3).y,
                this.rotationAxis1.getWorldPosition(targetVec3).z,
            );
        this.cannonCompoundBodyA.quaternion =
            new CANNON.Quaternion(
                this.rotationAxis1.getWorldQuaternion(targetQuat)._x,
                this.rotationAxis1.getWorldQuaternion(targetQuat)._y,
                this.rotationAxis1.getWorldQuaternion(targetQuat)._z,
                this.rotationAxis1.getWorldQuaternion(targetQuat)._w
            );
        this.cannonCompoundBodyB.position =
            new CANNON.Vec3(
                this.rotationAxis2.getWorldPosition(targetVec3).x,
                this.rotationAxis2.getWorldPosition(targetVec3).y,
                this.rotationAxis2.getWorldPosition(targetVec3).z,
            );
        this.cannonCompoundBodyB.quaternion =
            new CANNON.Quaternion(
                this.rotationAxis2.getWorldQuaternion(targetQuat)._x,
                this.rotationAxis2.getWorldQuaternion(targetQuat)._y,
                this.rotationAxis2.getWorldQuaternion(targetQuat)._z,
                this.rotationAxis2.getWorldQuaternion(targetQuat)._w
            );

        this.grippingPoint.position =
            new CANNON.Vec3(
                this.rotationAxis2.getWorldPosition(targetVec3).x,
                this.rotationAxis2.getWorldPosition(targetVec3).y,
                this.rotationAxis2.getWorldPosition(targetVec3).z,
            );

        this.grippingPoint.quaternion =
            new CANNON.Quaternion(
                this.robotArm.segments[this.robotArm.segments.length - 1].rotationAxis.getWorldQuaternion(targetQuat)._x,
                this.robotArm.segments[this.robotArm.segments.length - 1].rotationAxis.getWorldQuaternion(targetQuat)._y,
                this.robotArm.segments[this.robotArm.segments.length - 1].rotationAxis.getWorldQuaternion(targetQuat)._z,
                this.robotArm.segments[this.robotArm.segments.length - 1].rotationAxis.getWorldQuaternion(targetQuat)._w
            );
    }

};
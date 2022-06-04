import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { QUARTER_DEGREE } from '../settings';


// rotationAxis and robotArmSegment have to be both Three.js Object3D Objects
export default class RobotArmSegment {
  constructor(scene, world, robotArm, rotationAxis, robotArmSegment, name = "Segment", axis = 'y') {
    this.scene = scene;
    this.world = world;
    this.robotArm = robotArm;
    this.followingSegments = [];

    this.rotationAxis = rotationAxis;
    this.robotArmSegment = robotArmSegment;

    this.rotationAxisHalfExtendY;
    this.segmentHeight;

    this.cannonCompoundBody;
    this.cannonCompoundBodyVisualization;

    this.name = name;
    this.axis = axis;  // The axis, where this Segment rotates around 
    this.rotationStepSize = QUARTER_DEGREE;
    this.tolerance = 0.0025;
    this.isActive = false;

    this.destinationValue = 0;

    this.createPhysicsBody();
  };

  createPhysicsBody = () => {
    let axisHeight =
      this.rotationAxis.geometry.boundingBox.max.y
      - this.rotationAxis.geometry.boundingBox.min.y;
    this.rotationAxisHalfExtendY = axisHeight / 2;
    let axisWidth =
      this.rotationAxis.geometry.boundingBox.max.x
      - this.rotationAxis.geometry.boundingBox.min.x;
    let axisDepth =
      this.rotationAxis.geometry.boundingBox.max.z
      - this.rotationAxis.geometry.boundingBox.min.z;

    let segmentHeight =
      this.robotArmSegment.geometry.boundingBox.max.y
      - this.robotArmSegment.geometry.boundingBox.min.y;
    this.segmentHeight = segmentHeight;
    let segmentWidth =
      this.robotArmSegment.geometry.boundingBox.max.x
      - this.robotArmSegment.geometry.boundingBox.min.x;
    let radiusTop = segmentWidth / 2 - segmentWidth / 6
    let radiusBottom = segmentWidth / 2;
    let numSegments = 6;
    let segmentOffsetPositionY = segmentHeight / 2 - axisHeight / 2;


    let targetVec3 = new THREE.Vector3();
    let positionX = this.rotationAxis.getWorldPosition(targetVec3).x;
    let positionY = this.rotationAxis.getWorldPosition(targetVec3).y;
    let positionZ = this.rotationAxis.getWorldPosition(targetVec3).z;


    let cannonCompoundBody = new CANNON.Body({
      // type: CANNON.Body.KINEMATIC,
      type: CANNON.Body,
      mass: 0, // kg,
      velocity: new CANNON.Vec3(0, 0, 0),
      position: new CANNON.Vec3(positionX, positionY, positionZ)
    })
    this.world.addBody(cannonCompoundBody);
    this.cannonCompoundBody = cannonCompoundBody;

    // rotation axis body as a cube
    cannonCompoundBody.addShape(
      new CANNON.Box(new CANNON.Vec3(axisWidth / 2, axisHeight / 2, axisDepth / 2)),
      new CANNON.Vec3(0, 0, 0)
    );

    // robot arm segment body as a cylinder
    cannonCompoundBody.addShape(
      new CANNON.Cylinder(radiusTop, radiusBottom, segmentHeight, numSegments),
      new CANNON.Vec3(0, segmentOffsetPositionY, 0)
    );

    // visualization of physics body (for testing, if it is in place)
    let bodyVisualizationMaterialOpaque = new THREE.MeshStandardMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.3
    });

    // compount visualization of Object3D
    let cannonCompoundBodyVisualization = new THREE.Group();
    this.scene.add(cannonCompoundBodyVisualization);
    this.cannonCompoundBodyVisualization = cannonCompoundBodyVisualization;

    // rotationAxis body visualization
    let rotationAxisGeometry = new THREE.BoxGeometry(
      cannonCompoundBody.shapes[0].halfExtents.x * 2,
      cannonCompoundBody.shapes[0].halfExtents.y * 2,
      cannonCompoundBody.shapes[0].halfExtents.z * 2
    )
    let rotationAxisMesh = new THREE.Mesh(rotationAxisGeometry, bodyVisualizationMaterialOpaque);
    rotationAxisMesh.position.copy(cannonCompoundBody.shapeOffsets[0]);

    // comment in the following line, to make rotationAxisMesh visible (for testing, if it is in place)
    // cannonCompoundBodyVisualization.add(rotationAxisMesh);

    // robot arm segment body visualization
    let robotArmBodyGeometry = new THREE.CylinderGeometry(
      cannonCompoundBody.shapes[1].radiusTop,
      cannonCompoundBody.shapes[1].radiusBottom,
      segmentHeight,
      cannonCompoundBody.shapes[1].numSegments)
    let robotArmBodyMesh = new THREE.Mesh(robotArmBodyGeometry, bodyVisualizationMaterialOpaque);
    robotArmBodyMesh.position.copy(cannonCompoundBody.shapeOffsets[1]);
    cannonCompoundBodyVisualization.add(robotArmBodyMesh);

    this.tests();
  }

  // use following method for additional testing
  tests = () => {

  }

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

  rotate = (axis) => {
    let rotationStep, remainingDistance;
    switch (this.axis) {
      case 'x':
        rotationStep = this.calculateRotationStep(this.rotationAxis.rotation.x);
        remainingDistance = this.calculateDistance(this.rotationAxis.rotation.x)
        break;
      case 'y':
        rotationStep = this.calculateRotationStep(this.rotationAxis.rotation.y);
        remainingDistance = this.calculateDistance(this.rotationAxis.rotation.y)
        break;
      case 'z':
        rotationStep = this.calculateRotationStep(this.rotationAxis.rotation.z);
        remainingDistance = this.calculateDistance(this.rotationAxis.rotation.z)
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
      switch (this.axis) {
        case 'x':
          this.rotationAxis.rotation.x += rotationStep;
          break;
        case 'y':
          this.rotationAxis.rotation.y += rotationStep;
          break;
        case 'z':
          this.rotationAxis.rotation.z += rotationStep;
          break;
      };

      this.followingSegments.forEach(segment => {
        segment.ancestorHasMoved();
      });
    };

    this.updateCannonCompoundBodyQuaternionAndPosition();
  };

  ancestorHasMoved = () => {
    this.updateCannonCompoundBodyQuaternionAndPosition();
  }

  updateCannonCompoundBodyQuaternionAndPosition = () => {
    let targetVec3 = new THREE.Vector3();
    let targetQuat = new THREE.Quaternion();
    this.cannonCompoundBody.position =
      new CANNON.Vec3(
        this.rotationAxis.getWorldPosition(targetVec3).x,
        this.rotationAxis.getWorldPosition(targetVec3).y,
        this.rotationAxis.getWorldPosition(targetVec3).z,
      );
    this.cannonCompoundBody.quaternion =
      new CANNON.Quaternion(
        this.rotationAxis.getWorldQuaternion(targetQuat)._x,
        this.rotationAxis.getWorldQuaternion(targetQuat)._y,
        this.rotationAxis.getWorldQuaternion(targetQuat)._z,
        this.rotationAxis.getWorldQuaternion(targetQuat)._w
      );

  }

};
import { CANNON_WORLD_TIME_STEP, FAST_FORWARD_FACTOR, GRAVITY_VEC, REDUCE_FPS_FACTOR, ROBOT_SPEED } from '../settings';

// three.js for 3D-animations
import * as THREE from 'three';

// three-helpers
import { createRenderer } from './threeModules/renderer.js';
import { createCamera } from './threeModules/camera.js';
import { createLights } from './threeModules/lights.js';

// cannon.js for physics
import * as CANNON from 'cannon-es';

// gltf-model(s)
// gltf-robotArm
import IronArmFinal from './models/IronArm.gltf';

// gltf-room
import R00_Room from './models/Room.gltf'

// "levels"
import { hanoy } from './levels/hanoy.js';
import { slide } from './levels/slide.js';

// loaders
import { loadObject, loadRobotArm, loadRoom } from './modelLoader.js';

// loaders for testing
import { conesAndCylinders, cannonCompoundGroupWithThreeVisualization, singleCube } from './threeModules/objectTests';

// ----------------------------------------------------------------------------------------------------------------------

// create scene
const scene = new THREE.Scene();
export { scene as scene };

const threeContainer = document.getElementById('three-canvas');
const renderer = createRenderer(threeContainer);
const camera = createCamera(scene, renderer, threeContainer);
createLights(scene);

// create cannon world for physics 
const world = new CANNON.World({
  gravity: GRAVITY_VEC,
})
export { world as world };


let physicsObjects = [];
let physicsObjectsVisualizations = [];

// create and load robotarm
let robotArm =
{
  segments: [],
  grippers: [],
  testAnimation: () => { }
};
loadRobotArm(scene, world, robotArm, IronArmFinal);
export { robotArm as robotArm };


// load room
loadRoom(scene, world, R00_Room);

// create cannon physics floor body
let floorBody = new CANNON.Body({
  type: CANNON.Body.KINEMATIC,
  mass: 0, // kg
  shape: new CANNON.Plane(),
})
floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(floorBody);

// load level
hanoy(scene, world, physicsObjects, physicsObjectsVisualizations);
slide(scene, world, physicsObjects, physicsObjectsVisualizations);

// tests for level creation - comment in for examples of different types of objects and relationships

// // physic test with objects
// singleCube(scene,
//   world,
//   physicsObjects,
//   physicsObjectsVisualizations
// );

// // conesAndCylinders(
//   scene,
//   world,
//   physicsObjects,
//   physicsObjectsVisualizations
// );

// // compound object test
// cannonCompoundGroupWithThreeVisualization(
//   scene,
//   world,
//   physicsObjects,
//   physicsObjectsVisualizations
// );

// // test gripping constraint
// setTimeout(() => {
//   robotArm.grippers[0].createHoldingConstraint(physicsObjects[physicsObjects.length - 1]);
// }, 250);

// --------------------------------------------------------------------------------------------
// animation section

let fpsCount = 0;

// animation loop (60hz default)
function animate() {

  requestAnimationFrame(animate);

  // use this loop to enable manipulation of framerates
  if (fpsCount % REDUCE_FPS_FACTOR === 0) {
    for (let step = 0; step < ROBOT_SPEED; step++) {
      for (let fastForwardStep = 0; fastForwardStep < FAST_FORWARD_FACTOR; fastForwardStep++) {

        world.step(CANNON_WORLD_TIME_STEP)

        // update visualizations of all cannon physics bodies (which are not the robot arm)
        for (let i = 0; i < physicsObjectsVisualizations.length; i++) {
          physicsObjectsVisualizations[i].position.copy(physicsObjects[i].position);
          physicsObjectsVisualizations[i].quaternion.copy(physicsObjects[i].quaternion);
        };

        // robot arm rotation checks
        robotArm.segments.forEach(segment => {
          segment.isActive ? segment.rotate() : null;
        });
        robotArm.grippers.forEach(gripper => {
          gripper.isActive ? gripper.rotate() : null;
        });

        // update visualizations of cannon physics bodies of all robot arm elements
        robotArm.segments.forEach(segment => {
          segment.cannonCompoundBodyVisualization.position.copy(segment.cannonCompoundBody.position);
          segment.cannonCompoundBodyVisualization.quaternion.copy(segment.cannonCompoundBody.quaternion);
        });

        robotArm.grippers.forEach(gripper => {
          gripper.cannonCompoundBodyVisualizationA.position.copy(gripper.cannonCompoundBodyA.position);
          gripper.cannonCompoundBodyVisualizationA.quaternion.copy(gripper.cannonCompoundBodyA.quaternion);
          gripper.cannonCompoundBodyVisualizationB.position.copy(gripper.cannonCompoundBodyB.position);
          gripper.cannonCompoundBodyVisualizationB.quaternion.copy(gripper.cannonCompoundBodyB.quaternion);
        });

      }
    }
  }
  fpsCount++;
  renderer.render(scene, camera);
}

animate();


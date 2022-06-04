import * as THREE from 'three';
import * as CANNON from 'cannon-es';

// general objects / physics tests with cubes, cones and cylinders

export const singleCube = (scene, world, physicsObjects, physicsObjectsVisualizations) => {
  let cannonCompoundBody = new CANNON.Body({
    type: CANNON.Body,
    mass: 5, // kg
    position: new CANNON.Vec3(1.9, 0, 0)
  });
  world.addBody(cannonCompoundBody);
  physicsObjects.push(cannonCompoundBody);

  // cube
  cannonCompoundBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.05, 0.1, 0.05)),
    new CANNON.Vec3(0.05, 0.25, 0.05)
  );

  // three visializations
  let bodyVisualizationMaterialOpaque = new THREE.MeshStandardMaterial({
    color: 0x77ff55,
    transparent: false,
  });

  let cannonBodyVisualization = new THREE.Group();
  scene.add(cannonBodyVisualization);
  physicsObjectsVisualizations.push(cannonBodyVisualization);

  // cube visualization
  let geometry = new THREE.BoxGeometry(
    cannonCompoundBody.shapes[0].halfExtents.x * 2,
    cannonCompoundBody.shapes[0].halfExtents.y * 2,
    cannonCompoundBody.shapes[0].halfExtents.z * 2
  );
  let mesh = new THREE.Mesh(geometry, bodyVisualizationMaterialOpaque);
  mesh.position.copy(cannonCompoundBody.shapeOffsets[0]);
  cannonBodyVisualization.add(mesh);

}

export const conesAndCylinders = (scene, world, physicsObjects, physicsObjectsVisualizations) => {
  // cannon physics body - red cylinder
  let radiusTop = 0.1
  let radiusBottom = 0.25
  let height = 0.5
  let numSegments = 12
  let cylinderBody1 = new CANNON.Body({
    mass: 4, // kg
    shape: new CANNON.Cylinder(radiusTop, radiusBottom, height, numSegments),
  });
  cylinderBody1.position.set(-0.75, 3.5, 0) // m
  world.addBody(cylinderBody1);
  physicsObjects.push(cylinderBody1);

  // three mesh
  let geometryCylinder1 = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    numSegments
  );
  let material = new THREE.MeshStandardMaterial({ color: 0x881133, roughness: 0.3 })
  let cylinderMesh1 = new THREE.Mesh(geometryCylinder1, material)
  cylinderMesh1.position.set(-0.75, 3.5, 0) // m
  scene.add(cylinderMesh1);
  physicsObjectsVisualizations.push(cylinderMesh1);

  // cannon physics body - cream cylinder
  let radiusTop2 = 0.08
  let radiusBottom2 = 0.25
  let height2 = 0.8
  let numSegments2 = 12
  let cylinderBody2 = new CANNON.Body({
    mass: 5, // kg
    shape: new CANNON.Cylinder(radiusTop2, radiusBottom2, height2, numSegments2),
  });
  cylinderBody2.position.set(-1, height2 / 2, 0.25) // m
  world.addBody(cylinderBody2);
  physicsObjects.push(cylinderBody2);

  // three mesh
  let geometryCylinder2 = new THREE.CylinderGeometry(
    radiusTop2,
    radiusBottom2,
    height2,
    numSegments2
  );
  material = new THREE.MeshStandardMaterial({ color: 0xaa8855, roughness: 0.3 })
  let cylinderMesh2 = new THREE.Mesh(geometryCylinder2, material)
  cylinderMesh2.position.set(-1, height2 / 2, 0.5) // m
  scene.add(cylinderMesh2);
  physicsObjectsVisualizations.push(cylinderMesh2);

  // cannon physics object - olive cylinder
  let radiusTop3 = 0.08
  let radiusBottom3 = 0.08
  let height3 = 0.8
  let numSegments3 = 8
  let cylinderBody3 = new CANNON.Body({
    mass: 5, // kg
    shape: new CANNON.Cylinder(radiusTop3, radiusBottom3, height3, numSegments3),
  });
  cylinderBody3.position.set(0, 2.8, 0); // m
  cylinderBody3.quaternion.x += 90; // m
  world.addBody(cylinderBody3);
  physicsObjects.push(cylinderBody3);

  // three mesh
  let geometryCylinder3 = new THREE.CylinderGeometry(
    radiusTop3,
    radiusBottom3,
    height3,
    numSegments3
  );
  material = new THREE.MeshStandardMaterial({ color: 0x99bb66, roughness: 0.3 })
  let cylinderMesh3 = new THREE.Mesh(geometryCylinder3, material)

  cylinderMesh3.position.set(0, 2.8, 0) // m
  cylinderMesh3.quaternion.x += 90; // m
  scene.add(cylinderMesh3);
  physicsObjectsVisualizations.push(cylinderMesh3);
};


// test for cannon body compound gruop with threee visualization
export const cannonCompoundGroupWithThreeVisualization = (scene, world, physicsObjects, physicsObjectsVisualizations) => {
  let cannonCompoundBody = new CANNON.Body({
    type: CANNON.Body.KINEMATIC,
    mass: 0, // kg
    position: new CANNON.Vec3(2, 0, -1)
  });
  world.addBody(cannonCompoundBody);
  physicsObjects.push(cannonCompoundBody);

  // center cube
  cannonCompoundBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    new CANNON.Vec3(0, 0, 0)
  );

  // side cube
  cannonCompoundBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.25)),
    new CANNON.Vec3(0, 1, 0),
  );

  // three visializations
  let bodyVisualizationMaterialOpaque = new THREE.MeshStandardMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.5
  });

  let cannonBodyVisualization = new THREE.Group();
  scene.add(cannonBodyVisualization);
  physicsObjectsVisualizations.push(cannonBodyVisualization);

  // center cube visualization
  let rotationAxisGeometry = new THREE.BoxGeometry(
    cannonCompoundBody.shapes[0].halfExtents.x * 2,
    cannonCompoundBody.shapes[0].halfExtents.y * 2,
    cannonCompoundBody.shapes[0].halfExtents.z * 2
  );
  let rotationAxisMesh = new THREE.Mesh(rotationAxisGeometry, bodyVisualizationMaterialOpaque);
  rotationAxisMesh.position.copy(cannonCompoundBody.shapeOffsets[0]);
  cannonBodyVisualization.add(rotationAxisMesh);

  // side cube visualization
  let cube2Geometry = new THREE.BoxGeometry(
    cannonCompoundBody.shapes[1].halfExtents.x * 2,
    cannonCompoundBody.shapes[1].halfExtents.y * 2,
    cannonCompoundBody.shapes[1].halfExtents.z * 2
  );
  let cube2Mesh = new THREE.Mesh(cube2Geometry, bodyVisualizationMaterialOpaque);
  cube2Mesh.position.copy(cannonCompoundBody.shapeOffsets[1]);
  cannonBodyVisualization.add(cube2Mesh);

  // another object as "child" from the compound object above
  let cannonChildBody = new CANNON.Body({
    type: CANNON.Body,
    mass: 500, // kg
    position: new CANNON.Vec3(0.5, 0.5, 0)
  });
  world.addBody(cannonChildBody);
  physicsObjects.push(cannonChildBody);

  cannonChildBody.addShape(
    new CANNON.Box(new CANNON.Vec3(0.125, 1, 0.125)),
    new CANNON.Vec3(0, 2, 0)
  );

  // "child" visualization
  let cubeChildGeometry = new THREE.BoxGeometry(
    cannonChildBody.shapes[0].halfExtents.x * 2,
    cannonChildBody.shapes[0].halfExtents.y * 2,
    cannonChildBody.shapes[0].halfExtents.z * 2
  );
  let cubeChildMesh = new THREE.Mesh(cubeChildGeometry, bodyVisualizationMaterialOpaque);
  cubeChildMesh.position.copy(cannonChildBody.shapeOffsets[0]);
  scene.add(cubeChildMesh);
  physicsObjectsVisualizations.push(cubeChildMesh);

  cubeChildMesh.angularDamping = 0.999999999;

  // body constraint
  var constraint3 = new CANNON.HingeConstraint(
    cannonChildBody,
    cannonCompoundBody,
    {
      pivotA: new CANNON.Vec3(0, 0, 0),
      axisA: new CANNON.Vec3(0, 0, 1),
      pivotB: new CANNON.Vec3(0, 1.5, 0),
      axisB: new CANNON.Vec3(0, 0, 1),
    }
  );
  world.addConstraint(constraint3);

  cannonCompoundBody.angularVelocity.set(0, 1, 0);
  cannonChildBody.angularVelocity.set(0, 0, 1);
};
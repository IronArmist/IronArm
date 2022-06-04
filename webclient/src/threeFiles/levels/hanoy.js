import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { COLORS } from '../../settings.js';

export const hanoy = (scene, world, physicsObjects, physicsObjectsVisualizations) => {

    // platforms
    let platformHeight = 0.05
    let platformRadiusTop = 0.3
    let platformRadiusBottom = 0.325

    // segments
    let biggestRadius = 0.115;
    let radiusDecrease = 0.02;
    let height = 0.1;
    let pinThickness = radiusDecrease / 4;
    let pinEdges = 8;
    let pinOffset;

    let positionX = -1.15;
    let positionZ = 0.85;

    // ---
    // bodies

    let bodyPosition;
    let bodySize;
    let bodyMass;
    let material;

    // platform bodies
    // platform 0
    bodyPosition = new CANNON.Vec3(positionX, platformHeight / 2, positionZ);
    bodySize = platformRadiusBottom;
    bodyMass = 0;
    material = new THREE.MeshStandardMaterial({ color: 0x1f1311, roughness: 0.5 });

    createHanoyPlatform(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material, biggestRadius);

    // platform 1
    bodyPosition = new CANNON.Vec3(positionX - 0.5, platformHeight / 2, 0);
    bodySize = platformRadiusBottom;
    bodyMass = 0;
    material = new THREE.MeshStandardMaterial({ color: 0x1f1311, roughness: 0.5 });

    createHanoyPlatform(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material, biggestRadius);

    // platform 2
    bodyPosition = new CANNON.Vec3(positionX, platformHeight / 2, positionZ * -1);
    bodySize = platformRadiusBottom;
    bodyMass = 0;
    material = new THREE.MeshStandardMaterial({ color: 0x1f1311, roughness: 0.5 });

    createHanoyPlatform(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material, biggestRadius);

    // segment bodies
    // 0 segment
    bodyPosition = new CANNON.Vec3(positionX, platformHeight + height / 2, positionZ);
    bodySize = biggestRadius;
    bodyMass = 40;
    material = new THREE.MeshStandardMaterial({ color: COLORS[0], roughness: 0.9 });

    createHanoySegment(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material);

    // 1 segment
    bodyPosition = new CANNON.Vec3(positionX, platformHeight + height / 2 + height * 1, positionZ);
    bodySize = biggestRadius - 1 * radiusDecrease;
    bodyMass = 30;
    material = new THREE.MeshStandardMaterial({ color: COLORS[1], roughness: 0.9 });

    createHanoySegment(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material);

    // 2 segment
    bodyPosition = new CANNON.Vec3(positionX, platformHeight + height / 2 + height * 2, positionZ);
    bodySize = biggestRadius - 2 * radiusDecrease;
    bodyMass = 25;
    material = new THREE.MeshStandardMaterial({ color: COLORS[2], roughness: 0.9 });

    createHanoySegment(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material);

    // 3 segment
    bodyPosition = new CANNON.Vec3(positionX, platformHeight + height / 2 + height * 3, positionZ);
    bodySize = biggestRadius - 3 * radiusDecrease;
    bodyMass = 20;
    material = new THREE.MeshStandardMaterial({ color: COLORS[3], roughness: 0.9 });

    createHanoySegment(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material);

    // 4 segment
    bodyPosition = new CANNON.Vec3(positionX, platformHeight + height / 2 + height * 4, positionZ);
    bodySize = biggestRadius - 4 * radiusDecrease;
    bodyMass = 15;
    material = new THREE.MeshStandardMaterial({ color: COLORS[4], roughness: 0.9 });

    createHanoySegment(world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material);

}


const createHanoyPlatform = (world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material, biggestSegmentSize) => {
    let numEdges = 24;
    let height = 0.05;
    let pinThickness = radiusDecrease / 3;
    let pinVerticalOffset = 0.02;
    let pinEdges = 8;

    let segmentBody = new CANNON.Body({
        type: CANNON.Body,
        mass: bodyMass, // kg
        position: bodyPosition,
        shape: new CANNON.Cylinder(
            bodySize - 0.025,
            bodySize,
            height,
            numEdges
        ),
        material: new CANNON.Material({
            friction: 0.1,
            restitution: 0
        })
    });
    world.addBody(segmentBody);
    physicsObjects.push(segmentBody);

    let pinOffset = biggestSegmentSize - pinThickness + 0.02;


    for (let i = 0; i < 8; i++) {
        let offsetFactor;
        switch (i) {
            case i = 0:
                offsetFactor = new CANNON.Vec3(-pinOffset, pinVerticalOffset, 0)
                break;
            case i = 1:
                offsetFactor = new CANNON.Vec3(pinOffset, pinVerticalOffset, 0)
                break;
            case i = 2:
                offsetFactor = new CANNON.Vec3(0, pinVerticalOffset, -pinOffset)
                break;
            case i = 3:
                offsetFactor = new CANNON.Vec3(0, pinVerticalOffset, pinOffset)
                break;
            case i = 4:
                offsetFactor = new CANNON.Vec3(-pinOffset / 4 * 3 + pinThickness, pinVerticalOffset, -pinOffset / 4 * 3 + pinThickness)
                break;
            case i = 5:
                offsetFactor = new CANNON.Vec3(pinOffset / 4 * 3 - pinThickness, pinVerticalOffset, -pinOffset / 4 * 3 + pinThickness)
                break;
            case i = 6:
                offsetFactor = new CANNON.Vec3(pinOffset / 4 * 3 - pinThickness, pinVerticalOffset, pinOffset / 4 * 3 - pinThickness)
                break;
            case i = 7:
                offsetFactor = new CANNON.Vec3(-pinOffset / 4 * 3 + pinThickness, pinVerticalOffset, pinOffset / 4 * 3 - pinThickness)
                break;
            default:
                break;
        }
        segmentBody.addShape(
            new CANNON.Cylinder(
                pinThickness,
                pinThickness,
                height,
                pinEdges
            ),
            offsetFactor
        )
    }

    // segment visialization
    let segmentVisualization = new THREE.Group();
    scene.add(segmentVisualization);
    physicsObjectsVisualizations.push(segmentVisualization);

    let segmentGeometry = new THREE.CylinderGeometry(
        bodySize - 0.025,
        bodySize,
        height,
        numEdges
    );
    let segmentMesh = new THREE.Mesh(segmentGeometry, material)
    segmentVisualization.add(segmentMesh);


    for (let i = 0; i < 8; i++) {
        let segmentPinGeometry = new THREE.CylinderGeometry(
            pinThickness,
            pinThickness,
            height,
            8
        );
        let segmentPinMesh = new THREE.Mesh(segmentPinGeometry, material)
        segmentPinMesh.position.copy(segmentBody.shapeOffsets[i + 1]);
        segmentVisualization.add(segmentPinMesh);
    }

}

const createHanoySegment = (world, scene, physicsObjects, physicsObjectsVisualizations, radiusDecrease, bodyPosition, bodySize, bodyMass, material) => {

    let numEdges = 12;
    let height = 0.1;
    let pinThickness = radiusDecrease / 3;
    let pinVerticalOffset = 0.005;
    let pinEdges = 8;

    let segmentBody = new CANNON.Body({
        type: CANNON.Body,
        mass: bodyMass, // kg
        position: bodyPosition,
        shape: new CANNON.Cylinder(
            bodySize,
            bodySize,
            height,
            numEdges
        ),
    });
    world.addBody(segmentBody);
    physicsObjects.push(segmentBody);

    let pinOffset = bodySize - pinThickness;


    for (let i = 0; i < 8; i++) {
        let offsetFactor;
        switch (i) {
            case i = 0:
                offsetFactor = new CANNON.Vec3(-pinOffset, pinVerticalOffset, 0)
                break;
            case i = 1:
                offsetFactor = new CANNON.Vec3(pinOffset, pinVerticalOffset, 0)
                break;
            case i = 2:
                offsetFactor = new CANNON.Vec3(0, pinVerticalOffset, -pinOffset)
                break;
            case i = 3:
                offsetFactor = new CANNON.Vec3(0, pinVerticalOffset, pinOffset)
                break;
            case i = 4:
                offsetFactor = new CANNON.Vec3(-pinOffset / 4 * 3 + pinThickness, pinVerticalOffset, -pinOffset / 4 * 3 + pinThickness)
                break;
            case i = 5:
                offsetFactor = new CANNON.Vec3(pinOffset / 4 * 3 - pinThickness, pinVerticalOffset, -pinOffset / 4 * 3 + pinThickness)
                break;
            case i = 6:
                offsetFactor = new CANNON.Vec3(pinOffset / 4 * 3 - pinThickness, pinVerticalOffset, pinOffset / 4 * 3 - pinThickness)
                break;
            case i = 7:
                offsetFactor = new CANNON.Vec3(-pinOffset / 4 * 3 + pinThickness, pinVerticalOffset, pinOffset / 4 * 3 - pinThickness)
                break;
            default:
                break;
        }
        segmentBody.addShape(
            new CANNON.Cylinder(
                pinThickness,
                pinThickness,
                height,
                pinEdges
            ),
            offsetFactor
        )
    }

    // segment visialization
    let segmentVisualization = new THREE.Group();
    scene.add(segmentVisualization);
    physicsObjectsVisualizations.push(segmentVisualization);

    let segmentGeometry = new THREE.CylinderGeometry(
        bodySize,
        bodySize,
        height,
        numEdges
    );
    let segmentMesh = new THREE.Mesh(segmentGeometry, material)
    segmentVisualization.add(segmentMesh);


    for (let i = 0; i < 8; i++) {
        let segmentPinGeometry = new THREE.CylinderGeometry(
            pinThickness,
            pinThickness,
            height,
            8
        );
        let segmentPinMesh = new THREE.Mesh(segmentPinGeometry, material)
        segmentPinMesh.position.copy(segmentBody.shapeOffsets[i + 1]);
        segmentVisualization.add(segmentPinMesh);
    }

}


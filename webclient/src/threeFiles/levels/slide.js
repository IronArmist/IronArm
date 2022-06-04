import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import { COLORS } from '../../settings.js';

export const slide = (scene, world, physicsObjects, physicsObjectsVisualizations) => {
    createSlide(scene, world, physicsObjects, physicsObjectsVisualizations);

    let ballAmount = 10;
    createBalls(ballAmount, scene, world, physicsObjects, physicsObjectsVisualizations);
}

const createSlide = (scene, world, physicsObjects, physicsObjectsVisualizations) => {

    let slideWidth = 0.135;
    let slideHeight = 0.02;
    let slideLength = 1.2;
    let slideOffset = 0.15

    let wallWidth = 0.01;
    let wallHeight = 0.7;
    let wallLength = 1.2;

    let slidePositionX = 1.35;
    let slidePositionY = wallHeight + 0.2;
    let slidePositionZ = -0.65;

    let vertWallWidth = slideWidth;
    let verWallHeight = wallHeight;
    let verWallLength = wallWidth;

    // ---
    // slide bodies
    let slideCompoundBody = new CANNON.Body({
        mass: 1000, // kg
        position: new CANNON.Vec3(slidePositionX, slidePositionY, slidePositionZ),
        type: CANNON.Body,
        material: new CANNON.Material({
            friction: 0.1,
            restitution: 0.1
        })
    });
    world.addBody(slideCompoundBody);
    physicsObjects.push(slideCompoundBody);

    slideCompoundBody.quaternion.y += 0.35

    // bottom
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            slideWidth,
            slideHeight * 2,
            slideLength - 0.05,
        )),
        new CANNON.Vec3(
            0,
            -0.08,
            -slideOffset
        ),
        new CANNON.Quaternion(
            0.22,
            0,
            0.025,
            1
        )
    );

    // wall 0
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            wallWidth,
            wallHeight,
            wallLength
        )),
        new CANNON.Vec3(
            slideWidth,
            0,
            0
        )
    );

    // wall 1
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            wallWidth,
            wallHeight - 0.1,
            wallLength - slideOffset - 0.08
        )),
        new CANNON.Vec3(
            - slideWidth,
            -0.1,
            -slideOffset - 0.08
        )
    );

    // vertWall 0
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            vertWallWidth,
            verWallHeight,
            verWallLength
        )),
        new CANNON.Vec3(
            0,
            0,
            - wallLength
        )
    );

    // vertWall 1
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            vertWallWidth,
            verWallHeight - 0.1,
            verWallLength
        )),
        new CANNON.Vec3(
            0,
            -0.1,
            wallLength + 0.015
        ),
        new CANNON.Quaternion(
            0,
            0.025,
            0,
            1
        )
    );

    // top
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            slideWidth,
            slideHeight,
            slideLength - slideOffset * 2,
        )),
        new CANNON.Vec3(
            0,
            wallHeight - 0.2 - slideHeight,
            slideOffset * 2
        ),
    );

    let basketLength = 0.4;
    let basketHeigth = 0.05

    // basketPart 0
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            basketLength,
            basketHeigth,
            0.01
        )),
        new CANNON.Vec3(
            -basketLength - vertWallWidth,
            -verWallHeight + basketHeigth,
            wallLength + 0.05
        )
    );

    // basketPart 1
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            basketLength,
            basketHeigth,
            0.01
        )),
        new CANNON.Vec3(
            -basketLength - vertWallWidth,
            -verWallHeight + basketHeigth,
            0
        )
    );

    // basketPart 2
    slideCompoundBody.addShape(
        new CANNON.Box(new CANNON.Vec3(
            0.01,
            basketHeigth,
            basketLength + 0.215,
        )),
        new CANNON.Vec3(
            -basketLength * 2 - vertWallWidth + wallWidth,
            -verWallHeight + basketHeigth,
            wallLength / 2 + 0.025
        )
    );

    // ---
    // slide visualizations
    let slideMaterial = new THREE.MeshStandardMaterial({ color: 0x334488, roughness: 0, transparent: true, opacity: 0.7 })

    let slideVisualizationGroup = new THREE.Group();
    scene.add(slideVisualizationGroup);
    physicsObjectsVisualizations.push(slideVisualizationGroup);

    // bottom
    let slideBottomGeometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[0].halfExtents.x * 2,
        slideCompoundBody.shapes[0].halfExtents.y * 2,
        slideCompoundBody.shapes[0].halfExtents.z * 2
    );
    let slideBottomMesh = new THREE.Mesh(slideBottomGeometry, slideMaterial);
    slideBottomMesh.position.copy(slideCompoundBody.shapeOffsets[0]);
    slideBottomMesh.quaternion.copy(slideCompoundBody.shapeOrientations[0]);

    slideVisualizationGroup.add(slideBottomMesh);

    // wall 0
    let slideWall0Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[1].halfExtents.x * 2,
        slideCompoundBody.shapes[1].halfExtents.y * 2,
        slideCompoundBody.shapes[1].halfExtents.z * 2
    );
    let slideWall0Mesh = new THREE.Mesh(slideWall0Geometry, slideMaterial);
    slideWall0Mesh.position.copy(slideCompoundBody.shapeOffsets[1]);
    slideWall0Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[1]);

    slideVisualizationGroup.add(slideWall0Mesh);

    // wall 1
    let slideWall1Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[2].halfExtents.x * 2,
        slideCompoundBody.shapes[2].halfExtents.y * 2,
        slideCompoundBody.shapes[2].halfExtents.z * 2
    );
    let slideWall1Mesh = new THREE.Mesh(slideWall1Geometry, slideMaterial);
    slideWall1Mesh.position.copy(slideCompoundBody.shapeOffsets[2]);
    slideWall1Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[2]);

    slideVisualizationGroup.add(slideWall1Mesh);

    // vertWall 0
    let vertWal0Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[3].halfExtents.x * 2,
        slideCompoundBody.shapes[3].halfExtents.y * 2,
        slideCompoundBody.shapes[3].halfExtents.z * 2
    );
    let vertWal0Mesh = new THREE.Mesh(vertWal0Geometry, slideMaterial);
    vertWal0Mesh.position.copy(slideCompoundBody.shapeOffsets[3]);
    vertWal0Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[3]);

    slideVisualizationGroup.add(vertWal0Mesh);

    // vertWall 1
    let vertWal1Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[4].halfExtents.x * 2,
        slideCompoundBody.shapes[4].halfExtents.y * 2,
        slideCompoundBody.shapes[4].halfExtents.z * 2
    );
    let vertWal1Mesh = new THREE.Mesh(vertWal1Geometry, slideMaterial);
    vertWal1Mesh.position.copy(slideCompoundBody.shapeOffsets[4]);
    vertWal1Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[4]);

    slideVisualizationGroup.add(vertWal1Mesh);

    // top
    let slideTopGeometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[5].halfExtents.x * 2,
        slideCompoundBody.shapes[5].halfExtents.y * 2,
        slideCompoundBody.shapes[5].halfExtents.z * 2
    );
    let slideTopMesh = new THREE.Mesh(slideTopGeometry, slideMaterial);
    slideTopMesh.position.copy(slideCompoundBody.shapeOffsets[5]);
    slideTopMesh.quaternion.copy(slideCompoundBody.shapeOrientations[5]);

    slideVisualizationGroup.add(slideTopMesh);

    // basketPart0
    let basketPart0Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[6].halfExtents.x * 2,
        slideCompoundBody.shapes[6].halfExtents.y * 2,
        slideCompoundBody.shapes[6].halfExtents.z * 2
    );
    let basketPart0Mesh = new THREE.Mesh(basketPart0Geometry, slideMaterial);
    basketPart0Mesh.position.copy(slideCompoundBody.shapeOffsets[6]);
    basketPart0Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[6]);

    slideVisualizationGroup.add(basketPart0Mesh);

    // basketPart1
    let basketPart1Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[7].halfExtents.x * 2,
        slideCompoundBody.shapes[7].halfExtents.y * 2,
        slideCompoundBody.shapes[7].halfExtents.z * 2
    );
    let basketPart1Mesh = new THREE.Mesh(basketPart1Geometry, slideMaterial);
    basketPart1Mesh.position.copy(slideCompoundBody.shapeOffsets[7]);
    basketPart1Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[7]);

    slideVisualizationGroup.add(basketPart1Mesh);

    // basketPart2
    let basketPart2Geometry = new THREE.BoxGeometry(
        slideCompoundBody.shapes[8].halfExtents.x * 2,
        slideCompoundBody.shapes[8].halfExtents.y * 2,
        slideCompoundBody.shapes[8].halfExtents.z * 2
    );
    let basketPart2Mesh = new THREE.Mesh(basketPart2Geometry, slideMaterial);
    basketPart2Mesh.position.copy(slideCompoundBody.shapeOffsets[8]);
    basketPart2Mesh.quaternion.copy(slideCompoundBody.shapeOrientations[8]);

    slideVisualizationGroup.add(basketPart2Mesh);

}

const createBalls = (ballAmount, scene, world, physicsObjects, physicsObjectsVisualizations) => {

    let amount = ballAmount;

    let testObjectSize = 0.09;
    let testObjectPosition = new CANNON.Vec3(
        0.65,
        5.2,
        - 1.45
    )

    let generationFrequency = 700;

    let ballCreator = setInterval(() => {
        let testObjectBody = new CANNON.Body({
            type: CANNON.Body,
            mass: 20, // kg
            position: testObjectPosition,
            shape: new CANNON.Sphere(
                testObjectSize,
            ),
            quaternion: new CANNON.Quaternion(
                0,
                0,
                0.75,
                1
            )
        });
        world.addBody(testObjectBody);
        physicsObjects.push(testObjectBody);
        // testObject
        let testObjectGeometry = new THREE.SphereGeometry(
            testObjectSize,
        );
        let testObjectMesh = new THREE.Mesh(
            testObjectGeometry,
            new THREE.MeshStandardMaterial({ color: chooseRandomColor(), roughness: 0.9 })
        );
        testObjectMesh.position.copy(testObjectBody.position);
        //testObjectMesh.quaternion.copy(testObjectBody.quaternion);

        scene.add(testObjectMesh);
        physicsObjectsVisualizations.push(testObjectMesh);

        testObjectSize -= 0.003
        amount--;
        if (amount <= 0) {
            clearInterval(ballCreator);
        }
    }, generationFrequency);

}

const chooseRandomColor = () => {
    const random = Math.random();
    const index = random * COLORS.length - 1 | 0;
    return COLORS[index];
}
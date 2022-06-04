import * as THREE from 'three';

export const createLights = (scene) => {
    // lights
    // ambient light
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.3);
    scene.add(ambientLight);

    // directional light 1
    let directionalLight = new THREE.DirectionalLight(0xaaaaaa, 2);
    directionalLight.position.set(3, 4, -3);
    directionalLight.target.position.set(0, 1, 0)
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    // directional light 2
    let directionalLight2 = new THREE.DirectionalLight(0xaaaaaa, 3);
    directionalLight2.position.set(-1, 1, 2);
    directionalLight2.target.position.set(0, 1, -1);
    scene.add(directionalLight2);
    scene.add(directionalLight2.target);

    // spotlight front
    let spotLight = new THREE.SpotLight(0xddddbb, 3.75);
    spotLight.position.set(0, 1, 7);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.5;
    spotLight.decay = 2;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.focus = 1;
    scene.add(spotLight);

    // spotlight ceiling
    let spotLight2 = new THREE.SpotLight(0xddddbb, 0.5);
    spotLight2.position.set(0, 5, 0);
    spotLight2.target.position.set(0, 0, 0);
    spotLight2.angle = Math.PI / 5;
    spotLight2.penumbra = 0.7;
    spotLight2.decay = 2;
    spotLight2.castShadow = true;
    spotLight2.shadow.mapSize.width = 512;
    spotLight2.shadow.mapSize.height = 512;
    spotLight2.shadow.camera.near = 1;
    spotLight2.shadow.camera.far = 200;
    spotLight2.shadow.focus = 1;
    scene.add(spotLight2);

    // spotlight back
    let spotLight3 = new THREE.SpotLight(0xddddbb, 1);
    spotLight3.position.set(0, 3, -9);
    spotLight3.target.position.set(0, 2, 0);
    spotLight3.angle = Math.PI / 5;
    spotLight3.penumbra = 0.8;
    spotLight3.decay = 0;
    spotLight3.castShadow = true;
    spotLight3.shadow.mapSize.width = 512;
    spotLight3.shadow.mapSize.height = 512;
    spotLight3.shadow.camera.near = 1;
    spotLight3.shadow.camera.far = 200;
    spotLight3.shadow.focus = 1;
    scene.add(spotLight3);
};
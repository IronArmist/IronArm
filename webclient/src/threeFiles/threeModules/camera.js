import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const createCamera = (scene, renderer, threeContainer) => {
    const camera = new THREE.PerspectiveCamera(
        75,
        (threeContainer.offsetWidth) / (threeContainer.offsetWidth / 2),
        0.1,
        1000
    );
    camera.position.set(0, 1, 2.5);

    // make camera movable with mouse control
    const cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.minDistance = 0.5;
    cameraControls.maxDistance = 5;
    cameraControls.maxPolarAngle = Math.PI / 2 + 0.25;
    cameraControls.minPolarAngle = 0;
    cameraControls.target.setY(1);
    cameraControls.update();

    return camera;
};
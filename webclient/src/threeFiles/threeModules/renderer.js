import * as THREE from 'three';

export const createRenderer = (threeContainer) => {
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetWidth / 2);
    threeContainer.appendChild(renderer.domElement);

    // adapt canvas-size, when user resizes browser window
    window.addEventListener('resize', event => {
        renderer.setSize(threeContainer.offsetWidth, threeContainer.offsetWidth / 2);
    });

    return renderer;
};
import * as THREE from 'three';

let scene, camera, renderer, stars = [], starSpeed = 0.05, animationFrameId;

const sentences = [
    "Fetching bad designs...",
    "ERROR: Only bad designs found! - Rebuilding definition..."
];

let currentSentenceIndex = 0;

function init() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create stars
    const starGeometry = new THREE.SphereGeometry(0.05, 24, 24);
    const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 1000; i++) {
        const star = new THREE.Mesh(starGeometry, starMaterial);
        resetStar(star);
        scene.add(star);
        stars.push(star);
    }

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function resetStar(star) {
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
}

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    stars.forEach(star => {
        star.position.z += starSpeed;
        if (star.position.z > camera.position.z) {
            resetStar(star);
            star.position.z = -100;
        }
    });

    renderer.render(scene, camera);
}

function createTextAnimation() {
    const textElement = document.createElement("div");
    textElement.classList.add("text");
    textElement.textContent = sentences[currentSentenceIndex];

    document.body.appendChild(textElement);

    // Increase the index and reset after all sentences are shown
    currentSentenceIndex = (currentSentenceIndex + 1) % sentences.length;

    setTimeout(() => {
        textElement.remove();
        createTextAnimation(); // Recurse to show the next sentence
    }, 15000); // Duration of sentence (matches the animation duration)
}

function startLightspeedAnimation() {
    starSpeed = 2; // Increase speed for lightspeed effect

    setTimeout(() => {
        cancelAnimationFrame(animationFrameId);
        window.location.href = 'target/index.html';
    }, 2000); // Duration of the lightspeed effect
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector(".button");
    button.addEventListener("click", () => {
        document.body.innerHTML = ""; // Clear content
        init();
        animate();
        createTextAnimation(); // Start text animation
        startLightspeedAnimation();
    });
});
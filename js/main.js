import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5); // Ajuste na posição da câmera

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement); // Configura os controles para a câmera
controls.enableDamping = true; // Ativa o amortecimento (suavização)
controls.dampingFactor = 0.25; // Fator de suavização
controls.enableZoom = true; // Habilita o zoom
let moveForward = false;
let moveBackward = false;
let rotateLeft = false;
let rotateRight = false;
const moveSpeed = 0.1;
const rotateSpeed = 0.05;

class Carro {
    constructor() {
        this.model = null;
        this.load();
    }

    load() {
        const loader = new GLTFLoader();
        loader.load('modelo/carro.glb', (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
            console.log('Modelo carregado com sucesso!');
            this.model.position.set(0, 0.6, 0);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo:', error);
        });
    }

    update() {
        if (this.model) {
            if (moveForward) this.model.translateZ(+moveSpeed);
            if (moveBackward) this.model.translateZ(-moveSpeed);
            if (rotateLeft) this.model.rotation.y += rotateSpeed;
            if (rotateRight) this.model.rotation.y -= rotateSpeed;
        }
        
    }
}

const carro1 = new Carro();

// Adicionando luz ambiente e direcional
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Adicionando um plano para visualização
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

function animate() {
    requestAnimationFrame(animate);
    carro1.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp': moveForward = true; 
        break;
        case 'ArrowDown': moveBackward = true;
         break;
        case 'ArrowLeft': rotateLeft = true; break;
        case 'ArrowRight': rotateRight = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp': moveForward = false; break;
        case 'ArrowDown': moveBackward = false; break;
        case 'ArrowLeft': rotateLeft = false; break;
        case 'ArrowRight': rotateRight = false; break;
    }
});

// Ajustando o tamanho do canvas ao redimensionar a janela
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

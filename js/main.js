import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 7,90); // ajusta a camera

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement); // Configura os controles para a câmera
controls.enableDamping = true; // Ativa o amortecimento (suavização)
controls.dampingFactor = 0.25; // Fator de suavização
controls.enableZoom = true; // Habilita o zoom
// variavel de movimentçao do carro
let moveForward = false; // mover para frente
let moveBackward = false; // mover para atras
let rotateLeft = false;       // para direita
let rotateRight = false;    // para esqueda
const moveSpeed = 0.3;          //movimento do carro
const rotateSpeed = 0.05;   // movient para vira para o lados
let selectedCarIndex = 0; // Índice do carro atualmente controlado
class Carros{

    constructor(modelPath, initialPosition, scale, rotacion){
        this.model = null;
        this.load(modelPath, initialPosition, scale, rotacion);
    }
    load(modelPath, initialPosition, scale, rotacion) {
        const loader = new GLTFLoader();
        loader.load(modelPath, (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
            console.log('Modelo carregado com sucesso!');
            // this.model.position.set(5, 2.3, +80);
            // this.model.rotation.y -= 3.2;
            // this.model.scale.set(3,3,3);
            this.model.rotation.set(rotacion.x,rotacion.y, rotacion.z)
            this.model.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
            this.model.scale.set(scale.x, scale.y, scale.z);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo:', error);
        });
    }
    moverCar(index) {
        if (this.model && index === selectedCarIndex)  {
            if (moveForward) this.model.translateZ(+moveSpeed);
            if (moveBackward) this.model.translateZ(-moveSpeed);
            if (rotateLeft ) this.model.rotation.y += rotateSpeed;
            if (rotateRight) this.model.rotation.y -= rotateSpeed;

            camera.position.x = this.model.position.x;
            camera.position.y = this.model.position.y + 25;
            camera.position.z = this.model.position.z + 30;
            camera.lookAt(this.model.position);
        }
        
    }
}
class Cenario{
    constructor(){
        this.model = null;
        this.load();
    }
    load() {
        const loader = new GLTFLoader();
        loader.load('modelo/cenario.glb', (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
            console.log('Modelo carregado com sucesso!');
            this.model.position.set(0, 0, 0); // ajsutando a posiçao do cenario no origem

            this.model.rotation.x = Math.PI / 2; // aplicando um rotçao de 90 grau no eixo x
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo:', error);
        });
    }
 
}



const cenario = new Cenario()
// Adicionando luz ambiente e direcional
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);
// const carro1 = new Carros();
const carros = []; // array liste de carros
// carregando os modelos de carros para adcionar varios modelos
carros.push(new Carros('modelo/carro.glb', new THREE.Vector3(5, 2.3, 80), new THREE.Vector3(3, 3, 3), new THREE.Vector3(0,-3.2, 0)));
carros.push(new Carros('modelo/carro2.glb', new THREE.Vector3(5, 2.3, 10), new THREE.Vector3(3, 3, 3), new THREE.Vector3(0,-3.2, 0)));
function animate() {
    requestAnimationFrame(animate);
    // Mover apenas o carro selecionado
    carros.forEach((carro, index) => {
        carro.moverCar(index);
    });
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// para evento de preciona tecla 

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
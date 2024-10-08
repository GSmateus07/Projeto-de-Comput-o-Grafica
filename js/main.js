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
const moveSpeed = 0.5;          //movimento do carro
const rotateSpeed = 0.05;   // movient para vira para o lados
let selectedCarIndex = 0; // Índice do carro atualmente controlado
const maxSpeed = 1; // velocidade maxima do carro
let currentSpeed = 0; // velocidade atual
const accleration = 0.1; // acelareçao do carro
const deceleration = 0.05; // desacereçao quando a tecla e solta  o carro vai desacereando


// variavel reconado a aviao
let r =65;
let theta = 0;
let phi = Math.PI / 4; // angulo de azimutal

class Carros{

    constructor(modelPath, initialPosition, scale, rotacion){
        this.model = null;
        this.load(modelPath, initialPosition, scale, rotacion);
        this.path = []; // Inicializa path como um array vazio
        this.currentPathIndex = 0;
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
            if (moveForward) {
                this.model.translateZ(+moveSpeed);
            }
            if (moveBackward) this.model.translateZ(-moveSpeed);
            if (moveForward || moveBackward){
                if (rotateLeft ) this.model.rotation.y += rotateSpeed;
                if (rotateRight) this.model.rotation.y -= rotateSpeed;
            }
          

            camera.position.x = this.model.position.x;
            camera.position.y = this.model.position.y + 25;
            camera.position.z = this.model.position.z + 30;
            camera.lookAt(this.model.position);
        } else {
            // Movimentação do carro automático
            this.moveAutomatically();
        }
        
    }
    moveAutomatically() {
        // Verifica se o modelo foi carregado
        if (!this.model) {
            console.warn("Modelo não carregado ainda.");
            return; // Saia se o modelo ainda não estiver carregado
        }
    
        console.log("Caminho atual:", this.path);
        if (!this.path.length) return; // Se path estiver vazio, não faz nada
    
        const target = this.path[this.currentPathIndex];
        if (target) {
            const direction = new THREE.Vector3().subVectors(target, this.model.position).normalize();
            const distance = this.model.position.distanceTo(target);
    
            // Se o carro estiver próximo o suficiente do ponto, muda para o próximo ponto
            if (distance < 1) {
                this.currentPathIndex = (this.currentPathIndex + 1) % this.path.length; // Muda para o próximo ponto
            } else {
                // Move o carro em direção ao ponto alvo
                this.model.position.add(direction.multiplyScalar(0.3)); // Aumente ou diminua a velocidade ajustando o fator
                this.model.lookAt(target); // Faz o carro olhar para o ponto alvo
            }
        }
    }

    setPath(pathPoints) {
        this.path = pathPoints;
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

            // this.model.rotation.x = Math.PI / 2; // aplicando um rotçao de 90 grau no eixo x
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo:', error);
        });
    }
 
}

class Aviao{
    constructor(){
        this.model = null;
        this.load();
        this.r = 68;
        this.theta = 0;
        this.phi = Math.PI / 4;
    }
    load() {
        const loader = new GLTFLoader();
        loader.load('modelo/aviao.glb', (gltf) => {
            this.model = gltf.scene;
            scene.add(this.model);
            console.log('Modelo carregado com sucesso!');
            this.model.position.set(0, 10, 0); // ajsutando a posiçao do cenario no origem
            this.model.scale.set(0.1,0.1,0.1);
        }, undefined, (error) => {
            console.error('Erro ao carregar o modelo:', error);
        });
    }
    // converte coordenadoas esferica para cartesinas 
    updatePosition() {
        // Converter coordenadas esféricas para cartesianas
        const x = this.r * Math.sin(this.phi) * Math.cos(this.theta);
        const y = this.r * Math.cos(this.phi);
        const z = this.r * Math.sin(this.phi) * Math.sin(this.theta);

        // Atualizar a posição do modelo
        if (this.model) {
            this.model.position.set(x, y + 15, z); // +10 para ajustar a altura

            // Atualizar a orientação do avião para olhar na direção do movimento
            const target = new THREE.Vector3(
                this.r * Math.sin(this.phi) * Math.cos(this.theta -0.1),
                y + 15,
                this.r * Math.sin(this.phi) * Math.sin(this.theta - 0.1)
            );
            this.model.lookAt(target);
        }
    }

    moveForwardAutomatic() {
        // Aumenta o ângulo azimutal e controla a elevação para um movimento automático
        this.theta += 0.01; // Controla o movimento horizontal
        if (this.theta > Math.PI * 2) this.theta -= Math.PI * 2; // Loop completo horizontal

        // Controle de subida e descida automático (opcional)
        this.phi += 0.005; // Muda a inclinação para cima ou para baixo
        if (this.phi > Math.PI / 2) this.phi = Math.PI / 2; // Limitar para não passar 90 graus
        if (this.phi < 0) this.phi = 0; // Limitar para não ir abaixo do chão
    }
 
}

const aviao = new Aviao();

const cenario = new Cenario()
// Adicionando luz ambiente e direcional
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

const carro1 = new Carros('modelo/carro.glb', new THREE.Vector3(5, 2.3, 85), new THREE.Vector3(3, 3, 3), new THREE.Vector3(0, -3.2, 0));
const carros = [carro1];

// Carro que se movimenta automaticamente
const carro2 = new Carros('modelo/carro2.glb', new THREE.Vector3(5, 2.3, 10), new THREE.Vector3(3, 3, 3), new THREE.Vector3(0, -3.2, 0));
carro2.setPath([
    new THREE.Vector3(5, 2.3, 65),   // Ponto inicial
    new THREE.Vector3(65, 2.3, 65),  // Ponto 1 (direita)
    new THREE.Vector3(65, 2.3, -5), // Ponto 2 (cima)
    new THREE.Vector3(5, 2.3, -10),   // Ponto 3 (esquerda)
    new THREE.Vector3(5, 2.3, 65), // para  Ponto 4 (baixo)
    new THREE.Vector3(-65, 2.3, 65), //para direita
    new THREE.Vector3(-65, 2.3, -5), //para direita  para cima
    new THREE.Vector3(5, 2.3, -10), // para direita
    
]);
carros.push(carro2);

const carro3 = new Carros('modelo/carro2.glb', new THREE.Vector3(5, 2.3, -15), new THREE.Vector3(3, 3, 3), new THREE.Vector3(0, -3.2, 0));
carro3.setPath([
     new THREE.Vector3(5, 2.3, -15),   // Ponto inicial
    new THREE.Vector3(5, 2.3, -55),  // Ponto 1 (frente)
     new THREE.Vector3(-55, 2.3, -50), // Ponto 2 (esqueda)
    new THREE.Vector3(-55, 2.3, -5),   // Ponto 3 (frente)
    new THREE.Vector3(5, 2.3, -5), // para  Ponto 4 (lado)
    new THREE.Vector3(5, 2.3, -55),
    new THREE.Vector3(55, 2.3, -55), 
    new THREE.Vector3(55, 2.3, 55), 
    new THREE.Vector3(-5, 2.3, 55),
    new THREE.Vector3(-5, 2.3, -15),

    
]);
carros.push(carro3);
function animate() {
    requestAnimationFrame(animate);
    // Mover apenas o carro selecionado
    carros.forEach((carro, index) => {
        carro.moverCar(index);
    });
    aviao.moveForwardAutomatic();
    aviao.updatePosition();
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
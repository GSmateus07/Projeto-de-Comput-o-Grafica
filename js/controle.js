import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Função para inicializar os controles
export function initControles(camera, rendererDomElement) {
    const controls = new OrbitControls(camera, rendererDomElement); // Configura os controles para a câmera
    controls.enableDamping = true; // Ativa o amortecimento (suavização)
    controls.dampingFactor = 0.25; // Fator de suavização
    controls.enableZoom = true; // Habilita o zoom
    
    // Função para atualizar os controles em cada frame
    function update() {
        controls.update(); // Atualiza os controles com amortecimento
    }

    return { controls, update };
}


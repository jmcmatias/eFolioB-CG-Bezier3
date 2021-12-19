import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'

// renderer 
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// Camera
let camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 20);

// Raycaster
const raycaster = new THREE.Raycaster(); 

// Axis Helper
const axisLength = 10;        //Comprimento dos eixos
let axes = new THREE.AxesHelper(axisLength);  // inicializa os eixos com comprimento axisLength

// controls 
const controls = new OrbitControls(camera, renderer.domElement);

// Lights

    // Directional
const directionalLight = {
    top: new THREE.DirectionalLight(0xffffff, 1, 1000),
    bottom: new THREE.DirectionalLight(0xffffff, 1, 1000),
    front: new THREE.DirectionalLight(0xffffff, 1, 1000)
};


directionalLight.top.position.set(0, 0, 50); //
directionalLight.top.castShadow = true;

directionalLight.bottom.position.set(0, 0, -50);
directionalLight.bottom.castShadow = true;

directionalLight.front.position.set(0, -50, 0);
directionalLight.front.castShadow = true;

// Scene
let scene = new THREE.Scene();

// Função que insere o renderer no DOM, criação do node canvas
function getRenderer() {
    document.body.appendChild(renderer.domElement);
}

// Função recursiva que mantém a scene atualizada com o renderer
function animate() {
    //controls.update(); 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

// Função que tem como argumento uma função que contem a inicialização da cena base
function resetScene(baseScene) {            
    scene.remove.apply(scene, scene.children);  // Remove todos os filhos da scene (apaga tudo)
    baseScene();                                // Repõe a cena base
}

// Função que muda o aspect ratio da janela e atualiza o tamanho desta no renderer
// Acrescentei esta funcionalidade para que não fiquem zonas brancas ao redimensionar a janela do browser
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export { renderer, camera, raycaster, axes, controls, scene, directionalLight, animate, getRenderer, resize, resetScene };
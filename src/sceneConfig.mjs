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


export { renderer, camera, raycaster, axes, controls, scene, directionalLight };
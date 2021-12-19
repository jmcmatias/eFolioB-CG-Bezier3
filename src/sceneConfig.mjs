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
const lightTop = new THREE.DirectionalLight(0xffffff, 1, 1000);
const lightBot = new THREE.DirectionalLight(0xffffff, 1, 1000);

lightTop.position.set(0, 0, 100); //
lightTop.castShadow = true;

lightBot.position.set(0, 0, -100);
lightBot.castShadow = true;

// Scene
let scene = new THREE.Scene();

export { renderer, camera, raycaster, axes, controls, scene, lightTop, lightBot };
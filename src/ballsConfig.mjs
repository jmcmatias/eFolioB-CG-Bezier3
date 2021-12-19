import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

var balls = [];              //array que irá receber as bolas 

var bSelected = {
    selected: false,
    ball: 0
};

// Objetos que para representar as configurações dos pontos
let C0 = {
    color: "yellow",
    position: new THREE.Vector3(-4, -4, 0),
    startPosition: new THREE.Vector3(-4, -4, 0)
};

let C1 = {
    color: "red",
    position: new THREE.Vector3(-4, 4, 0),
    startPosition: new THREE.Vector3(-4, 4, 0)
};

let C2 = {
    color: "green",
    position: new THREE.Vector3(4, 4, 0),
    startPosition: new THREE.Vector3(4, 4, 0)

};

let C3 = {
    color: "blue",
    position: new THREE.Vector3(4, -4, 0),
    startPosition: new THREE.Vector3(4, -4, 0)

};

export {balls, bSelected, C0, C1, C2, C3};
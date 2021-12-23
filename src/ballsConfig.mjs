import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

// Objecto para controlo da bola selecionada
let bSelected = {
    selected: false,    // Booleano que controla se existe alguma bola selecionada
    ball: 0             // numero da bola selecionada 0 (C0),1(C1),2(C2) ou 3(C3)
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

export { bSelected, C0, C1, C2, C3 };
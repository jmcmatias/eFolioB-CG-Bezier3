/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.124.0/examples/jsm/controls/OrbitControls.js'
import { displayRaster, createSphere, createBezier3 } from './myObjects.mjs';

let renderer, scene, camera, controls, axes;  //Variaveis para funcionamento do THREE.js 

let pixels = [];              //Array que irá receber os pixeis do displayRaster
const axisLength = 10;        //Comprimento dos eixos
var balls = [];              //array que irá receber as bolas 
let rasterDisplaySize = 10;   //tamanho da grelha inicial de pixeis, poderá mudar a pedido do utilizador
let displayRasterGroup = new THREE.Group();
const pixelSize = 1;          //tamanho do pixel irão manter-se sempre a 1

const tileColor = 0xffff00;            //0xffff00 - amarelo
const gridColor1 = 0xff8000;            //0xff8000 - laranja
const gridColor2 = 0x408080;            //0x408080 - azulado
//const intersectedPixelColor = 0xff0000; //0xff0000 - Vermelho

let bSelected = {
    selected: false,
    ball: 0
};

// Objetos que para representar as configurações dos pontos
let C0 = {
    color: "yellow",
    position: new THREE.Vector3(-4, -4, 0),
    startPosition: new THREE.Vector3(-4, -4, 0)
}

let C1 = {
    color: "red",
    position: new THREE.Vector3(-4, 4, 0),
    startPosition: new THREE.Vector3(-4, 4, 0)
}

let C2 = {
    color: "green",
    position: new THREE.Vector3(4, 4, 0),
    startPosition: new THREE.Vector3(4, 4, 0)

}

let C3 = {
    color: "blue",
    position: new THREE.Vector3(4, -4, 0),
    startPosition: new THREE.Vector3(4, -4, 0)

}

const raycaster = new THREE.Raycaster(); // cria uma instancia de raycaster 
let mouse = new THREE.Vector2();         // cria um vector2 para receber as posições do rato devolvidas por onMouseMove 
let mouseIntersects = new THREE.Vector2();

init();
animate();

function init() {
    // renderer 
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.body.appendChild(renderer.domElement);
    // scene 
    scene = new THREE.Scene();
    // camera
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 20);
    //camera.lookAt(scene.position);

    // controls 
    controls = new OrbitControls(camera, renderer.domElement);

    // ambient 
    const lightTop = new THREE.DirectionalLight(0xffffff, 1, 1000);
    const lightBot = new THREE.DirectionalLight(0xffffff, 1, 1000);

    lightTop.position.set(0, 0, 100); //
    lightTop.castShadow = true;

    lightBot.position.set(0, 0, -100);
    lightBot.castShadow = true;
    scene.add(lightTop);
    scene.add(lightBot);

    const size = 20;
    const divisions = 10;

    //const gridHelper = new THREE.GridHelper(size, divisions);
    //scene.add(gridHelper);

    // Desenha os eixos 
    getAxes();
    // Desenha o Display Raster
    getDisplayRaster();
    // Desenha as bolas 
    getBalls();

 
}
// EventListener que devolve a posição do rato quando este se move com as coordenadas normalizadas e chama a função onMouseMove
document.body.addEventListener('mousemove', onMouseMove, false);

// Função que irá receber um callback com a ultima posição do rato x e y
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    if (bSelected.selected) {
        intersectionPoint();
        updateCoordenates();
        let C = balls[bSelected.ball];
        let newXY = new THREE.Vector3();
        raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
        const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
        //console.log(intersects);
        if (intersects.length > 0) {                               // Se existir alguma interseção
            newXY = intersects[0].point;
            C.position.x = newXY.x;
            C.position.y = newXY.y;
        }

    }
    // console.log(mouse);
}

function getBalls() {
    balls.push(createSphere(C0));
    balls.push(createSphere(C1));
    balls.push(createSphere(C2));
    balls.push(createSphere(C3));

    scene.add(balls[0]);
    scene.add(balls[1]);
    scene.add(balls[2]);
    scene.add(balls[3]);
}

//Função que insere o display raster na scene
function getDisplayRaster() {

    pixels = displayRaster(rasterDisplaySize, pixelSize, gridColor1, gridColor2); // Coloca os objetos (mesh) pixeis no array pixels
    pixels.every(pixel => scene.add(pixel)); // desenha cada um deles na scene*/
    //scene.add(pixels);
}

// Função que vai inserir os eixos na scene
function getAxes() {
    axes = new THREE.AxesHelper(axisLength);  // inicializa os eixos com comprimento axisLength
    axes.position.z = 0.05      // coloca os eixos um pouco acima do display raster para que se vejam bem
    scene.add(axes);            // adiciona á scene
}

function ballSelected(i) {
    bSelected.selected = true;
    bSelected.ball = i;
    balls[i].material.transparent = false;
    showCoordenates(balls[i]);

}

function ballDeselected() {
    let C = balls[bSelected.ball];
    let newXY = new THREE.Vector3();
    raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
    const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
    //console.log(intersects);
    if (intersects.length > 0) {                               // Se existir alguma interseção
        newXY = intersects[0].point;
        C.position.x = newXY.x;
        C.position.y = newXY.y;
    }else{
        C.position.x = C.userData.startPosition.x;
        C.position.y = C.userData.startPosition.y;
    }
    
    bSelected.selected = false;
    balls[bSelected.ball].material.transparent = true;
    removeCoordenates();

}

function showCoordenates() {
    let C = balls[bSelected.ball];
    let coordDiv = document.createElement('div');

    document.body.appendChild(coordDiv);

    coordDiv.innerHTML = '<span id="coord">Coordenadas de C' + bSelected.ball + ' (' + C.position.x.toFixed(2) + ',' + C.position.y.toFixed(2) + ',' + C.position.z.toFixed(2) + ')</span>';

}

function updateCoordenates() {
    let C = balls[bSelected.ball];
    if (document.getElementById('coord')) {
        document.getElementById('coord').innerHTML = 'Coordenadas de C' + bSelected.ball + ' (' + mouseIntersects.x.toFixed(2) + ',' + mouseIntersects.y.toFixed(2) + ',' + C.position.z.toFixed(2) + ')';
    }
}

function removeCoordenates() {
    if (document.getElementById('coord')) {
        let coordDiv = document.getElementById('coord');
        coordDiv.parentNode.removeChild(coordDiv);
    }
}

function intersectionPoint() {
    raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
    const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
    if (intersects.length > 0) {                               // Se existir alguma interseção
        mouseIntersects = intersects[0].point;
    }
}


// EventListener que "escuta por teclas pressionadas" e chama a função keydown
document.body.addEventListener('keydown', onKeyDown, false);

// Função que recebe o callback do evento keydown
function onKeyDown(event) {
    const keyName = event.key;              // inicializa keyName com o nome da tecla pressionada
    let i = 0;
    //console.log(keyName); // DEBUG only
    if (keyName == 'Backspace') {           // caso seja Backspace
        resetScene();                       // Faz reset a scene
    }

    if (bSelected.selected == false && (keyName == '1' || keyName == '2' || keyName == '3' || keyName == '4')) {
        ballSelected(parseInt(keyName) - 1);
    }

    if (bSelected.selected == true) {
        if (event.keyCode == 32)      // Caso a tecla pressionada seja o space e esteja uma bola seleccionada
            ballDeselected();

        if (keyName == 'w') {
            balls[bSelected.ball].position.z = balls[bSelected.ball].position.z + 0.1;
            updateCoordenates();
        }

        if (keyName == 's') {
            balls[bSelected.ball].position.z = balls[bSelected.ball].position.z - 0.1;
            updateCoordenates();
        }



    }

    if (keyName == 'x') {               // se a tecla pressionada for 'x'       
        let bezierCurve3 = createBezier3(balls);
        scene.add(bezierCurve3);

    }
}



// Função que reinicia todo o processo do algoritmo (para quando backspace é pressiondo ou quando é redimensionado o display raster)
function resetScene() {
    scene.remove.apply(scene, scene.children);  // Remove todos os filhos da scene (apaga tudo)
    balls = [];
    getBalls();                                 // desenha as bolas iniciais
    getAxes();                                  // chama o desenho dos eixos 
    getDisplayRaster();                         // Chama o desenho do display raster
}


window.changeDisplayRasterSize = () => {
    rasterDisplaySize = document.getElementById("rasterDisplaySize").value;
    pixels.every(pixel => scene.remove(pixel));
    pixels = [];
    getDisplayRaster();
}

window.changeDisplayRasterOpacity = () => {
    let opacity = document.getElementById("rasterDisplayOpacity").value;
    console.log(opacity)
    pixels.every(pixel => pixel.material.opacity=opacity);
}

// Função recursiva que mantém a scene atualizada com o renderer
function animate() {
    //controls.update(); 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

// Event Listener que deteta se a janela foi redimensionada e chama a função resize
window.addEventListener("resize", resize, false);

// Função que muda o aspect ratio da janela e atualiza o tamanho desta no renderer
// Acrescentei esta funcionalidade para que não fiquem zonas brancas ao redimensionar a janela do browser
function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

export default scene;   // exporta a scene



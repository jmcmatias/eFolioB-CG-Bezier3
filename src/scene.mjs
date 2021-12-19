/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { displayRaster, createSphere, createBezier3 } from './myObjects.mjs';
import { bSelected, C0, C1, C2, C3, balls } from './ballsConfig.mjs'
import { renderer, camera, axes, raycaster, scene, directionalLight } from './sceneConfig.mjs'

// Configurações do Tabuleiro
let rasterDisplaySize = 10;   //tamanho da grelha inicial de pixeis, poderá mudar a pedido do utilizador
let rasterDisplayOpacity = 0.4;
let pixels = [];              //Array que irá receber os pixeis do displayRaster
const pixelSize = 1;          //tamanho do pixel irão manter-se sempre a 1
const gridColor1 = 0xff8000;            //0xff8000 - laranja
const gridColor2 = 0x408080;            //0x408080 - azulado

// Vetores para utilização com o raycaster e coordenadas do rato
let mouse = new THREE.Vector2();         // cria um vector2 para receber as posições do rato devolvidas por onMouseMove 
let mouseIntersects = new THREE.Vector2();  // Valor que irá receber o ponto de interseção do ray com o tabuleiro

init();
animate();

function init() {
    // renderer 
    getRenderer();
    // scene 
    getLights();
    // Desenha os eixos 
    getAxes();
    // Desenha o Display Raster
    getDisplayRaster();
    // Desenha as bolas 
    getBalls();
}

// Função que insere o renderer no DOM, criação do node canvas
function getRenderer() {
    document.body.appendChild(renderer.domElement);
}

// Função que insere as luzes na scene
function getLights() {
    scene.add(directionalLight.top);
    scene.add(directionalLight.bottom);
    scene.add(directionalLight.front);
}

function getBalls() {
    // Insere as bolas criadas nos pontos C0,C1,C2,C3 no array balls
    balls.push(createSphere(C0));
    balls.push(createSphere(C1));
    balls.push(createSphere(C2));
    balls.push(createSphere(C3));
    // Insere as bolas na scene
    balls.every (ball => scene.add(ball));
}

//Função que insere o display raster na scene
function getDisplayRaster() {
    pixels = displayRaster(rasterDisplaySize, pixelSize, gridColor1, gridColor2); // Coloca os objetos (mesh) pixeis no array pixels
    pixels.every(pixel => scene.add(pixel)); // desenha cada um deles na scene*/
}

// Função que vai inserir os eixos na scene
function getAxes() {
    axes.position.z = 0.05      // coloca os eixos um pouco acima do display raster para que se vejam bem
    scene.add(axes);            // adiciona na scene
}

// Função que recebe um número e seleciona a bola que corresponde a esse numero 
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
        C.userData.lastPosition.x = C.position.x;
        C.position.y = newXY.y;
        C.userData.lastPosition.y = C.position.y;
    } else {
        C.position.x = C.userData.lastPosition.x;
        C.position.y = C.userData.lastPosition.y;
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

// Atualiza as coordenadas da bola selecionada no ecrã
function updateCoordenates() {
    const C = balls[bSelected.ball];            // inicializa C com a bola selecionada
    if (document.getElementById('coord')) {     // Se existir o div coord insere as coordenadas no seu innerHTML com os valores arredondados a duas casas decimais, em que x,y é o ponto de interceção do rato com o tabuleiro e z a coordenada z atual da bola 
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
    raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camera
    const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
    if (intersects.length > 0) {                               // Se existir alguma interseção
        mouseIntersects = intersects[0].point;                 // Guarda o ponto em mouseIntersects
    }
}

// Função que reinicia todo o processo do algoritmo (para quando backspace é pressiondo ou quando é redimensionado o display raster)
function resetScene() {
    scene.remove.apply(scene, scene.children);  // Remove todos os filhos da scene (apaga tudo)
    pixels = [];
    balls = [];
    getLights();
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


    rasterDisplayOpacity = document.getElementById("rasterDisplayOpacity").value;
    pixels.every(pixel => pixel.material.opacity = rasterDisplayOpacity);

}

window.changeDisplayRasterVisibility = () => {
    let checked = document.getElementById("rasterDisplayVisibility").checked;
    if (checked) {
        for (const pixel of pixels)
            pixel.visible = true;
    } else
        for (const pixel of pixels)
            pixel.visible = false;
}

window.changeBallVisibility = () => {
    let checked = document.getElementById("ballVisibility").checked;
    if (checked) {
        for (const ball of balls)
            ball.visible = true;
    } else
        for (const ball of balls)
            ball.visible = false;
}

window.changeAxesVisibility = () => {
    let checked = document.getElementById("axesVisility").checked;
    if (checked) {
        axes.visible = true;
    } else
        axes.visible = false;
}

// Função recursiva que mantém a scene atualizada com o renderer
function animate() {
    //controls.update(); 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

            //////////////////////////////////////////
            // EVENT HANDLERS E FUNÇÕES DEPENDENTES //
            //////////////////////////////////////////


// CONTROLO DO MOUSE MOVE
// EventListener que devolve a posição do rato quando este se move com as coordenadas normalizadas e chama a função onMouseMove
document.body.addEventListener('mousemove', onMouseMove, false);

// Função que irá receber um callback com a ultima posição do rato x e y
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    if (bSelected.selected) {                                   // Caso esteja alguma bola selecionada
        intersectionPoint();                                    // Atualiza o ponto de Interseção do raycaster com o tabuleiro
        updateCoordenates();                                    // Atualiza as coordenadas de modo a aparecerem no ecrã ao mover-se o rato por cima do tabuleiro
        let C = balls[bSelected.ball];                          // coloca em C a bola selecionada
        let newXY = new THREE.Vector2();                        // cria um vector 2 para receber as coordenadas da interceção do rato com o tabuleiro
        raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
        const intersects = raycaster.intersectObjects(pixels);     // Põe em intersects a informação da interceção do rato com objetos contidos em pixels (tabuleiro)
        //console.log(intersects);       // DEBUG only
        if (intersects.length > 0) {                               // Se existir alguma interseção
            newXY = intersects[0].point;                           // coloca as coordenadas x,y do ponto de interseção em newXY
            C.position.x = newXY.x;                                // atualiza a coordenada x da bola selecionada com a do ponto de interseção
            C.position.y = newXY.y;                                // atualiza a coordenada x da bola selecionada com a do ponto de interseção
        }
    }
    // console.log(mouse); // DEBUG only
}


// CONTROLO DE TECLADO
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
        if (event.keyCode == 32){      // Caso a tecla pressionada seja o space e esteja uma bola seleccionada
            ballDeselected();
        }
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
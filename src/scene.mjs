/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
import { displayRaster, createSphere, createBezier3 } from './myObjects.mjs';

import { bSelected, C0, C1, C2, C3 } from './ballsConfig.mjs'
// 
import { camera,
         axes,
         raycaster,
         scene,
         directionalLight,
         animate,
         getRenderer,
         resize,
         resetScene } from './sceneConfig.mjs'

// Configurações do Tabuleiro
let rasterDisplaySize = 10;   //tamanho da grelha inicial de pixeis, poderá mudar a pedido do utilizador
let rasterDisplayOpacity = 0.4;
let pixels = [];              //Array que irá receber os pixeis do displayRaster
let balls = [];              //array que irá receber as bolas 
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
    // carrega a cena base 
    getBaseScene();
}

// Função que inicia a cena base
function getBaseScene(){
    pixels = [];
    balls = [];
    // Adiciona a iluminação
    getLights();
    // Desenha os eixos 
    getAxes();
    // Desenha o Display Raster
    getDisplayRaster();
    // Desenha as bolas 
    getBalls();
}

// Função que adiciona a iluminação na scene
function getLights() {
    scene.add(directionalLight.top);
    scene.add(directionalLight.bottom);
    scene.add(directionalLight.front);
}

// Função que cria e insere as bolas criadas nos pontos C0,C1,C2,C3 no array balls
function getBalls() {
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
    bSelected.selected = true;              // bola foi selecionada
    bSelected.ball = i;                     // entra o número da bola seleccionada
    balls[i].material.transparent = false;  // tira a transparencia a bola selecionada
    showCoordenates(balls[i]);              // Liga o DIV com as coordenadas da bola em tempo real
}

// Função que Grava as coordenadas da bola selecionada e tira a seleção de bola
function ballDeselected() {
    let C = balls[bSelected.ball];                             // Coloca a bola selecionada em C
    let newXY = new THREE.Vector3();                           // cria um vector2 para receber as coordenadas da interceção do rato com o tabuleiro
    raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camara
    const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
    //console.log(intersects);
    if (intersects.length > 0) {                               // Se existir alguma interseção coloca a bola na nova posição
        newXY = intersects[0].point;                           // coloca as coordenadas x,y do ponto da interseção em newXY 
        C.position.x = newXY.x;                                // atualiza o novo x de C                            
        C.position.y = newXY.y;                                // atualiza o novo y de C  
        // Este parametro serve para quando se tira a seleção da bola ficarmos com a posição gravada
        C.userData.lastPosition.x = C.position.x;              // atualiza o ultimo x de C
        C.userData.lastPosition.y = C.position.y;              // atualiza o ultimo y de C
    } else {                                                   // senão a bola volta para a ultima posição conhecida
        C.position.x = C.userData.lastPosition.x;              // volta a colocar o ultimo x de C
        C.position.y = C.userData.lastPosition.y;              // volta a colocar o ultimo y de C
    }

    bSelected.selected = false;                                // retira a seleção da bola 
    balls[bSelected.ball].material.transparent = true;         // e volta a por a bola transparente
    removeCoordenates();                                       // remove a informação das coordenadas 
}

// Função que cria um DIV com a informação das coordenadas da bola selecionada, posição definida no .css
function showCoordenates() {
    let C = balls[bSelected.ball];                      // C = número da bola selecionada
    let coordDiv = document.createElement('div');       // definição de coordDiv como um div
    document.body.appendChild(coordDiv);                // criação do nó coorDiv no body
    // Colocação do conteudo no div criado, caracteristicas definidas no .css, representadas as coordenadas da bola (com duas casas decimais) em tempo real e qual a bola selecionada 
    coordDiv.innerHTML = '<span id="coord">Coordenadas de C' + bSelected.ball + ' (' + C.position.x.toFixed(2) + ',' + C.position.y.toFixed(2) + ',' + C.position.z.toFixed(2) + ')</span>';
}

// Atualiza as coordenadas da bola selecionada no ecrã (para atualizar com o movimento do rato, ou quando se pressiona w ou s)
function updateCoordenates() {
    const C = balls[bSelected.ball];            // inicializa C com a bola selecionada
    if (document.getElementById('coord')) {     // Se existir o div coord insere as coordenadas no seu innerHTML com os valores arredondados a duas casas decimais, em que x,y é o ponto de interceção do rato com o tabuleiro e z a coordenada z atual da bola 
        document.getElementById('coord').innerHTML = 'Coordenadas de C' + bSelected.ball + ' (' + mouseIntersects.x.toFixed(2) + ',' + mouseIntersects.y.toFixed(2) + ',' + C.position.z.toFixed(2) + ')';
    }
}

// Remove o nó que contém a informação das coordenadas
function removeCoordenates() {
    if (document.getElementById('coord')) {
        let coordDiv = document.getElementById('coord');
        coordDiv.parentNode.removeChild(coordDiv);
    }
}

// Função que atualiza o ponto de interseção entre o ponteiro do rato e o tabuleiro
function intersectionPoint() {
    raycaster.setFromCamera(mouse, camera);                    // inicializa o raycaster com as posições do rato em relação á camera
    const intersects = raycaster.intersectObjects(pixels);     // coloca os objetos existentes no array pixels que são intercetados pelo ray no array intersects
    if (intersects.length > 0) {                               // Se existir alguma interseção
        mouseIntersects = intersects[0].point;                 // Guarda o ponto em mouseIntersects
    }
}

            //////////////////////////////////////////
            //   MANIPULAÇÃO DE HTML NO DOCUMENTO   //
            //////////////////////////////////////////

// Função que responde ao evento onClick no botão alterar qundo se altera o tamanho do tabuleiro
window.changeDisplayRasterSize = () => {
    rasterDisplaySize = document.getElementById("rasterDisplaySize").value;  // devolve o valor inserido no input para rasterDisplaySize
    pixels.every(pixel => scene.remove(pixel));                              // remove todos os pixeis da cena
    pixels = [];                                                             // limpa o array pixeis 
    getDisplayRaster();                                                      // volta a desenhar o tabuleiro com o novo valor de tamanho do tabuleiro
}

// Função que altera a quantidade de transparencia do tabuleiro
window.changeDisplayRasterOpacity = () => {
    rasterDisplayOpacity = document.getElementById("rasterDisplayOpacity").value; // devolve o valor inserido no input para rasterDisplayOpacity
    pixels.every(pixel => pixel.material.opacity = rasterDisplayOpacity);         // para cada quadrado do tabuleiro, altera a quantidade de transparencia para o valor lido
}

// Função que liga ou desliga a visibilidade do tabuleiro ao selecionar ou não a checkbox respetiva
window.changeDisplayRasterVisibility = () => {
    let checked = document.getElementById("rasterDisplayVisibility").checked;     // booleano que recebe a informação se a checkbox está selecionada ou não 
    if (checked) {                                                                // caso esteja selecionada 
        for (const pixel of pixels)                                               // para cada quadrado do tabuleiro 
            pixel.visible = true;                                                 // torna-os visiveis
    } else                                                                        // senão 
        for (const pixel of pixels)                                               // torna-os não visiveis
            pixel.visible = false;
}
// Função identica a anterior mas reletiva as bolas
window.changeBallVisibility = () => {
    let checked = document.getElementById("ballVisibility").checked;
    if (checked) {
        for (const ball of balls)
            ball.visible = true;
    } else
        for (const ball of balls)
            ball.visible = false;
}
// Função que torna os eixos visiveis ou invisiveis ao selecionar ou não a checkbox respetiva
window.changeAxesVisibility = () => {
    let checked = document.getElementById("axesVisility").checked;
    if (checked) {
        axes.visible = true;
    } else
        axes.visible = false;
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


// CONTROLO DE TECLAS PRESSIONADAS
// EventListener que "escuta por teclas pressionadas" e chama a função keydown
document.body.addEventListener('keydown', onKeyDown, false);

// Função que recebe o callback do evento keydown
function onKeyDown(event) {
    const keyName = event.key;              // inicializa keyName com o nome da tecla pressionada
    let i = 0;
    //console.log(keyName); // DEBUG only
    if (keyName == 'Backspace') {           // caso seja Backspace
        resetScene(getBaseScene);         // Faz reset a scene e coloca a cena base
    }
    // Caso não haja bola selecionada e seja pressionada uma das teclas (1,2,3 ou 4)
    if (bSelected.selected == false && (keyName == '1' || keyName == '2' || keyName == '3' || keyName == '4')) {
        ballSelected(parseInt(keyName) - 1);    // Chama ballSelected com o inteiro da bola selecionada menos um (pq a 1 correponde a C0)
                                                // (forçar o inteiro evita inconsistencias de tipo pois o keyName é uma string ) 
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



export default scene;   // exporta a scene
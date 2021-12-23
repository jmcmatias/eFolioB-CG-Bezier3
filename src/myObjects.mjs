/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
//import scene from './scene.mjs';
import { bezier3 } from '../bezier3.mjs';
import { scene } from './sceneConfig.mjs';


// Função que cria um pixel para ser colocado no display raster
function createPixel(side, squareColor, x, y) {
    const geometry = new THREE.BoxGeometry(side, side, 0.001);  // cada pixel será representado por uma box (quadrado) com z=0 e 
    const material = new THREE.MeshBasicMaterial({          // definição do material 
        opacity: 0.4,                                       // opacidade
        transparent: true,                                  // transparencia
        color: squareColor,                                 // cor
        side: THREE.DoubleSide,                             // duplo lado
    });
    let pixel = new THREE.Mesh(geometry, material);           // sqr vai ser a mesh da boxgeometry com o material
    // definição da posição do pixel no display raster
    pixel.position.x = x+0.5;                                     
    pixel.position.y = y+0.5;
    pixel.position.z = 0;
    // Definição do nome apenas para controlo
    pixel.name = "pixel";  // DEBUG only

    return pixel; //retorna o mesh boxgeometry/material
}

//Função que vai crias o display raster, recebe como arg o tamanho da grelha, o tamanho de cada pixel (lado do quadrado) a cor1 e a cor2
function displayRaster(gridSize, pixelSize, gridColor1, gridColor2) {
    const displayRasterArray = [];                      // grupo tipo THREE onde vão ser inseridos os "pixeis"
    for (let x = -gridSize; x < gridSize; x++) {       //ciclo em x de -tamanho da grelha até +tamanho da grelha
        for (let y = -gridSize; y < gridSize; y++) {   //ciclo em y de -tamanho da grelha até +tamanho da grelha
            if ((y % 2 == 0 && x % 2 == 0) ||           // se y e x forem pares ou 
                (y % 2 != 0 && x % 2 != 0)) {           // ou se y e x forem impares 
                let pixel = new createPixel(pixelSize, gridColor1, x, y); // coloca em pixel o pixel(mesh) criado nas posições (x,y) com a cor 1
                displayRasterArray.push(pixel);                           // insere o pixel no array
            }
            else {
                let pixel = new createPixel(pixelSize, gridColor2, x, y); // coloca em pixel o pixel(mesh) criado nas posições (x,y) com a cor 2
                displayRasterArray.push(pixel);                           // insere o pixel no array
            }
        }
    }
    return displayRasterArray;      // retorna o array com o display raster
}

//Função que cria uma bola 
function createSphere (C){
    const geometry = new THREE.SphereGeometry( 0.5, 32, 32 );               // cria uma esfera de raio 0.5 32 segmentos horizontais e verticais
    const material = new THREE.MeshBasicMaterial( { color: C.color,         // material com a cor relativa a bola selecionada
                                                    opacity: 0.5,           // opacidade de 0.5
                                                    transparent: true } );  // transparente
    const sphere = new THREE.Mesh( geometry, material );                    // cria o material
    // coloca a bola na respetiva posição
    sphere.position.x=C.position.x;                                         
    sphere.position.y=C.position.y;
    sphere.position.z=C.position.z;

    let sp = sphere.userData;                   // Userdata para controlo
    sp.startPosition = new THREE.Vector3();     // posição inicial
    sp.lastPosition = new THREE.Vector3();      // ultima posição gravada
    sp.startPosition = C.startPosition;         // inicialização da posição inicial
    sp.lastPosition = C.startPosition;          // inicialização da ultima posição (inicial)
        
    return sphere;                              // retorna a esfera
}
// Função que cria o objeto com a curva bezier
function createTubeBezier3(balls){
    // Classe que gera o caminho (path) da nossa curva bezier (baseada na classe de exemplo em https://threejs.org/docs/#api/en/geometries/TubeGeometry)
    // O valor de t é gerado pela classe extendida curve
    class bezier3CurvePath extends THREE.Curve {
        // Para possibilitar a alteração da escala, sendo o valor por defeito 1
        constructor( scale = 1 ) {
            super();
            this.scale = scale;
        }
        // Função da classe THREE.Curve que gera os pontos que irão formar a path
        getPoint(t) {
            // Ponto gerado pela nossa função bezier3 para cada instante t em função da posição das bolas C0,C1,C2 e C3
            return bezier3({c0:balls[0].position,c1:balls[1].position,c2:balls[2].position,c3:balls[3].position,t:t});
        }
    }
    
    const path = new bezier3CurvePath();                                    // Novo caminho para o tube geometry com escala default (1)
    const geometry = new THREE.TubeGeometry( path, 64, 0.35, 16, false);    // Novo tubo pela path, nº de segmentos que compõem o tubo, raio do tubo, nº de segmentos radiais, false (significa aberto)
    const material = new THREE.MeshPhysicalMaterial( {                      // Novo Material tipo Physical
        color: randomRGBAColor(),                                           // Côr do tubo (aleatória)
        clearcoat: 1.0,                                                     // camada refletiva (1-máximo)
        clearcoatRoughness:0.1,                                             // rugosidade da camada refletiva
    } );
    const bezier3Curve = new THREE.Mesh ( geometry, material );             // Mesh do tubo bezier3
    bezier3Curve.receiveShadow = true;                                      // recebe sombra
    bezier3Curve.castShadow = true;                                         // produz sombra
    return bezier3Curve;                                                    // retorna o objeto

}
// Função que cria uma côr aleatória em rgba
function randomRGBAColor(){
    let max=255;
    let rand = Math.random;         // gera nº aleatório entre 0 e 1
    let round = Math.round;         // arredonda ao número inteiro
    // retorna o c+odigo da côr em rgba, gera aleatóriamente cada uma das componentes da côr R(vermelho) G(verde) e B(azul) a componente alpha neste caso vai ser sempre 1 completmente opaco
    return 'rgba(' + round(rand()*max) +','+ round(rand()*max) +','+ round(rand()*max) +','+1+')';
}

export { displayRaster, createPixel, createSphere, createTubeBezier3 };
/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/

import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';
//import scene from './scene.mjs';
import { bezier3 } from '../bezier3.mjs';


// Função que cria um pixel para ser colocado no display raster
function createPixel(side, squareColor, x, y) {
    const geometry = new THREE.BoxGeometry(side, side, 0.001);  // cada pixel será representado por uma box (quadrado) com z=0 e 
    const material = new THREE.MeshBasicMaterial({          // definição do material tipo mesh, da cor e duplo lado
        opacity: 0.4,
        transparent: true,
        color: squareColor,
        side: THREE.DoubleSide,       
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
    return displayRasterArray;      // retorna 
}

//Função que cria uma bola 
function createSphere (C){
    const geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
    const material = new THREE.MeshBasicMaterial( { color: C.color,
                                                    opacity: 0.5,
                                                    transparent: true } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.x=C.position.x;
    sphere.position.y=C.position.y;
    sphere.position.z=C.position.z;

    let sp = sphere.userData;
    sp.startPosition = new THREE.Vector3();
    sp.lastPosition = new THREE.Vector3();
    sp.startPosition = C.startPosition;
    sp.lastPosition = C.startPosition;
    
    return sphere;
}



function createBezier3(balls){

    class bezier3CurvePath extends THREE.Curve {

        constructor( scale = 1 ) {
    
            super();
    
            this.scale = scale;
    
        }
   
        getPoint(t, optionalTarget = new THREE.Vector3() ) {
            const b3 = bezier3({c0:balls[0].position,c1:balls[1].position,c2:balls[2].position,c3:balls[3].position,t:t});
            return optionalTarget.set( b3.x, b3.y, b3.z).multiplyScalar( this.scale );
        }
    }
    
    
    const path = new bezier3CurvePath(1);
    const geometry = new THREE.TubeGeometry( path, 60, 0.35, 16, false);
    const material = new THREE.MeshPhysicalMaterial( {
        color: randomRGBAColor(),
        clearcoat: 1.0,
        clearcoatRoughness:0.1,
        metalness: 0.9,
        roughness:0.5,     
    } );
    const bezier3Curve = new THREE.Mesh ( geometry, material );
    bezier3Curve.receiveShadow = true;
    bezier3Curve.castShadow = true;
    return bezier3Curve;

}

function randomRGBAColor(){
    let max=255;
    let rand = Math.random;
    let round = Math.round;
    console.log('rgba(' + round(rand()*max) +','+ round(rand()*max) +','+ round(rand()*max) +','+1+')');
    return 'rgba(' + round(rand()*max) +','+ round(rand()*max) +','+ round(rand()*max) +','+1+')';
}

export { displayRaster, createPixel, createSphere, createBezier3 };
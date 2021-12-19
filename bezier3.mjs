/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

function bezier3 ({c0,c1,c2,c3,t}){
    let output = new THREE.Vector3();

    output.x=calcPoli(c0.x,c1.x,c2.x,c3.x,t);
    output.y=calcPoli(c0.y,c1.y,c2.y,c3.y,t);
    output.z=calcPoli(c0.z,c1.z,c2.z,c3.z,t);

    return output;
}

// Função para calcular coordenada de C0 ((1-t)^3)*(componente (x,y,z) de c0) 
function calcC0 (c0,t){
    return Math.pow((1-t),3)*c0;
}

// Função para calcular coordenada de C1 (3(1-t)^2)*t*(componente (x,y,z) de c1) 
function calcC1 (c1,t){
    return 3*Math.pow((1-t),2)*t*c1;
}

// Função para calcular coordenada de C2 3(1-t)*t^2*(componente (x,y,z) de c2) 
function calcC2 (c2,t){
    return 3*(1-t)*t*t*c2;
}

// Função para calcular coordenada de C2 t^3*(componente (x,y,z) de c3) 
function calcC3 (c3,t){
    return Math.pow(t,3)*c3;
}

// Função para resolver o polimomio
function calcPoli (c0,c1,c2,c3,t){
    return calcC0(c0,t)+calcC1(c1,t)+calcC2(c2,t)+calcC3(c3,t);
}

export {bezier3};

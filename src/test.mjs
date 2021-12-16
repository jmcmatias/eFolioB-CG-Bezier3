/*
    efolioB - Bezier3 
    Jorge Matias 1901087   14/12/2021
*/
import {bezier3} from "../bezier3.mjs";
import * as THREE from './three.js'

let c0=new THREE.Vector3(0,0,0);
let c1=new THREE.Vector3(0.5,2,0);
let c2=new THREE.Vector3(1.5,2,0);
let c3=new THREE.Vector3(2,0,0);
let t = 0;
let output = [];

for (t=0;t<=1;t=t+0.25)
    output.push(bezier3({c0,c1,c2,c3,t}));



console.log(output);
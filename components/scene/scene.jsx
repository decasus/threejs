/*
    Результатом должна являтся страница со сценой, на которой фог и куб с материалом
    без восприимчивости к свету и кастомным шейдером, в котором цвет высчитывается относительно позиции вершины и времени.
    Импорт theejs должен быть динамический при подключении компонента со сценой
    При клике на куб он должен анимированно повернуться в случайно
    выбранной оси на случайную величину
    После удаления компонента, сцена должна уничтожиться
*/

import * as THREE from 'three';

import {useEffect, useRef} from "react";

const SceneComponent = () => {

    const mount = useRef(null);

    useEffect(() => {
        let frameId;
        let pos = 0;
        let axis = 0;
        const axes = ['x', 'y', 'z'];

        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x1c1c1c, 1, 2);
        scene.background = new THREE.Color(0x1c1c1c);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5);
        camera.position.z = 2;

        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.current.appendChild(renderer.domElement)

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        const uniforms = {
            time: {type: "f", value: 0},
            fogColor: {type: "c", value: scene.fog.color},
            fogNear: {type: "f", value: scene.fog.near},
            fogFar: {type: "f", value: scene.fog.far}
        }

        const material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            fog: true
        });

        const cube = new THREE.Mesh(geometry, material);

        scene.add(cube);
        cube.rotation.x = 0.5;
        cube.rotation.y = 0.5;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function handleClick(event) {
            event.preventDefault();
            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            if (intersects.length > 0) {
                axis = Math.floor(Math.random() * 3);
                pos = THREE.MathUtils.randFloat(cube.rotation[axes[axis]] + 1, cube.rotation[axes[axis]] + 2);
                animate();
            }
        }

        function handleResize() {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.render(scene, camera);
        }

        function animate() {
            if (cube.rotation[axes[axis]] < pos) {
                cube.rotation[axes[axis]] += 0.05;
                frameId = requestAnimationFrame(animate);
            }
        }

        function render() {
            uniforms.time.value += 0.01;
            renderer.render(scene, camera);
            frameId = requestAnimationFrame(render);
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("click", handleClick);
        render();

        return () => {
            cancelAnimationFrame(frameId);
            frameId = null;
            window.removeEventListener("resize", handleResize)
            mount.current.removeChild(renderer.domElement);
            scene.remove(cube);
            geometry.dispose();
            material.dispose();
        }

    }, [])


    return (
        <div ref={mount}></div>
    );
};

function vertexShader() {
    return `
    varying vec3 pos; 

    void main() {
      pos = position; 
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); 
    }
  `
}

function fragmentShader() {
    return `
      uniform float time;
      varying vec3 pos;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      
      void main() {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor = vec4(0.5 + 0.5 * cos(time+pos.y+vec3(0, 2, 4)), 1.0);
        gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      }
  `
}

export default SceneComponent;

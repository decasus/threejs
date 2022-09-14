import * as THREE from 'three';
import {vertexShader} from './shaders/vertex';
import {fragmentShader} from './shaders/fragment';

const axes = ['x', 'y', 'z'];

class Scene {

    init = (mount) => {
        this.animationList = [];
        this.mount = mount;

        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x1c1c1c, 1, 2);
        this.scene.background = new THREE.Color(0x1c1c1c);

        this.camera = new THREE.PerspectiveCamera(75, mount.current.clientWidth / mount.current.clientHeight, 0.1, 5);
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
        this.mount.current.appendChild(this.renderer.domElement)

        this.geometry = new THREE.BoxGeometry(1, 1, 1);

        this.uniforms = {
            time: {type: "f", value: 0},
            fogColor: {type: "c", value: this.scene.fog.color},
            fogNear: {type: "f", value: this.scene.fog.near},
            fogFar: {type: "f", value: this.scene.fog.far}
        }

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader(),
            fog: true
        });

        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.prevRotation = this.cube.rotation.clone();

        this.scene.add(this.cube);
        //this.cube.rotation.x = 0.5;
        //this.cube.rotation.y = 0.5;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.clock = new THREE.Clock();

        window.addEventListener("resize", this.handleResize);
        window.addEventListener("click", this.handleClick);
        this.render();
    }

    render = () => {
        const {uniforms, renderer, scene, camera, cube} = this;
        uniforms.time.value += 0.01;

        //const delta = this.clock.getDelta();


        ['x', 'y', 'z'].forEach((axis) => {
            if (cube.rotation[axis] < this.prevRotation[axis]) {
                cube.rotation[axis] += 0.01
            }
        });

        renderer.render(scene, camera);
        this.frameId = requestAnimationFrame(this.render);
    }

    handleClick = (event) => {
        const {mouse, renderer, raycaster, camera, cube, scene} = this;
        event.preventDefault();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            const axis = Math.floor(Math.random() * 3);
            this.prevRotation[axes[axis]] += Math.PI / 2;
        }
    }

    handleResize = () => {
        const {renderer, camera, mount} = this;
        renderer.setSize(mount.current.clientWidth, mount.current.clientHeight);
        camera.aspect = mount.current.clientWidth / mount.current.clientHeight;
        camera.updateProjectionMatrix();
    }

    destroy = () => {
        const {mount, scene, renderer, cube, geometry, material} = this;
        cancelAnimationFrame(this.frameId);
        this.frameId = null;
        window.removeEventListener("resize", this.handleResize);
        window.removeEventListener("click", this.handleResize);
        mount.current.removeChild(renderer.domElement);
        scene.remove(cube);
        geometry.dispose();
        material.dispose();
    }
}

export default new Scene();
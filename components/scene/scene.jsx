import {
    BoxGeometry,
    Fog,
    Color,
    Mesh,
    PerspectiveCamera,
    Scene,
    WebGLRenderer, ShaderMaterial, Vector2
} from 'three';
import {useEffect} from "react";
import {IfcDateTime} from "three/addons/loaders/ifc/web-ifc-api";

const SceneComponent = () => {

    useEffect(() => {
        const canvas = document.querySelector('#threeCanvas');
        const renderer = new WebGLRenderer({canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);

        const camera = new PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);

        camera.position.z = 2;

        const scene = new Scene();

        scene.fog = new Fog('black', 0.1, 2);

        const geometry = new BoxGeometry(1, 1, 1);

        let uniforms = {
            colorB: {type: 'vec3', value: new Color('orange')},
            colorA: {type: 'vec3', value: new Color('yellow')},
            time: {type: 'float', value: 0}
        }

        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader()
        });

        const cube = new Mesh(geometry, material);

        scene.add(cube);

        function render(time) {
            time *= 0.001;
            uniforms.time.value += 0.01;
            cube.rotation.x = time;
            cube.rotation.y = time;
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }

        requestAnimationFrame(render);

    }, [])

    function vertexShader() {
        return `
    varying vec3 vUv; 

    void main() {
      vUv = position; 
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `
    }

    function fragmentShader() {
        return `
      uniform vec3 colorA; 
      uniform vec3 colorB;
      uniform float time;
      varying vec3 vUv;

      void main() {
        gl_FragColor = vec4(mix(colorA, colorB, time + vUv.z), 1.0);
      }
  `
    }

/*    Результатом должна являтся страница со сценой, на которой фог и куб с материалом
    без восприимчивости к свету и кастомным шейдером, в котором цвет высчитывается относительно позиции вершины и времени.
        Импорт theejs должен быть динамический при подключении компонента со сценой
    При клике на куб он должен анимированно повернуться в случайно
    выбранной оси на случайную величину
    После удаления компонента, сцена должна уничтожиться
*/

    return (
        <div>
            <canvas id="threeCanvas"></canvas>
        </div>
    );
};

export default SceneComponent;

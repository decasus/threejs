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
import {OrbitControls} from "three/addons/controls/OrbitControls";

const SceneComponent = () => {

    useEffect(() => {
        const canvas = document.querySelector('#threeCanvas');

        const scene = new Scene();
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new WebGLRenderer({canvas});
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.z = 2;

        scene.fog = new Fog('white', 0.1, 1);
        scene.background = new Color(0x1c1c1c);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.update();

        const geometry = new BoxGeometry(1, 1, 1);

        const uniforms = {
            time: {type: 'float', value: 0}
        }

        const material = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader(),
            fragmentShader: fragmentShader()
        });

        const cube = new Mesh(geometry, material);

        scene.add(cube);

        function animate() {
            requestAnimationFrame(animate);
            uniforms.time.value += 0.01;
            //cube.rotation.x += 0.01;
            //cube.rotation.y += 0.01;
            controls.update();
            renderer.render(scene, camera);
        }

        animate();

    }, [])

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
      vec3 col;
      
      void main() {
          if(pos.y == 0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(0,2,9)), 1.0);
          if(pos.y == -0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(4,8,2)), 1.0);
          if(pos.x == 0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(5,1,7)), 1.0);
          if(pos.x == -0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(7,9,1)), 1.0);
          if(pos.z == -0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(6,1,8)), 1.0);
          if(pos.z == 0.5) gl_FragColor = vec4(0.5 + 0.5*cos(time+vec3(2,0,0)), 1.0);
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

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default class Canvas {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  orbitControls: OrbitControls;

  constructor() {
    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    this.initCamera();
    this.initOrbitControls();
    this.initRenderer();
    this.createCube();
    this.addEventListeners();
    this.render();
  }

  initCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.scene.add(this.camera);
    this.camera.position.z = 10;
  }

  initOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  initRenderer() {
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setPixelRatio(dimensions.pixelRatio);

    this.renderer.render(this.scene, this.camera);
  }

  // events
  addEventListeners() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => {
      this.render();
    });
  }
}

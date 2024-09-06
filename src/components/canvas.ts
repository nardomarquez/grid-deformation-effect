import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Media from "./media";

export default class Canvas {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  orbitControls: OrbitControls;
  sizes: {
    width: number;
    height: number;
  };

  constructor() {
    this.canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    this.createCamera();
    this.createOrbitControls();
    this.createRenderer();
    this.setSizes();
    this.createMedia();
    this.addEventListeners();
    this.render();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.scene.add(this.camera);
    this.camera.position.z = 10;
  }

  createOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  createMedia() {
    new Media({ scene: this.scene, sizes: this.sizes, canvas: this.canvas });
  }

  createRenderer() {
    const dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setPixelRatio(dimensions.pixelRatio);

    this.renderer.render(this.scene, this.camera);
  }

  setSizes() {
    let fov = this.camera.fov * (Math.PI / 180);
    let height = this.camera.position.z * Math.tan(fov / 2) * 2;
    let width = height * this.camera.aspect;

    this.sizes = {
      width: width,
      height: height,
    };
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

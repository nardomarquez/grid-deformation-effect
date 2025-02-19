import * as THREE from "three";
import { Dimensions, Size } from "../types/types";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Media from "./media";
import GUI from "lil-gui";

export default class Canvas {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sizes: Size;
  dimensions: Dimensions;
  time: number;
  clock: THREE.Clock;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  orbitControls: OrbitControls;
  media: Media;
  debug: GUI;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.time = 0;
    this.createClock();
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setSizes();
    this.createRayCaster();
    this.createOrbitControls();
    this.addEventListeners();
    this.createDebug();
    this.createMedia();
    this.render();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.scene.add(this.camera);
    this.camera.position.z = 10;
  }

  createOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera);
  }

  createRenderer() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true });
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    this.renderer.render(this.scene, this.camera);

    this.renderer.setPixelRatio(this.dimensions.pixelRatio);
  }

  createDebug() {
    this.debug = new GUI();
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

  createClock() {
    this.clock = new THREE.Clock();
  }

  createRayCaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  onMouseMove(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    const target = intersects[0];
    if (target && "material" in target.object) {
      const targetMesh = intersects[0].object as THREE.Mesh;

      if (this.media.mesh === targetMesh && target.uv) {
        this.media.onMouseMove(target.uv);
      }
    }
  }

  addEventListeners() {
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    this.dimensions = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(2, window.devicePixelRatio),
    };

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.setSizes();

    this.renderer.setPixelRatio(this.dimensions.pixelRatio);
    this.renderer.setSize(this.dimensions.width, this.dimensions.height);
  }

  createMedia() {
    const media = new Media({
      canvas: this.canvas,
      src: "/image.jpg",
      debug: this.debug,
      scene: this.scene,
      sizes: this.sizes,
      renderer: this.renderer,
    });

    this.media = media;
  }

  render() {
    this.time = this.clock.getElapsedTime();

    this.orbitControls.update();
    this.media.render(this.time);
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

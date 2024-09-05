import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

interface MediaProps {
  scene: THREE.Scene;
  sizes: {
    width: number;
    height: number;
  };
  canvas: HTMLCanvasElement;
}

export default class Media {
  scene: THREE.Scene;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  meshDimensions: {
    width: number;
    height: number;
  };
  nodeDimensions: {
    width: number;
    height: number;
  };
  sizes: {
    width: number;
    height: number;
  };
  canvas: HTMLCanvasElement;

  constructor({ scene, sizes, canvas }: MediaProps) {
    this.scene = scene;
    this.sizes = sizes;
    this.canvas = canvas;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
    this.setNodeBounds();
    this.setMeshDimensions();

    console.log(this.meshDimensions);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
  }

  createMaterial() {
    console.log(window.innerWidth, window.innerHeight);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: new THREE.Uniform(new THREE.Vector4()),
        uContainerResolution: new THREE.Uniform(
          new THREE.Vector2(window.innerWidth, window.innerHeight)
        ),
        uImageResolution: new THREE.Uniform(new THREE.Vector2()),
      },
    });
    this.material.uniforms.uTexture.value = new THREE.TextureLoader().load(
      "/image.jpg",
      ({ image }) => {
        console.log({ image });
        const { naturalWidth, naturalHeight } = image;
        this.material.uniforms.uImageResolution.value = new THREE.Vector2(
          naturalWidth,
          naturalHeight
        );
      }
    );
  }

  createMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setNodeBounds() {
    const elementBounds = this.canvas.getBoundingClientRect();
    console.log({ elementBounds });

    this.nodeDimensions = {
      width: elementBounds.width,
      height: elementBounds.height,
    };
  }

  setMeshDimensions() {
    console.log(this.nodeDimensions, this.sizes);
    this.meshDimensions = {
      width: (this.nodeDimensions.width * this.sizes.width) / window.innerWidth,
      height: (this.nodeDimensions.height * this.sizes.height) / window.innerHeight,
    };

    this.mesh.scale.x = this.meshDimensions.width;
    this.mesh.scale.y = this.meshDimensions.height;
  }
}

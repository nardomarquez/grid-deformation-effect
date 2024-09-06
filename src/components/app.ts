import Canvas from "./canvas";

export default class App {
  constructor() {
    const canvas = document.querySelector("canvas#webgl");

    if (canvas) {
      new Canvas(canvas as HTMLCanvasElement);
    }
  }
}

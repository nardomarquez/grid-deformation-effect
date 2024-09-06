import "./style.css";
import Canvas from "./App/canvas";

class App {
  constructor() {
    const canvas = document.querySelector("canvas#webgl");
    if (canvas) {
      new Canvas(canvas as HTMLCanvasElement);
    }
  }
}

window.addEventListener("load", () => {
  new App();
});

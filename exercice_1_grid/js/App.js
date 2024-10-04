import Point from "./Point.js";
import Canvas from "./Canvas.js";
import Utils from "./Utils.js";

export default class App {
  constructor() {
    const canvas = new Canvas();
    this.ctx = canvas.getContext();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());

    this.spacing = 50;
    this.columns = Math.floor(canvas.getWidth() / this.spacing);
    this.rows = Math.floor(canvas.getHeight() / this.spacing);

    this.points = [];
    this.time = 25; // Variable de temps pour animer

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const x = (col * canvas.getWidth()) / (this.columns - 1);
        const y = (row * canvas.getHeight()) / (this.rows - 1);

        let radius = Utils.calculateVerticalGradientRadius(
          row / (this.rows - 1)
        );
        const point = new Point(x, y, radius);
        this.points.push(point);
      }
    }

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  animate() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    this.time += 0.05;

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];

      const row = Math.floor(i / this.columns);
      const yRatio = row / (this.rows - 1);
      const baseRadius = Utils.calculateVerticalGradientRadius(yRatio);
      point.radius = baseRadius + Math.cos(this.time + row * 0.1) * 10;

      point.draw(this.ctx);
    }

    requestAnimationFrame(this.animate);
  }
}

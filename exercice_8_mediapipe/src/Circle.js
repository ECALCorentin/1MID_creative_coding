export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = "black";
    this.center = {
      x: y,
      y: y,
    };
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

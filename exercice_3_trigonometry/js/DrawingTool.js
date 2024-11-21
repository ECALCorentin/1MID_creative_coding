export default class DrawingTool {
  constructor(ctx) {
    this.ctx = ctx;
    this.allPoints = [];
  }

  addPoint(x, y) {
    this.allPoints.push({ x, y });
  }

  draw() {
    // Dessiner le trait suivant la spirale
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();

    if (this.allPoints.length > 0) {
      this.ctx.moveTo(this.allPoints[0].x, this.allPoints[0].y);
      for (let i = 1; i < this.allPoints.length; i++) {
        this.ctx.lineTo(this.allPoints[i].x, this.allPoints[i].y);
      }
      this.ctx.stroke();
    }
  }
}

export default class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speedX = Math.random() * 8 - 2;
    this.speedY = Math.random() * 8 - 2;
    this.hasCollidedWithMouse = false;
    this.maxDuplications = 2;
    this.duplications = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update(canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
      this.speedX = -this.speedX;
      this.applyRandomAngle();
    }
    if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
      this.speedY = -this.speedY;
      this.applyRandomAngle();
    }
  }

  applyRandomAngle() {
    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    const speed = Math.sqrt(this.speedX ** 2 + this.speedY ** 2);
    const direction = Math.atan2(this.speedY, this.speedX) + angle;

    this.speedX = Math.cos(direction) * speed;
    this.speedY = Math.sin(direction) * speed;
  }
}

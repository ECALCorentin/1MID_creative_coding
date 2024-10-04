export default class Point {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.charIndex = 0;
    this.updateSpeed = 1;
    this.frameCount = 0;
  }

  draw(ctx) {
    ctx.save();
    const char = this.getCharacter();
    ctx.font = `${this.radius * 2}px monospace`;
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, this.x, this.y);
    ctx.restore();
  }

  getCharacter() {
    const characters = [["/|/"]];

    const groupIndex = Math.min(
      Math.floor(this.radius / 2),
      characters.length - 1
    );
    return characters[groupIndex][this.charIndex];
  }

  update() {
    this.frameCount++;
    if (this.frameCount >= this.updateSpeed) {
      this.charIndex = (this.charIndex + 1) % 10;
      this.frameCount = 0;
    }
  }
}

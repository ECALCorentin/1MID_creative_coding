import BaseApp from "./BaseApp.js";
import Letter from "./Letter.js";
import Webcam from "./Webcam.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true;
    this.ctx.font = "14px monospace";
    this.letters = [];
    this.pixelColors = [];
    this.webcam = new Webcam();
    this.previousFrame = null;
    this.diffSumThreshold = 5000000; // Seuil minimal de mouvement cumulé
    this.motionThreshold = 50; // Distance maximale pour considérer un mouvement cohérent

    this.init();
  }

  async init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    const cols = Math.floor(this.canvas.width / 10);
    const rows = Math.floor(this.canvas.height / 10);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        this.letters.push(new Letter(this.ctx, "C", i * 10, j * 10));
      }
    }

    this.draw();
  }

  getLuminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }

  detectMotion(currentFrame) {
    if (!this.previousFrame) return false;

    let diffSum = 0;
    let motionCoords = { x: 0, y: 0, count: 0 };

    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const index = (y * this.canvas.width + x) * 4;
        const rDiff = Math.abs(currentFrame[index] - this.previousFrame[index]);
        const gDiff = Math.abs(
          currentFrame[index + 1] - this.previousFrame[index + 1]
        );
        const bDiff = Math.abs(
          currentFrame[index + 2] - this.previousFrame[index + 2]
        );
        const diff = (rDiff + gDiff + bDiff) / 3;

        if (diff > 30) {
          motionCoords.x += x;
          motionCoords.y += y;
          motionCoords.count++;
        }

        diffSum += diff;
      }
    }

    if (diffSum > this.diffSumThreshold && motionCoords.count > 0) {
      motionCoords.x = Math.floor(motionCoords.x / motionCoords.count);
      motionCoords.y = Math.floor(motionCoords.y / motionCoords.count);
      return motionCoords;
    }

    return false;
  }

  draw() {
    this.ctx.drawImage(
      this.webcam.video,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    const currentFrame = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    ).data;

    const motion = this.detectMotion(currentFrame);

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.letters.forEach((letter) => {
      const i = (letter.y * this.canvas.width + letter.x) * 4;

      letter.scale = this.getLuminance([
        currentFrame[i],
        currentFrame[i + 1],
        currentFrame[i + 2],
      ]);

      if (motion) {
        const distance = Math.hypot(letter.x - motion.x, letter.y - motion.y);

        if (distance < this.motionThreshold) {
          letter.x += ((letter.x - motion.x) / distance) * 2;
          letter.y += ((letter.y - motion.y) / distance) * 2;
        }
      }

      letter.draw();
    });

    this.previousFrame = currentFrame;
    requestAnimationFrame(() => this.draw());
  }
}

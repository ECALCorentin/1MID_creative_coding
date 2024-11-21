import LetterSpiral from "./LetterSpiral.js";
import DrawingTool from "./DrawingTool.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;

    // Créer le canvas
    this.createCanvas();

    // Créer une lettre en spirale
    this.letterSpiral = new LetterSpiral(this.width / 2, this.height / 2);

    // Créer un outil de dessin
    this.drawingTool = new DrawingTool(this.ctx);

    // Dessiner le canvas
    this.draw();
  }

  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  draw() {
    // Effacer le canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Déplacer la lettre en spirale
    this.letterSpiral.move();

    // Ajouter la position actuelle de la lettre dans le dessin
    this.drawingTool.addPoint(this.letterSpiral.x, this.letterSpiral.y);

    // Dessiner le trait
    this.drawingTool.draw();

    // Dessiner la lettre en spirale
    this.letterSpiral.draw(this.ctx);

    // Recommencer l'animation
    requestAnimationFrame(this.draw.bind(this));
  }
}

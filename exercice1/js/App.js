export default class App {
  constructor() {
    this.canvas;
    this.ctx;
  } // obligatoire pour créér une classe, déclarer les variables globales dans le constructeur

  createCanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  circle(x, y, radius) {
    // retirer le terme function à l'intérieur d'une classe
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
} // exporte la classe App pour pouvoir l'importer dans un autre fichier

// j'ai ajouté un commentaire pour expliquer la différence entre le code de la classe App et le code du main.js

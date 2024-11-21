export default class LetterSpiral {
  constructor(x, y, letter = "A") {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.angle = 0; // Angle de rotation
    this.center = { x: x, y: y }; // Centre de la spirale
    this.motion_radius = 0; // Rayon initial de la spirale
    this.speed = 1; // Vitesse d'agrandissement du rayon
    this.rotationSpeed = 1; // Vitesse de rotation
  }

  move() {
    // Calculer la position en utilisant les coordonnées polaires
    this.x =
      this.center.x +
      Math.cos((this.angle * Math.PI) / 180) * this.motion_radius;
    this.y =
      this.center.y +
      Math.sin((this.angle * Math.PI) / 180) * this.motion_radius;

    // Augmenter le rayon pour élargir la spirale
    this.motion_radius += 0.5;

    // Augmenter l'angle pour la rotation
    this.angle += this.rotationSpeed;
  }

  draw(ctx) {
    // Dessiner la lettre
    ctx.fillStyle = "blue";
    ctx.font = "100px Arial";
    ctx.fillText(this.letter, this.x, this.y);
  }
}

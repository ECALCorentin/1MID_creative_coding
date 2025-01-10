import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.grid = [];
    this.rows = 20; // Nombre de lignes initial
    this.cols = 20; // Nombre de colonnes initial
    this.changeSpeed = 0.1; // Vitesse de changement initiale
    this.removeCount = 0; // Compteur pour suivre le nombre de fois que la touche MIDI a été enfoncée
    this.init();
  }

  init() {
    // Configuration initiale
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    // Créer la grille initiale
    this.createGrid();

    // Ajouter un gestionnaire d'événements pour les clics de touches
    window.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Configuration MIDI
    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.setupMIDI.bind(this))
        .catch((err) => console.error(err));
    }

    // Démarrer l'animation
    this.animate();
  }

  createGrid() {
    this.grid = [];
    for (let row = 0; row < this.rows; row++) {
      this.grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        this.grid[row][col] = {
          letter: this.getRandomLetter(),
          size: this.getRandomSize(),
        };
      }
    }
  }

  getRandomLetter() {
    return this.letters[Math.floor(Math.random() * this.letters.length)];
  }

  getRandomSize() {
    return Math.floor(Math.random() * 25) + 10; // Taille aléatoire entre 10 et 30
  }

  getColorBySize(size) {
    const maxSize = 30;
    const minSize = 10;
    const ratio = (size - minSize) / (maxSize - minSize);
    const red = Math.floor(255 * ratio);
    const green = 0;
    const blue = Math.floor(255 * (1 - ratio));
    return `rgb(${red}, ${green}, ${blue})`;
  }

  setupMIDI(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (const input of inputs) {
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }

  handleMIDIMessage(message) {
    const [command, controller, value] = message.data;
    console.log("MIDI message", command, controller, value);

    // Log the MIDI controller number and value
    this.logMIDIController(controller, value);

    if (controller === 48) {
      // Utilisez le numéro de contrôleur approprié pour votre fader
      this.changeSpeed = value / 127; // Ajustez la vitesse de changement en fonction de la valeur du fader
    }

    if (controller === 64 && value === 127) {
      // Utilisez le numéro de contrôleur approprié pour votre touche MIDI
      this.removeCount++; // Incrémentez le compteur à chaque pression de la touche
      this.removeLetters(this.removeCount); // Appeler la méthode pour faire disparaître les lettres
    }
  }

  logMIDIController(controller, value) {
    console.log(`Controller: ${controller}, Value: ${value}`);
  }

  handleKeyDown(event) {
    if (event.key === " ") {
      // Utilisez la barre d'espace comme déclencheur
      this.removeCount++; // Incrémentez le compteur à chaque pression de la touche
      this.removeLetters(this.removeCount); // Appeler la méthode pour faire disparaître les lettres
    }
  }

  removeLetters(count) {
    let removed = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.grid[row][col].letter !== " " && removed < count) {
          this.grid[row][col].letter = " ";
          removed++;
        }
      }
    }
  }

  updateGrid() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (Math.random() < this.changeSpeed) {
          // Utilisez changeSpeed pour déterminer la probabilité de changement
          this.grid[row][col].letter =
            this.grid[row][col].letter === " " ? this.getRandomLetter() : " ";
          this.grid[row][col].size = this.getRandomSize();
        }
      }
    }
  }

  drawGrid() {
    const cellWidth = this.canvas.width / this.cols;
    const cellHeight = this.canvas.height / this.rows;
    const startX = (this.canvas.width - cellWidth * this.cols) / 2;
    const startY = (this.canvas.height - cellHeight * this.rows) / 2;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = startX + col * cellWidth + cellWidth / 2;
        const y = startY + row * cellHeight + cellHeight / 2;
        this.ctx.fillStyle = this.getColorBySize(this.grid[row][col].size);
        this.ctx.font = `${this.grid[row][col].size}px monospace`;
        this.ctx.fillText(this.grid[row][col].letter, x, y);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear the canvas
    this.drawGrid();
  }

  animate() {
    this.updateGrid();
    this.draw();
    requestAnimationFrame(this.animate.bind(this));
  }
}

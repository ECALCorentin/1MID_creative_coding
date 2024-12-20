import BaseApp from "./BaseApp.js";
import Circle from "./Circle.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.circles = [];
    this.rows = 1;
    this.cols = 1;
    this.createGrid();
    this.init();
  }

  setupMIDI(MidiAccess) {
    const inputs = MidiAccess.inputs.values();
    for (const input of inputs) {
      console.log("Tes inots", input);
      input.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }

  handleMIDIMessage(message) {
    const [command, controller, value] = message.data;
    console.log("MIDI message", command, controller, value);

    if (controller === 1) {
      this.rows += 1;
      this.createGrid();
    }

    if (controller === 2) {
      this.cols += 1;
      this.createGrid();
    }

    if (controller === 3) {
      this.cols = cols - 1;
      this.createGrid();
    }
    if (controller === 4) {
      this.cols = cols - 1;
      this.createGrid();
    }
  }

  createGrid() {
    this.circles = [];
    const spacing = 60;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const x = j * spacing + spacing / 2;
        const y = i * spacing + spacing / 2;
        this.circles.push(new Circle(x, y, 25));
      }
    }
    this.draw();
  }

  init() {
    console.log("init");

    if (navigator.requestMIDIAccess) {
      navigator
        .requestMIDIAccess()
        .then(this.setupMIDI.bind(this))
        .catch((err) => console.log("Something went wrong", err));
    }
    this.createGrid();
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
    this.circles.forEach((circle) => circle.draw(this.ctx));
    requestAnimationFrame(this.draw.bind(this));
  }
}

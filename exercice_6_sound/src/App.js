import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./piano.mp3";
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      const position_souris_x = e.clientX;
      const pourcentage = position_souris_x / window.innerWidth;
      this.audio.currentTime = this.audio.duration * pourcentage;

      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }

      draw();
    });

    this.audioContext = new AudioContext();
    this.source = this.audioContext.createMediaElementSource(this.audio);

    this.analyser = this.audioContext.createAnalyser();
    this.destination = this.audioContext.destination;
    this.source.connect(this.analyser);
    this.analyser.fftSize = 2048;

    this.dataArray = new Uint8Array(this.analyser.fftSize);
    this.waveArray = new Uint8Array(this.analyser.fftSize);
  }

  analyseFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  analyseWaveform() {
    this.analyser.getByteDomainData(this.waveArray);
  }

  draw() {
    this.analyseFrequencies();
    this.analyseWaveform();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const barWidth = this.canvas.width / this.dataArray.length;

    for (let i = 0; i < this.dataArray.length; i++) {
      const barHeight = this.dataArray[i] / 2;
      this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
      this.ctx.fillRect(
        i * barWidth,
        this.canvas.height - barHeight,
        barWidth,
        barHeight
      );
      x += barWidth;
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import BaseApp from "./BaseApp.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.setupElements();
    // this.setupSpeechRegognition();
    this.init();
  }

  setupElements() {
    this.video = document.createElement("video");
    this.video.autoplay = true;
    document.body.appendChild(this.video);
  }

  async init() {
    const vision = await FilesetResolver.forVisionTasks("./wasm");

    this.HandLandmarker = await HandLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: `./hand_landmarker.task`,
        delegate: "GPU",
      },
      runningMode: "VIDEO",
      numHands: 2,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1920, height: 1080 },
    });

    this.video.srcObject = stream;

    this.video.addEventListener("loadeddata", () => {
      (this.canvas, this.video).forEach((el) => {
        el.width = el.style.width = 1920;
        el.height = el.style.height = 1080;
      });
      this.draw();
    });
  }

  draw() {
    this.detect();
    requestAnimationFrame(this.draw.bind(this));
  }

  detect() {
    const results = this.HandLandmarker.detectForVideo(
      this.video,
      performance.now()
    );

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (results.landmarks) {
      results.landmarks.forEach((landmarks, index) => {
        drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 3,
        });

        drawLandmarks(this.ctx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      });
    }
  }
}

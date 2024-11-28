export default class Webcam {
  constructor() {
    this.video = document.createElement("video");
    this.video.width = 800;
    this.video.height = 800;
    // get user media
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1920, height: 1080 } })
      .then((stream) => {
        console.log("Webcam démarrée avec succès !");
        this.video.srcObject = stream;
        this.video.play();
      })
      .catch((error) => {
        console.error("Erreur lors de l'accès à la webcam :", error);
      });
  }
}

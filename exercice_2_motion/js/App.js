import Circle from "./Circle.js";
import Easing from "./Easing.js"; // Importer les easing functions

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
    this.mouse = { x: 0, y: 0 };
    this.circles = [];
    this.time = 0; // Temps pour gérer l'easing
    this.createCanvas();
    this.initMouseEvents();

    this.addNewCircle(100, 100, 50);

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

  initMouseEvents() {
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    });
  }

  addNewCircle(x, y, radius) {
    const newCircle = new Circle(x, y, radius);
    this.circles.push(newCircle);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.time += 16;
    this.circles.forEach((circle) => {
      if (circle.easingTime > 0) {
        const t = 1 - circle.easingTime / circle.easingDuration;
        const easedProgress = Easing.backOut(t);

        circle.x += circle.easedSpeedX * easedProgress * 2;
        circle.y += circle.easedSpeedY * easedProgress * 2;

        circle.easingTime -= 16;
      } else {
        circle.x += circle.speedX;
        circle.y += circle.speedY;
        if (
          circle.x - circle.radius < 0 ||
          circle.x + circle.radius > this.width
        ) {
          circle.speedX = -circle.speedX;
        }
        if (
          circle.y - circle.radius < 0 ||
          circle.y + circle.radius > this.height
        ) {
          circle.speedY = -circle.speedY;
        }
      }
      circle.draw(this.ctx);

      if (this.isCollidingWithMouse(circle)) {
        if (!circle.hasCollidedWithMouse) {
          this.triggerEasingOnCollision(circle);
          circle.hasCollidedWithMouse = true;
        }
      } else {
        circle.hasCollidedWithMouse = false;
      }
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  isCollidingWithMouse(circle) {
    const distX = circle.x - this.mouse.x;
    const distY = circle.y - this.mouse.y;
    const distance = Math.sqrt(distX ** 2 + distY ** 2);
    return distance < circle.radius;
  }

  triggerEasingOnCollision(circle) {
    circle.easingTime = 500;
    circle.easingDuration = 500;

    circle.easedSpeedX = -circle.speedX;
    circle.easedSpeedY = -circle.speedY;

    circle.speedX = -circle.speedX;
    circle.speedY = -circle.speedY;

    this.addNewCircle(circle.x, circle.y, circle.radius);
  }
}

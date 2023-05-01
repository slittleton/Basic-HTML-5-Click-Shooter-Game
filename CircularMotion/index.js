import { randomIntFromRange, randomColor, distance } from './utils.js';


const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66'];

// Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});

// Objects
class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.05;
        this.distanceFromCenter = randomIntFromRange(50, 200);
        this.lastMouse = { x,y };
    }

    draw(lastPoint) {
        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.closePath();
    }

    update() {
        const lastPoint = { x: this.x, y: this.y };
        this.radians += this.velocity;
        this.lastMouse.x = (mouse.x - this.lastMouse.x * .05)
        this.lastMouse.y = (mouse.y - this.lastMouse.y * .05)

        console.log (this.lastMouse)
        console.log(mouse.x, mouse.y)
        // Move points over time
        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
        this.draw(lastPoint);

    }
}

// Implementation
let particles;
function init() {
    particles = [];

    for (let i = 0; i < 50; i++) {

        const radius = (Math.random() * 2) + 3;

        particles.push(new Particle(

            canvas.width / 2, canvas.height / 2, radius, randomColor(colors))
        );
    }

    console.log(particles);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(255,255,255,0.05)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
    });

}

init();
animate();
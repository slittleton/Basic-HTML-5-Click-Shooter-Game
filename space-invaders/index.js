
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
console.log(c);

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        };



        const image = new Image();
        image.src = './assets/spaceship.png';
        image.onload = () => {
            const scale = 0.15
            this.image = image;
            this.width = image.width *scale;
            this.height = image.height *scale;
            this.position = { x: canvas.width/2 -this.width/2, y: canvas.height*.9};

        };

    }



    draw() {

        if (this.image)
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }



}

const player = new Player();
player.draw();


function animate() {

    requestAnimationFrame(animate);


    player.draw();
}

animate();

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const scoreEl = document.querySelector("#scoreEl");
const startGameBtn = document.querySelector("#startGameBtn");
const modalEl = document.querySelector("#modalEl");
const bigScoreEl = document.querySelector("#bigScoreEl");

console.log(c);

// PLAYER ---------------------------------------------------------
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

// PROJECTILE -------------------------------------------------------
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

// ENEMY ---------------------------------------------------------------
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}
// PARTICLE} ---------------------------------------------------------------
const friction = 0.98; // for slowing down particle over time
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        //use alpha for fading out particles
        this.alpha = 1;
    }

    draw() {
        c.save(); // allows you to call special html5 canvas functions for this specific bit of code

        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();

        c.restore(); // end save() state
    }

    update() {
        this.draw();

        // slow particles down over time
        this.velocity.x *= friction;
        this.velocity.y *= friction;

        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;

        // fade out particles
        this.alpha -= 0.01;
    }
}

// =========================================================
// Player start position is middle of screen
const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];


function init() {
    score = 0;
    scoreEl.innerHTML = 0;
    bigScoreEl.innerHTML = 0;
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = [];

}


// FUNCTIONS ----------------------------------------------------------
function spawnEnemies() {
    setInterval(() => {
        // get value from 4 to 30 for enemy size
        const radius = Math.random() * (30 - 4) + 4;

        // spawn enemies just outside of screen

        let x;
        let y;
        // if enemy spawns on left or right side of screen
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        // if enemy spawns on top or bottom of screen
        else if (Math.random() >= 0.5) {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }



        const color = `hsl(${Math.random() * 360}, 90%, 50%)`;
        const angle = Math.atan2(
            (canvas.height / 2) - y,
            (canvas.width / 2) - x
        );

        const velocity = {
            // the /n slows down the enemy speed
            x: Math.cos(angle) / 1.5,
            y: Math.sin(angle) / 1.5
        };



        const enemy = new Enemy(x, y, radius, color, velocity);
        enemies.push(enemy);
        console.log(enemies);
    }, 1000);
}

let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);

    // clear old drawings of particles and player
    // c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'rgba(0,0,0,0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // draw updated version of player and particles
    player.draw();
    particles.forEach((particle, particleIndex) => {
        // once alpha reaches 0 stop or particles will reappear
        if (particle.alpha <= 0) {
            particles.splice(particleIndex, 1);
        } else {
            particle.update();
        }
        particle.update();
    });
    projectiles.forEach(projectile => {
        projectile.update();
    });


    // Remove projectiles that go offscreen
    projectiles.forEach((projectile, projectileIndex) => {
        if (projectile.x + projectile.radius < 0 ||
            projectiles.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            // the setTimeout is used to waint until the next frame before removing items (prevents items flashing on screen)
            setTimeout(() => {
                projectiles.splice(projectileIndex, 1);
            }, 0);
        }
    });

    // Remove enemies that go offscreen
    let enemiesOnScreen = [];

    enemies.forEach((enemy) => {
        enemy.update();

        // Add enemy to new array if it's still on screen
        if (
            enemy.x + enemy.radius > 0 &&
            enemy.x - enemy.radius < canvas.width &&
            enemy.y + enemy.radius > 0 &&
            enemy.y - enemy.radius < canvas.height
        ) {
            enemiesOnScreen.push(enemy);
        }
    });
    // Replace old array with new one
    enemies = enemiesOnScreen;





    enemies.forEach((enemy, index) => {
        enemy.update();
        // collision detection Player and Enemy
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        // End Game
        if (dist - enemy.radius - player.radius < 1) {
            // the setTimeout is used to waint until the next frame before removing items (prevents items flashing on screen)
            setTimeout(() => {
                // Game Over / End Game - stop animation on specific frame
                cancelAnimationFrame(animationId);
                modalEl.style.display = 'flex';
                bigScoreEl.innerHTML = score;
            }, 0);
        }


        // Collision detection - projectile and enemy - projectiles touch enemy
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {




                // Create Explosions
                // Particles for exploding enemy at point where projectile contacts enemy
                for (let i = 0; i < enemy.radius * 2; i++) {
                    const particle = new Particle(
                        projectile.x,
                        projectile.y,
                        Math.random() * 2,
                        enemy.color,
                        {
                            x: (Math.random() - 0.5) * (Math.random() * 6),
                            y: (Math.random() - 0.5) * (Math.random() * 6),
                        });
                    particles.push(particle);

                }


                // Shrink Large Enemies that get hit
                if (enemy.radius - 10 > 5) {

                    // increase score
                    score += 100;
                    scoreEl.innerHTML = score;

                    // use gsap library to transition animation "shrink enemy"
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });

                    // enemy.radius -= 10;

                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);


                } else {

                    // Bonux increase score for completely destroying/removing enemy from screen
                    score += 255;
                    scoreEl.innerHTML = score;

                    // Enemy and Projectile Removed From Screen
                    // the setTimeout is used to waint until the next frame before removing items (prevents items flashing on screen)
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }

            }
        });
    });


}


// Window -------------------------------------------------------------------
addEventListener('click', (event) => {
    // atan2(y,x)
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };

    const projectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'white',
        {
            x: velocity.x,
            y: velocity.y
        });


    projectiles.push(projectile);
    projectile.draw();


});

startGameBtn.addEventListener('click', () => {
    init();
    spawnEnemies();
    animate();
    modalEl.style.display = 'none';


})


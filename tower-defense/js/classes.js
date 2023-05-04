

class PlacementTile {
    constructor({ x = 0, y = 0 }) {
        this.position = { x, y };
        this.size = 64;
        this.color = 'rgba(255,255,255,0.15)';
        this.isOccupied = false;
    }
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
    update(mouse) {
        this.draw();
        // if mouse is over the build location tile
        if (mouse.x > this.position.x &&
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y &&
            mouse.y < this.position.y + this.size) {
            // console.log('colliding');
            this.color = 'white';

        } else {
            this.color = 'rgba(255,255,255,0.15)';
        }
    }
}


class Enemy {
    constructor({ x = 0, y = 0 }) {
        this.position = { x, y };
        this.width = 100;
        this.height = 100;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
        this.radius = 50;
        this.health = 100
    }

    draw() {
        c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.beginPath();
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        c.fill();

        // red bar is behind green and shows up when health "decreases" by shortening green bar
        // health bar
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y -15, this.width, 10)

        // health bar
        c.fillStyle = 'green'
        if(this.health > 0){
            this.width * this.health/100
        } else{
            this.health = 0
        }
        c.fillRect(this.position.x, this.position.y -15, this.health, 10)
    }

    update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const xDist = waypoint.x - this.center.x;
        const yDist = waypoint.y - this.center.y;
        // get angle between x and y in radians  starting at center of enemy
        const angle = Math.atan2(yDist, xDist);
        // plug angle into cos(r) and sin(r) to get x and y velocity
        // enemy will move towards specified waypoint 
        this.position.x += Math.cos(angle);
        this.position.y += Math.sin(angle);
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };

        //when enemy reaches waypoint index then increase waypoint index
        // enemy will then go to next waypoint index
        if (
            Math.round(this.center.x) === waypoint.x &&
            Math.round(this.center.y) === waypoint.y &&
            this.waypointIndex < waypoints.length - 1
        ) {
            this.waypointIndex++;
        }


    }
}

class Projectile {
    constructor({ x = 0, y = 0 }, enemy) {
        this.position = { x, y };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = enemy;
        this.radius = 10;
        this.power = 2;

    }
    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'orange';
        c.fill();
    }

    update() {
        this.draw();
        const angle = Math.atan2(
            this.enemy.center.y - this.position.y,
            this.enemy.center.x - this.position.x);

        this.velocity.x = Math.cos(angle) * this.power;
        this.velocity.y = Math.sin(angle) * this.power;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Building {
    constructor({ x = 0, y = 0 }) {
        this.position = { x, y };
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height / 2
        };
        this.projectiles = [

        ];
        this.radius = 250; // radius used for distance that towers must be to start shooting at enemy
        this.target;
        this.frames = 0;
    }
    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, 64);

        c.beginPath();
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'rgba(0,0,255,0.2)';
        c.fill();
    }
    update() {
        this.draw();
        // add a projectile being fired every n=100 frames at an enemy that is in range
        if (this.frames % 100 === 0 && this.target) {
            this.projectiles.push(new Projectile(
                {
                    x: this.center.x,
                    y: this.center.y
                },
                this.target
            ));
        }
        this.frames++;
    }
}
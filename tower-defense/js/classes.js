

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
    }

    draw() {
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

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

class Building {
    constructor({ x = 0, y = 0 }) {
        this.position = { x, y };
        this.width = 64 * 2;

    }
    draw() {
        c.fillStyle = 'blue';
        c.fillRect(this.position.x, this.position.y, this.width, 64);
    }
}
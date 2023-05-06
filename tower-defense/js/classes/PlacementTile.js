

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
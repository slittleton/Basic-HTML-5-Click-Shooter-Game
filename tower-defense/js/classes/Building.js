const buildingImgSrc = '../../assets/tower.png';

class Building extends Sprite {
    constructor({ x = 0, y = 0 }) {
        super({ x, y }, buildingImgSrc, { max: 19 }, { x: 0, y: -80 });

        // this.position = { x, y };
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
        // this.elapsedSpawnTime = 0;
    }
    draw() {
        // c.fillStyle = 'blue';
        // c.fillRect(this.position.x, this.position.y, this.width, 64);

        super.draw();

        // c.beginPath();
        // c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        // c.fillStyle = 'rgba(0,0,255,0.1)';
        // c.fill();
    }


    update() {
        this.draw();
        if(this.target ||( !this.target && this.frames.current != 0)){
            super.update()
        }

        if (this.frames.elapsed % this.frames.hold === 0 && this.target && this.frames.current === 6) {
            this.shoot();
        }


    }
    shoot() {

        this.projectiles.push(new Projectile(
            {
                x: this.center.x - 20,
                y: this.center.y - 110
            },
            this.target
        ));


    }
}
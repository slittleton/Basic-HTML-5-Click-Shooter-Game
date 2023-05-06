const projectileImgSrc = '../../assets/projectile.png';


class Projectile extends Sprite {
    constructor({ x = 0, y = 0 }, enemy) {
        super({ x, y }, projectileImgSrc);
        // this.position = { x, y };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = enemy;
        this.radius = 10;
        this.power = 2;

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
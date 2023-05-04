const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 768;
const mouse = {
    x: undefined,
    y: undefined
};
const placementTiles = [];






c.fillStyle = 'white';
c.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2d = [];
// make 2d array to use as matrix for locations of possible defense build locations
// each row is 20 tiles wide
for (let i = 0; i < placementTilesData.length; i += 20) {
    placementTilesData2d.push(placementTilesData.slice(i, i + 20));
}

placementTilesData2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 14) {
            // add building placement tile here using indicies of loops
            // multiply the index by 64 because each tile is 64X64 pixels
            placementTiles.push(new PlacementTile({
                x: x * 64,
                y: y * 64
            }));
        }
    });
});


const image = new Image();
image.src = '../assets/game-map.png';

let x = 200;
let y = 400;

const enemies = [];
let enemyCount = 3;
spawnEnemies(enemyCount);
function spawnEnemies(spawnCount) {
    spawnCount = spawnCount + 1;

    for (let i = 1; i < spawnCount; i++) {
        let xOffset = i * 150;
        let xStart = waypoints[0].x - xOffset;
        let yStart = waypoints[0].y;
        let enemy = new Enemy({ x: xStart, y: yStart });

        enemies.push(enemy);
    }

}




const buildings = [];
let activeTile = undefined;


function animate() {
    requestAnimationFrame(animate);
    c.drawImage(image, 0, 0);

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update();
    }


    placementTiles.forEach(tile => {
        tile.update(mouse);
    });

    for (let i = buildings.length - 1; i >= 0; i--) {
        const building = buildings[i];
        building.update();
        building.target = null;
        const validEnemies = enemies.filter(enemy => {
            const xDifference = enemy.center.x - building.position.x;
            const yDifference = enemy.center.y - building.position.y;
            const distance = Math.hypot(xDifference, yDifference);
            // if the distance between an enemy and the building is inside the targeting area
            // then the enemy can be fired at
            return distance < enemy.radius + building.radius;

        });
        building.target = validEnemies[0];

        for (let i = building.projectiles.length - 1; i >= 0; i--) {
            const projectile = building.projectiles[i];

            projectile.update();
            const xDifference = projectile.enemy.center.x - projectile.position.x;
            const yDifference = projectile.enemy.center.y - projectile.position.y;
            const distance = Math.hypot(xDifference, yDifference);

            // Projectile Hits enemy. Eliminate projectile and reduce enemy health
            if (distance < projectile.enemy.radius + projectile.radius) {

                // ENEMY HEALTH
                projectile.enemy.health -= 20;
                if (projectile.enemy.health <= 0) {
                    // find enemy that has been killed
                    const enemyIndex = enemies.findIndex((enemy) => {
                        return projectile.enemy === enemy;
                    });
                    // cover case where enemy killed by another projectile while others are still on
                    // their way, ie prevents removing additonal enemies from array
                    // because the enemy was killed before all projectiles targeting it actually hit
                    // REMOVE ENEMY
                    if (enemyIndex > -1) {
                        enemies.splice(enemyIndex, 1);
                    }

                    if (enemies.length === 0) {
                        enemyCount += 2;
                        spawnEnemies(enemyCount);
                    }



                }
                // REMOVE PROJECTILE AFTER IT HITS ENEMY
                building.projectiles.splice(i, 1);
            }
        }

    }

}

animate();

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied) {
        buildings.push(new Building({
            x: activeTile.position.x,
            y: activeTile.position.y
        }));
        activeTile.isOccupied = true;

    }
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    activeTile = null;
    for (let i = 0; i < placementTiles.length; i++) {
        const tile = placementTiles[i];
        if (mouse.x > tile.position.x &&
            mouse.x < tile.position.x + tile.size &&
            mouse.y > tile.position.y &&
            mouse.y < tile.position.y + tile.size) {

            activeTile = tile;
            break;
        }
    }


});
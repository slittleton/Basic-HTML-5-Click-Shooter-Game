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
for (let i = 0; i < 10; i++) {
    const xOffset = i * 150;
    // console.log(xOffset);

    let xStart = waypoints[0].x - xOffset;
    console.log(xStart);

    let enemy = new Enemy({ x: waypoints[0].x - xOffset, y: waypoints[0].y });
    console.log(enemy.position.x);
    enemies.push(enemy);

}
const buildings = [];
let activeTile = undefined;


function animate() {
    requestAnimationFrame(animate);
    c.drawImage(image, 0, 0);

    enemies.forEach(enemy => {
        enemy.update();
    });
    placementTiles.forEach(tile => {
        tile.update(mouse);
    });
    buildings.forEach(building => {
        building.draw();
    });

}

animate();

canvas.addEventListener('click', (event) => {
    if (activeTile && !activeTile.isOccupied) {
        buildings.push(new Building({
            x: activeTile.position.x,
            y: activeTile.position.y
        }));
        activeTile.isOccupied = true;
        console.log(buildings);
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
    // console.log(activeTile);

});
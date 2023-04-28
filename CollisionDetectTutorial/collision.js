const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// mouse
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

// Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});





// Animation Loop
function animate() {

    // mouse.x and mouse.y are the top left corner of the rectangle
    const redRect = {
        width: 100,
        height: 100,
        x: mouse.x,
        y: mouse.y
    };
    const blueRect = {
        width: 100,
        height: 100,
        x: canvas.width / 2 - 50,
        y: canvas.height / 2 - 50
    };



    requestAnimationFrame(animate);
    c.fillStyle = '#1A1A23';
    c.fillRect(0, 0, canvas.width, canvas.height);

    // ------- Collision Detection -----------
    if (
        redRect.x + redRect.width >= blueRect.x &&
        redRect.x <= blueRect.x + blueRect.width &&
        redRect.y + redRect.height >= blueRect.y &&
        redRect.y <= blueRect.y + blueRect.height
    ) {
        console.log('collision');
    }



    // red rectangle
    c.fillStyle = '#E86262';
    c.fillRect(redRect.x, redRect.y, redRect.width, redRect.height);

    // blue rectangle
    c.fillStyle = '#92ABEA';
    c.fillRect(blueRect.x, blueRect.y, blueRect.width, blueRect.height);
}

animate();
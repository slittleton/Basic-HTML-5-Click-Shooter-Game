import platform from './img/platform.png';
import hills from './img/hills.png';
import background from './img/background.png';
import platformSmallTall from './img/platformSmallTall.png';

import spriteRunLeft from './img/spriteRunLeft.png';
import spriteRunRight from './img/spriteRunRight.png';
import spriteStandLeft from './img/spriteStandLeft.png';
import spriteStandRight from './img/spriteStandRight.png';



const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;
class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 66;
        this.height = 150;
        this.speed = 7;
        this.image = createImage(spriteStandRight);
        this.frames = 0;
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width: 127.875
            }
        };
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = 177;
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x,
            this.position.y,
            this.width,
            this.height);
    }

    update() {
        this.frames++;
        if (this.frames > 59 &&
            (this.currentSprite == this.sprites.stand.right) ||
            (this.currentSprite == this.sprites.stand.right)
        ) {
            this.frames = 0;
        } else if (this.frames > 29 &&
            (this.currentSprite === this.sprites.run.right) ||
            (this.currentSprite === this.sprites.run.left)
        ) {
            this.frames = 0;
        }


        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // gravity - player stops at bottom of screen
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        }

    }

}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;

    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y);
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}


function createImage(imageSrc) {
    const image = new Image();
    image.src = imageSrc;
    return image;
}

let lastKey = '';
let player = new Player();
let platformImage = createImage(platform);
let backgroundImage = createImage(background);
let hillsImage = createImage(hills);
let platformSmallTallImage = createImage(platformSmallTall);


let platforms = [

];



let genericObjects = [

];


let keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    }
};

// measure how far left player has traveled to the left
let scrollOffset = 0;

function init() {
    player = new Player();
    platformImage = createImage(platform);
    backgroundImage = createImage(background);
    hillsImage = createImage(hills);
    platformSmallTallImage = createImage(platformSmallTall);

    platforms = [
        new Platform({ x: platformSmallTallImage.width * 4 + 330 - 3, y: 370, image: platformSmallTallImage }),
        new Platform({ x: platformSmallTallImage.width * 4 - 3, y: 670, image: platformSmallTallImage }),
        new Platform({ x: platformSmallTallImage.width * 7 + 580 - 3, y: 380, image: platformSmallTallImage }),
        new Platform({ x: platformSmallTallImage.width * 7 + 780 - 3, y: 320, image: platformSmallTallImage }),

        new Platform({ x: -1, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width - 3, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 2 + 100, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 3 + 300, y: 470, image: platformImage }),

        new Platform({ x: platformImage.width * 6 - 3, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 7 - 5, y: 470, image: platformImage }),
        new Platform({ x: platformImage.width * 8 + 270 - 6, y: 470, image: platformImage }),


    ];


    genericObjects = [
        new GenericObject({ x: -1, y: -1, image: backgroundImage }),
        new GenericObject({ x: -1, y: -1, image: hillsImage }),
        new GenericObject({ x: 1000, y: -1, image: hillsImage })
    ];


    keys = {
        right: {
            pressed: false,
        },
        left: {
            pressed: false,
        }
    };

    // measure how far left player has traveled to the left
    scrollOffset = 0;

}
function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    // c.clearRect(0, 0, canvas.width, canvas.height);

    genericObjects.forEach(genericObject => {
        genericObject.draw();

    });

    platforms.forEach(platform => {
        platform.draw();
    });
    player.update();


    // Player Movement Conditions 
    // once player gets to middle of screen then start moving world to the left or right if player goes to left of screen
    // this will give the appearance that the player is moving through the world 
    if (keys.right.pressed &&
        player.position.x < 400) {
        player.velocity.x = player.speed;

    } else if (
        (keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)

    ) { //if player is 10 units from the left stop player and move world right
        player.velocity.x = -player.speed;
    } else {
        player.velocity.x = 0; //
        if (keys.right.pressed) {
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });
            // Parallax effect Right
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * .66;
            });
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += 5;
            });
            // Parallax effect Left
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * .66;
            });
        }
    }

    //  platform collision detection
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0;
        }
    });

    // Sprite Animation Switching
    if (
        keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.run.right
    ) {
        player.frames = 1;
        player.currentSprite = player.sprites.run.right;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (
        keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.run.left
    ) {
        player.frames = 1;
        player.currentSprite = player.sprites.run.left;
        player.currentCropWidth = player.sprites.run.cropWidth;
        player.width = player.sprites.run.width;
    } else if (
        !keys.left.pressed &&
        lastKey === 'left' &&
        player.currentSprite !== player.sprites.stand.left
    ) {
        player.currentSprite = player.sprites.stand.left;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    } else if (
        !keys.right.pressed &&
        lastKey === 'right' &&
        player.currentSprite !== player.sprites.stand.right
    ) {
        player.currentSprite = player.sprites.stand.right;
        player.currentCropWidth = player.sprites.stand.cropWidth;
        player.width = player.sprites.stand.width;
    }


    // Win Condition
    if (scrollOffset > 2000) {
        console.log("You Win");
    }
    // Lose Condition
    if (player.position.y > canvas.height) {
        console.log("You Lose");
        init();
    }
}
init();
animate();

let jumpHeight = 10;

// Player Movement Keypress Listener
window.addEventListener('keydown', ({ keyCode }) => {
    // console.log(keyCode);

    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = true;
            lastKey = 'left';
            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = true;
            lastKey = 'right';

            break;
        case 87:
            console.log('up');
            if (player.velocity.y < 10) {
                player.velocity.y -= jumpHeight;
            }

            break;
    }
});

window.addEventListener('keyup', ({ keyCode }) => {
    // console.log(keyCode);

    switch (keyCode) {
        case 65:
            console.log('left');
            keys.left.pressed = false;

            break;
        case 83:
            console.log('down');
            break;
        case 68:
            console.log('right');
            keys.right.pressed = false;

            break;
        case 87:
            console.log('up');

            break;
    }
});
let box; //sprite for player

//image assets

let cube; //image for cube character

let bg; // image for geodash background

//part 2

let tileMap1; //tilemap1

let tileMap2;

let spike; //spike image

// level building groups

let ground;

let orbs;

let sharp;

let finishline;

//SEGMENT 3

const MAX_JUMP = 1;

let jumpChance = MAX_JUMP;

//SEGMENT 5

let startSprite;

let endSprite;

let startGameImg;

let endGameImg;

let startGame = false;

//let menuOpen = false;

let gameOver = false;

//5.2

let level = 1;

let lastlevel = 2;

 

function preload() {

    cube = loadImage('assets/cube.png');

    bg = loadImage('assets/geobg.png');

    tileMap1 = loadStrings('stages/tiles1.txt');

    //5.2

    tileMap2 = loadStrings('stages/tiles2.txt');

    spike = loadImage("assets/spike.png");

    //SEGMENT 5

    startGameImg = loadImage("assets/startgame.png");
    endGameImg = loadImage("assets/clear!.png");

}

function setup() {

    new Canvas(700, 600);

    world.gravity.y = 32; //set gravity of world

    box = new Sprite(50, height, 50, 50); //height is height of canvas. x,y,sprite width,sprite height 

    box.img = cube;

    box.friction = 0;

    box.bounciness = 0;

    box.collider = "none";

    startCoordinates = [50, height - box.height / 2]; //array for start point. 

    box.x = startCoordinates[0];

    box.y = startCoordinates[1];

    //PART 2

    ground = new Group();

    ground.tile = "g";

    ground.w = 50;

    ground.h = 50;

    ground.collider = "static";

    ground.color = "black";

    ground.stroke = "rgba(0,0,0,0)";

    orbs = new Group();

    orbs.tile = "o";

    orbs.d = 24; //diameter

    orbs.collider = "static";

    orbs.color = "white";

    orbs.strokeWeight = 0;

    sharp = new Group();

    sharp.tile = "s";

    sharp.h = 25;

    sharp.w = 25;

    sharp.img = spike;

    sharp.collider = "static";

    finishline = new Group();

    finishline.tile = "f";

    finishline.w = 50;

    finishline.h = 1200;

    finishline.visible = false;

    finishline.collider = "static";

    new Tiles(tileMap1, 0, 0, 50, 50); //create tiles from tilemap

    //SEGMENT 5

    startSprite = new Sprite(width / 2, height / 2, 190, 90);

    startSprite.img = startGameImg;

    startSprite.collider = "none";

}

function draw() {

    clear();

    image(bg, 0, 0, 800, 600);

    //SEGMENT 5

    if (!startGame && (mouse.presses() || kb.presses("space"))) {

        startGame = true;

        startSprite.visible = false;

        //Make the start image flash. It is visible for 30 frames and hidden for 30 frames. this creates a flashing effect.

    } else if (!startGame) {

        if (frameCount % 60 < 30) {

            startSprite.visible = true;

        } else {

            startSprite.visible = false;

        }

    }

    if (startGame) {

        //SEGMENT 3//

        box.collider = "dynamic";

        box.vel.x = 8;

        //JUMPING//

        if ((kb.presses('space') || mouse.presses()) && jumpChance > 0) {

            box.vel.y = -10;

            box.rotateTo(box.rotation + 359, 15);

            jumpChance -= 1;

        }

        if (box.collides(ground) && jumpChance < MAX_JUMP) {

            jumpChance = MAX_JUMP;

        }

        //CAMERA//

        if (box.x >= width / 2) {

            camera.x = box.x;

        } else {

            camera.x = width / 2;

        }

        //SEGMENT 4//

        for (let tile of ground) {

            if (box.colliding(tile)) {

                // Ignore tiles that are far away. This reduces unnecessary collision checks.

                //if (abs(tile.x - box.x) > 100) continue;

                // Calculate the x position of the tile's left edge.

                let leftEdge = tile.x - tile.w / 2;

                // Calculate the y position of the tile's top edge.

                let leftEdgeHeight = tile.y - tile.h / 2;

                // If the player hits the left side of a platform, the player loses and the level resets. //

                if (box.x < leftEdge && box.y > leftEdgeHeight) {

                    //lost = true;

                    resetGame();

                    break;

                }

            }

        }

        if (box.collides(sharp)) {

            //lost = true;

            resetGame();

        }

        for (let orb of orbs) {

            if (box.colliding(orb)) {

                orb.visible = false;

                orb.collider = "none";

                box.vel.y = -5;

                jumpChance = MAX_JUMP;

            }

        }

        //SEGMENT 5

        if (box.collides(finishline)) {

            //lost = false;

            triggerGameOver();

        }

        //SEGMENT 5.2

        if (gameOver) {

            if (frameCount - endTimer > 120) {

                if (endSprite) {

                    endSprite.remove();

                }

                startGame = false;

                gameOver = false;

                resetGame();

                level += 1;

                loadLevel();

            }

        }

    }

 

 

}

//SEGMENT 4//

function resetGame() {

    //   if (lost) {

    //     backgroundTrack.stop();

    //     failSound.play();

    //   }

    //   particles.removeAll();

    startGame = false;

    //   box.vel.y = 0;

    //   box.vel.x = 0;

    // Reset the player's rotation.

    box.rotation = 0;

    // Return the player to the starting position.

    box.x = startCoordinates[0];

    box.y = startCoordinates[1];

    // Restore the player's available jumps.

    jumpChance = MAX_JUMP;

    // Return the camera to its starting position.

    camera.x = width / 2;

    for (let orb of orbs) {

        orb.visible = true;

        orb.collider = "static";

    }

}

//SEGMENT 5

function triggerGameOver() {

    //backgroundTrack.stop();

    if (!gameOver) {

        //passSound.play();

        gameOver = true;

        box.vel.x = 0;

        jumpChance = 0;

 

        endTimer = frameCount;

        if (endSprite) {

            endSprite.remove();

        }

        endSprite = new Sprite(box.x, height / 2, 126, 24);

        endSprite.collider = "none";

        endSprite.img = endGameImg;

    }

}

//5.2

function loadLevel() {

    ground.removeAll();

    sharp.removeAll();

    orbs.removeAll();

    finishline.removeAll();

    if (lastlevel < level) { /* Return to level 1 after the player completes the final available level. */

        level = 1;

    }

    if (level === 1) { // Load the correct tile map for the current level.

        new Tiles(tileMap1, 0, 0, 50, 50);

        //mapUsed = tileMap1;

    } else if (level === 2) {

        new Tiles(tileMap2, 0, 0, 50, 50);

        //mapUsed = tileMap2;

    }

}

// //SEGMENT 5

//     if (!startGame && (mouse.presses() || kb.presses("space"))) {

//         // if (menuImg.mouse.hovering() && menuImg.visible === true) {

//         // menuOpen = true;

//         // openMenu();

//         // } else if (menuOpen === false) {

//         startGame = true;

//         startSprite.visible = false;

//         //menuImg.visible = false;

//         //}

//         //choiceSelect();

//     ///* Make the start image flash. It is visible for 30 frames and hidden for 30 frames.

//     // At 60 frames per second, this creates a flashing effect. */

//     } else if (!startGame) {

//         if (frameCount % 60 < 30) {

//         startSprite.visible = true;

//         } else {

//         startSprite.visible = false;

//         }

//         //menuImg.visible = true;

//     }
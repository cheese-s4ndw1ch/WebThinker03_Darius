//playerbox
let player;
let gameState = "menu"; 
//image sprite
let cubeImg, cube2Img, spikeImg, clearImg;
let menuImg, menuBgImg, geoBgImg, startGameImg;
//sounds
let gameStartSound, deathSound, bgMusic;
//world building :D
let obstacles;
//ground stuff
let groundY = 320;
//preloading assets yay
function preload() {
    //images
  cubeImg = loadImage('cube.png');
  cube2Img = loadImage('cube2.png');
  spikeImg = loadImage('spike.png');
  clearImg = loadImage('clear.png');
  menuImg = loadImage('menu.png');
  menuBgImg = loadImage('menubg.png');
  geoBgImg = loadImage('geobg.png');
  startGameImg = loadImage('startgame.png');
  //sounds
  
  soundFormats('mp3');
  gameStartSound = loadSound('game-start.mp3');
  deathSound = loadSound('geometry-dash-death-sound.mp3');
  bgMusic = loadSound('stereo-madness.mp3');
}
//setting up le game
function setup() {
  createCanvas(700, 600); 
  
  world.gravity.y = 32; 

  obstacles = new Group();
  obstacles.collider = 'static'; 
  
  player = new Sprite(50, groundY - 50, 50, 40);
  player.img = cubeImg;
  player.collider = 'dynamic';
  player.rotationLock = true; 
  player.visible = false;
  
  let ground = new Sprite(width / 2, groundY + 10, width, 20);
  ground.collider = 'static';
  ground.visible = false; 
}

function draw() {
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "playing") {
    drawGameplay();
  }
}

function drawMenu() {
  if (menuBgImg) image(menuBgImg, 0, 0, width, height);
  if (menuImg) image(menuImg, width / 2 - 150, 50, 300, 100);
  
  if (startGameImg) {
    image(startGameImg, width / 2 - 60, height / 2, 120, 60);
  }
  
  player.visible = false;
  obstacles.visible = false;
}

function drawGameplay() {
  image(geoBgImg, 0, 0, width, height);
  
  stroke(255);
  line(0, groundY, width, groundY);

  if ((kb.presses('space') || kb.presses('up')) && player.velocity.y === 0) {
    player.velocity.y = -8; 
  }

  if (frameCount % 90 === 0) { 
    spawnSpike();
  }

  if (player.collides(obstacles)) {
    handleDeath();
  }
}

function spawnSpike() {
  let spike = new obstacles.Sprite(width + 30, groundY - 15, 30, 30);
  spike.img = spikeImg;
  spike.velocity.x = -6; 
  spike.life = 180;      
}

function handleDeath() {
  if (deathSound) deathSound.play();
  if (bgMusic && bgMusic.isPlaying()) bgMusic.stop();
  
  obstacles.removeAll();
  player.x = 150;
  player.y = groundY - 20;
  player.velocity.x = 0;
  player.velocity.y = 0;
  
  gameState = "menu";
}

function mousePressed() {
  if (gameState === "menu") {
    if (mouseX > width / 2 - 60 && mouseX < width / 2 + 60 &&
        mouseY > height / 2 && mouseY < height / 2 + 60) {
      
      gameState = "playing";
      player.visible = true;
      obstacles.visible = true;
      
      if (gameStartSound) gameStartSound.play();
      if (bgMusic) bgMusic.loop();
    }
  }
}
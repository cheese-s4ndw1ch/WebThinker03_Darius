//=========================================
// Variables
//=========================================

//=========================================
// Code
//=========================================

function preload() {}

function setup() {}

function draw() {}

//=========================================
// Function Created
//=========================================
let balloon;
let gameStarted = false;
let gameOver = false;
let score = 0;

function setup() {
  createCanvas(640, 480);

 
  balloon = new Sprite();
  balloon.diameter = 60;
  balloon.collider = 'none';
  balloon.color = 'red';
  balloon.x = width / 2;
  balloon.y = 100;
}

function draw() {
  background(220);

  if (!gameStarted) {
    // Start Screen
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Press SPACE to Start", width / 2, height / 2);
  } else {
    
    if (gameOver) {
      fill(0);
      textSize(24);
      textAlign(CENTER);
      text("Game Over! Press SPACE to Restart", width / 2, height / 2);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    gameStarted = true;
    gameOver = false;
    score = 0;

   
    balloon.x = width / 2;
    balloon.y = 100;
    balloon.vel.x = 0;
    balloon.vel.y = 0;
    balloon.collider = 'dynamic';
    balloon.bounciness = 1;
    balloon.mass = 2;
    balloon.drag = 0.01;
  }
}
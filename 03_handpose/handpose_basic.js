
let video;
let handPose;
let hands = [];

let balloon;
let fingerTip;
let bounceSound;

let gameStarted = false;
let gameOver = false;
let score = 0;

function preload() {
  
  bounceSound = createAudio('assets/LowBoing.mp3');
  

  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();


  handPose.detectStart(video, gotHands);

 
  balloon = new Sprite();
  balloon.diameter = 60;
  balloon.collider = 'none';
  balloon.color = 'red';
  balloon.x = width / 2;
  balloon.y = 100;

 
  fingerTip = new Sprite();
  fingerTip.diameter = 30;
  fingerTip.collider = 'kinematic';
  fingerTip.color = 'yellow';
}


function gotHands(results) {
  hands = results;
}

function draw() {
 
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  
  if (hands.length > 0) {
    let indexTipLandmark = hands[0].index_finger_tip;
    
   
    fingerTip.x = width - indexTipLandmark.x;
    fingerTip.y = indexTipLandmark.y;
  } else {
    // Hide tracking sprite off-screen if no hand detected
    fingerTip.x = -100;
    fingerTip.y = -100;
  }

  if (!gameStarted) {
    fill(0);
    textSize(24);
    textAlign(CENTER);
    text("Press SPACE to Start", width / 2, height / 2);
  } else {
    // Check collision between balloon and fingertip
    if (balloon.collides(fingerTip)) {
      bounceSound.play();
    }

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

    // Reset balloon position and physics
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
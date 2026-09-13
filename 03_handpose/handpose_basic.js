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
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JS Balloon Bounce</title>
  <style>
    body {
      margin: 0;
      background: #1e1e24;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: sans-serif;
      color: #fff;
    }
    .container {
      position: relative;
      width: 640px;
      height: 480px;
      border: 3px solid #ff7675;
      border-radius: 8px;
      overflow: hidden;
    }
    video, canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 640px;
      height: 480px;
      transform: scaleX(-1);
    }
    p {
      margin-top: 10px;
      font-size: 14px;
      color: #aaa;
    }
  </style>
</head>
<body>

<div class="container">
  <video id="webcam" autoplay playsinline></video>
  <canvas id="game" width="640" height="480"></canvas>
</div>
<p>Tip: Wear a bright green sticker or marker on your fingertip!</p>

<script>
  const video = document.getElementById('webcam');
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');

  // Fingertip tracker state
  let finger = { x: -1, y: -1, r: 20 };

  // Balloon state
  let balloon = {
    x: 320,
    y: 100,
    r: 35,
    vx: 2,
    vy: 0,
    gravity: 0.25,
    bounce: -10
  };

  // 1. Initialize Webcam
  navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
    .then(stream => { video.srcObject = stream; })
    .catch(err => console.error("Camera access denied:", err));

  // 2. Track Bright Green Color on Fingertip
  function trackFinger() {
    // Draw current video frame to temporary canvas context to sample pixels
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    let count = 0;
    let sumX = 0;
    let sumY = 0;

    // Scan pixels for high green channel relative to red/blue
    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const i = (y * canvas.width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Target bright green marker
        if (g > 120 && g > r * 1.4 && g > b * 1.4) {
          sumX += x;
          sumY += y;
          count++;
        }
      }
    }

    if (count > 10) {
      finger.x = sumX / count;
      finger.y = sumY / count;
    } else {
      finger.x = -1;
      finger.y = -1;
    }
  }

  // 3. Game Loop & Physics
  function loop() {
    trackFinger();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update balloon position
    balloon.vy += balloon.gravity;
    balloon.x += balloon.vx;
    balloon.y += balloon.vy;

    // Side wall bounce
    if (balloon.x - balloon.r < 0 || balloon.x + balloon.r > canvas.width) {
      balloon.vx *= -1;
    }

    // Reset balloon if dropped past bottom
    if (balloon.y - balloon.r > canvas.height) {
      balloon.y = 80;
      balloon.x = 320;
      balloon.vy = 0;
    }

    // Finger collision check
    if (finger.x > 0) {
      const dx = balloon.x - finger.x;
      const dy = balloon.y - finger.y;
      const dist = Math.hypot(dx, dy);

      if (dist < balloon.r + finger.r) {
        balloon.vy = balloon.bounce;
        balloon.vx = (dx / dist) * 5;
      }
    }

    // Draw Balloon
    ctx.beginPath();
    ctx.arc(balloon.x, balloon.y, balloon.r, 0, Math.PI * 2);
    ctx.fillStyle = '#ff7675';
    ctx.fill();
    ctx.strokeStyle = '#d63031';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Finger Circle Target
    if (finger.x > 0) {
      ctx.beginPath();
      ctx.arc(finger.x, finger.y, finger.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(85, 239, 196, 0.7)';
      ctx.fill();
      ctx.strokeStyle = '#00b894';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    requestAnimationFrame(loop);
  }

  video.addEventListener('loadedmetadata', () => {
    loop();
  });
</script>

</body>
</html>
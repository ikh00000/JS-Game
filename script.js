const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementsByClassName('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const title = document.getElementById('title');
const infoButton = document.getElementById('rules-btn');
const okButton = document.getElementById('close-btn');
const btnGrup = document.getElementById('btn-grup');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const win = document.getElementById('win');
const scoreId = document.getElementById('scoreId');
let score = 0;

const brickRowCount = 9; //space for bicks in row
const brickColumnCount = 4; //space for bicks in column


//Random Color for each start
const randHexColor = () => {
  let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
  color == '#ffffff' ? randHexColor() : color;
  return color;
}

const mainColor = randHexColor();

infoButton.style.color = mainColor;
okButton.style.color = mainColor;
rules.style.color = mainColor;
win.style.color = mainColor;
btnGrup.style.color = mainColor;//??

document.body.style.backgroundColor = mainColor;

console.log(mainColor);

// Create ball props
const ball = { //TRY EACH
  x: canvas.width / 2, //position x
  y: canvas.height / 2, //position y
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

// Create paddle props
const paddle = { //TRY EACH
  x: canvas.width / 2 - 40, //position X
  y: canvas.height - 20, //position Y
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

// Create brick props
const brickInfo = { //TRY EACH
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

// Create bricks
const bricks = []; //array with all bricks
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = []; //created space for columns in rows
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;//EDIT
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;//EDIT
    bricks[i][j] = { x, y, ...brickInfo }; //EDIT
  }
}

// Draw ball on canvas
const drawBall = () => {
  ctx.beginPath(); //Begins a path, or resets the current path
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2); //Creates an arc/curve (used to create circles, or parts of circles)
  ctx.fillStyle = mainColor; //Sets or returns the color, gradient, or pattern used to fill the drawing
  ctx.fill(); //Fills the current drawing (path)
  ctx.closePath(); //Creates a path from the current point back to the starting point
}

// Draw paddle on canvas
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h); //Creates a rectangle
  ctx.fillStyle = mainColor;
  ctx.fill();
  ctx.closePath();
}

// Draw score oon canvas
const drawScore = () => {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 30, 30); //Draws "filled" text on the canvas
}

// Draw bricks on canvas
const drawBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? mainColor : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
const movePaddle = () => {
  paddle.x += paddle.dx;

  // Wall detection
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }

  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

// Move ball on canvas
const moveBall = (play) => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision (right/left)
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1; // ball.dx = ball.dx * -1
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  // console.log(ball.x, ball.y);

  // Paddle collision
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.w &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  // Brick collision
  bricks.forEach(column => {
    column.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && // left brick side check
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check
          ball.y - ball.size < brick.y + brick.h // bottom brick side check
        ) {
          ball.dy *= -1;
          brick.visible = false;

          increaseScore();
        }
      }
    });
  });

  // Hit bottom wall - Lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }
}

// Increase score
const increaseScore = () => {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
}

// Make all bricks appear
const showAllBricks = () => {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Draw everything
const draw = () => {
  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

//If user have piked all bars
const lookForWin = () => {
  if(score == 5){
    console.log('win');
    win.classList.add('show');
    scoreId.innerHTML = "Score: " + score;
    score = 0;
    title.classList.add('blur');
    canvas.classList.add('blur');
    infoButton.classList.add('blur');
    btnGrup.classList.add('blur');
  }
}

// Update canvas drawing and animation
const update = () => {
  movePaddle();
  moveBall(true);

  // Draw everything
  draw();
  //perform an animation and requests that 
  //the browser calls a specified function 
  //to update an animation before the next repaint
  requestAnimationFrame(update);
  lookForWin();
  
}

update();



// Keydown event
const keyDown = (e) => {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft' || e.name == "Left") {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
const keyUp = (e) => {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {
    paddle.dx = 0;
  }
}

const btnDown = (arrow) => {
  if (arrow == 'left') {
    paddle.dx = -paddle.speed;
  } else {
    paddle.dx = paddle.speed;
  }
}

const btnUp = () => {
  paddle.dx = 0;
}



// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener("click", keyDown);
document.addEventListener("click", keyDown);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => {
  title.classList.add('blur');
  canvas.classList.add('blur');
  infoButton.classList.add('blur');
  btnGrup.classList.add('blur');
  rules.classList.add('show');

});
for(let i = 0; i < closeBtn.length; i++){
  closeBtn[i].addEventListener('click', () => {
    console.log('win');
    title.classList.remove('blur');
    canvas.classList.remove('blur');
    infoButton.classList.remove('blur');
    btnGrup.classList.remove('blur');
    rules.classList.remove('show');
    win.classList.remove('show');
  });
}


document.addEventListener('touchmove', (e)=>{
  let touch = e.touches[0];
  paddle.x = touch.pageX * 2;
  // console.log("Touch x:" + touch.pageX + ", y:" + touch.pageY);
});



// document.addEventListener('touchmove', function(event) {
//   event.preventDefault();
//   var touch = event.touches[0];
//   console.log("Touch x:" + touch.pageX + ", y:" + touch.pageY);
// }, false);
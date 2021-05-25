var rotate_init = 45;
var current_colour = 'lime';
var colour = ['lime', 'blue', 'red', 'yellow'];
var index = 1;
var falling_ball = '';
var score = 0;
var indices = 0;
var fails = 0;
var lives = 3;
var show_high_score = true;
var allowed = true;
var username;
var replay_array = [];
var capture_event;
var darkmode = false;
var set_ball_colour;
var pauseClicked = false;
var allowPause = true;

window.onload = () => {persistentDarkMode();}

function persistentDarkMode(){
  var darkModeStatus = localStorage.getItem("dark-mode");
  if(darkModeStatus == true || darkModeStatus == "true"){
    document.getElementsByClassName("darkmode-toggle")[0].click();
  }else{
  }
}

function rotate(deg, event){
  capture_event = event;
  var this_play = {
    event: event,
    deg: deg
  }

  replay_array.push(this_play);
  if(indices == 0){
    createFallingBalls();
    indices = 1;
  }
  current_colour = colour[index++];
  if(current_colour == 'yellow'){
    index = 0;
  }
  rotate_init = rotate_init + deg;
  var block = event.target;
  block.style.transform = 'rotateZ('+rotate_init+'deg)';

  document.getElementsByClassName("echo")[0].style.transform = "rotateZ("+rotate_init+"deg)";
}

window.ondblclick = (event) => {
  event.preventDefault();
}

window.onselect = (event) => {
  event.preventDefault();
}

function createFallingBalls(){
  if(allowed == true){
    falling_ball = document.createElement('div', 'div');
    falling_ball.setAttribute('id', 'falling_ball');
    var bg_colour = colour[Math.floor(Math.random()*colour.length)]
    set_ball_colour = bg_colour;
    falling_ball.setAttribute('data', bg_colour);
    falling_ball.style.backgroundColor = bg_colour;
    document.body.appendChild(falling_ball);
    setInterval(()=>{moveBall(falling_ball)}, 9.5);
  }else{
    console.warn("not allowed");
  }
}

function moveBall(ball){
  var this_play = {
    event: null,
    deg: null
  }

  replay_array.push(this_play);

  var ballStyle = window.getComputedStyle(ball);
  var topValue = ballStyle.getPropertyValue("top").replace("px", "");
  ball.style.top = (Number(topValue) + 95) + "px";
  var box = document.getElementsByClassName('block')[0];
  var boxStyle = window.getComputedStyle(box);
  var boxBottom = parseInt(boxStyle.bottom.replace('px', ''));
  var ballBottom = parseInt(ballStyle.bottom.replace('px', ''));
  var diff = ballBottom - boxBottom;
  if(diff < 90){
    document.getElementsByClassName("echo")[0].classList.add("echo-active");
    setTimeout(()=>{removeCurrentEcho()}, 430);
    var win = document.getElementById('audio');
    var fail = document.getElementById('audio2');
    var id = ball.getAttribute('id');
    var ball_colour = ball.getAttribute('data');
    if(current_colour == ball_colour){
      updateScore(20);
      win.play();
      document.getElementsByClassName("echo")[0].style.backgroundColor = set_ball_colour;
    }else{
      if(score > 100){
      lives = lives - 1;
      if(lives < 2){
        try{
        document.getElementsByClassName("pause")[0].setAttribute("disabled", true);
        allowPause = false;
        }catch(e){
          alert(e);
        }
      }
      document.getElementById('lifeBox').innerText = lives;
      document.getElementsByClassName("echo")[0].style.backgroundColor = "black";
      updateScore(-20);
      }else{
      updateScore(0);
      lives = lives - 1;
      document.getElementById('lifeBox').innerText = lives;
    }

    fails = fails + 1;
    if(fails > 2){
      allowed = false;
      restartGame();
    }
    if(window.screen.width < 720){
      try{
        window.navigator.vibrate([200]);
      }catch(e){
        console.warn(e);
      }
    }else{
      fail.play();
    }
    }
    removeElement(id);
  }
}

function handlePause(event){
  if(allowPause){
  if(pauseClicked == false){
    pauseClicked = true;
    allowed = false;
    event.target.innerText = "Resume";
  }else{
    pauseClicked = false;
    allowed = true;
    createFallingBalls();
    event.target.innerText = "Pause";
  }
}
}

function removeCurrentEcho(){
  var echo = document.getElementsByClassName("echo")[0];
  tokenDiv.removeChild(echo);
  createNewEcho();
}

function createNewEcho(){
  var newEcho = document.createElement("div","div");
  newEcho.className = "echo";
  var tokenDiv = document.getElementById("tokenDiv");
  tokenDiv.appendChild(newEcho);
}

function restartGame(){
var previousScore = localStorage.getItem('currentScore');
if(previousScore == null){
  previousScore = 0;
}
if(score > previousScore){
  localStorage.setItem('currentScore', score);
  var username = localStorage.get('username');
  var entry = {
    username: username,
    score: score
  }
  localStorage.setItem('score_entry', JSON.stringify(entry));
}
showRestartModal(previousScore);
}

function showRestartModal(previousScore){
    if(score > previousScore){
      document.getElementsByClassName('hidden')[0].classList.toggle('score-panel');
      document.getElementById('old-score').innerText = previousScore;
      document.getElementById('new-score').innerText = score;
      window.navigator.vibrate([400,110,300]);
    }else{
      document.getElementsByClassName('hidden2')[0].classList.toggle('score-panel');
      document.getElementById('old-score_one').innerText = previousScore;
      document.getElementById('new-score_one').innerText = score;
      window.navigator.vibrate([600]);
    }
}

function updateScore(add){
  score = score + add;
  document.getElementById('scoreBox').innerText = score;
}

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
    createFallingBalls();
}

function resumeGame(){
  allowed = true;
  score = 0;
  fails = 0;
  lives = 3;
  document.getElementById('lifeBox').innerText = 3;
  document.getElementById('scoreBox').innerText = 0;
  document.getElementsByClassName('hidden')[0].classList.toggle('score-panel');
  createFallingBalls();
}

function resumeGameFromDeath(){
  allowed = true;
  score = 0;
  fails = 0;
  lives = 3;
  document.getElementById('scoreBox').innerText = 0;
  document.getElementById('lifeBox').innerText = 3;
  document.getElementsByClassName('hidden2')[0].classList.toggle('score-panel');
  createFallingBalls();
}

var i = 0;
function replay(){
  var play = replay_array[i++];
  if(play.event !== null & play.deg !== null){
    rotate(play.deg, play.event);
  }
}

function doReplay(){
  lives = 10;
  allowed = true;
  fails = -6;
  createFallingBalls();
  setInterval(()=>{replay()}, 50);
}
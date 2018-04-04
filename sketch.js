var scl = 20;



var rows = prompt("Size:", 50);
if(rows == null){
  rows = 10;
}
var cols = rows;

var game = [];

var bombs = Math.ceil(rows*cols*0.156);
var flags = 0;

var gameover = false;
var stoploop = false;

document.getElementById("bombs").innerHTML = bombs;

function setup() {
  var height = scl*cols;
  var width = scl*rows;
  createCanvas(width+1, height+1);
  background(51);
  createMap();
  pickLocations();
  addNumbers();
}

function draw() {
  if(stoploop == true){
    return;
  }
  background(51);
  drawRects();
  addNumbers();
  document.getElementById("flags").innerHTML = flags;
  checkWin();
}

function createMap() {
  for(var i = 0; i < rows; i++){
    game[i] = [];
    for(var j = 0; j < cols; j++){
      game[i][j] = {val: 0, shown: false};
    }
  }
}

function drawRects() {
  stroke(100);
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      if(game[i][j].shown === "flag"){
        fill(255,50,150);
        rect(i*scl,j*scl,scl,scl);
      }
      else if(game[i][j].shown != true){
        fill(255);
        rect(i*scl,j*scl,scl,scl);
      }
      if(game[i][j].shown == true && game[i][j].val == -1){
        fill(155, 0, 50);
        rect(i*scl,j*scl,scl,scl);
      }
    }
    line(i*scl,0,i*scl,cols*scl);
    line(0,i*scl,rows*scl,i*scl);
  }
  if(gameover == true){
    stoploop = true;
  }
}

function pickLocations() {
  for(var i = 0; i < bombs; i++){
    bomb = randomSquare();
    bomb.mult(scl);
  }
}

function randomSquare() {
  let bomb = createVector(floor(random(cols)), floor(random(rows)));
  var tries = 0;
  if(game[bomb.x][bomb.y].val == -1){
    tries += 1;
    if(tries >= cols*rows){
      alert("too many bombs!");
      return;
    }
    return randomSquare();    
  }
  game[bomb.x][bomb.y].val = -1;
  return bomb;
}

function addNumbers() {
  textSize(24)
  textAlign(CENTER, CENTER);
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      // Colour based on number
      if(game[i][j].val == 1){
        fill(150, 150, 255);
      }
      else if(game[i][j].val == 2){
        fill(150, 255, 150);
      }
      else if(game[i][j].val == 3){
        fill(255, 150, 150);
      }
      else{
        fill(255, 255, 255);
      }
      game[i][j].val = checkNeighbourTiles(i,j);
      if(game[i][j].shown == true){
        text(game[i][j].val,scl/2+i*scl,scl/2+j*scl);
      }
    }
  }
}

function checkNeighbourTiles(aX, aY) {
  if(game[aX][aY].val === -1){
    return -1;
  }
  var num = 0;

  var coords = [
  [(aX - 1), (aY - 1)],
  [(aX - 1), (aY)],
  [(aX - 1), (aY + 1)],
  [(aX), (aY - 1)],
  [(aX), (aY + 1)],
  [(aX + 1), (aY - 1)],
  [(aX + 1), (aY)],
  [(aX + 1), (aY + 1)]
  ];

  for (i = 0; i < coords.length; i++) {
    var x = coords[i][0];
    var y = coords[i][1];
    if(x != -1 && y != -1 && x != rows && y != cols){
      if(game[x][y].val === -1){
        num += 1;
      }
    }
  }
  return num;
}

var s = [];

function showNeighbourZeros(aX,aY) {
  var coords = [
  [(aX - 1), (aY - 1)],
  [(aX - 1), (aY)],
  [(aX - 1), (aY + 1)],
  [(aX), (aY - 1)],
  [(aX), (aY + 1)],
  [(aX + 1), (aY - 1)],
  [(aX + 1), (aY)],
  [(aX + 1), (aY + 1)]
  ]; 

  for (i = 0; i < coords.length; i++) {
    var x = coords[i][0];
    var y = coords[i][1];
    if(x != -1 && x != cols && y != -1 && y != rows){
      if(game[x][y].val != -1 && game[x][y].shown == false){
        show(x,y);
        if(game[x][y].val == 0)s.push({x,y});
      }
    }
  }
}

function mouseClicked() {
  if(mouseButton === LEFT){
    var x = Math.floor(mouseX/scl);
    var y = Math.floor(mouseY/scl)
    var val = game[x][y].val;
    switch(val){
      case -1:
      for(var i = 0; i < rows; i++){
        for(var j = 0; j < cols; j++){
          if(game[i][j].val == -1)show(i,j);
        }
      }
      gameover = true;
      break;
      case 0:
      show(x,y);
      showNeighbourZeros(x,y);
      for(var n = 0; n < s.length; n++){
        showNeighbourZeros(s[n].x,s[n].y);
      }
      s = [];
      break;
      default:
      show(x,y);
    }
  }
}

document.getElementById("body").addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    var x = Math.floor(mouseX/scl);
    var y = Math.floor(mouseY/scl);
    if(mouseX > cols*scl || mouseY > rows*scl){return;}
    if(game[x][y].shown == "flag"){
      game[x][y].shown = false;
      flags -= 1;
    }
    else{
      game[x][y].shown = "flag";
      flags += 1;
    }
    return false;
}, false);

function show(x,y) {
  game[x][y].shown = true;
}

function reset() {
  location.reload();
}

function checkWin() {
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      if(game[i][j].val == -1 && game[i][j].shown != "flag"){
        return;
      }
    }
  }
  if(gameover == true){
    return;
  }
  gameover = true;
  alert("Congrats!");
}

// Stops space from scrolling down
window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

var secs = 0;
var mins = 0;

window.setInterval(function(){
  if(stoploop == true){
    return;
  }
  secs += 1;
  if(secs >= 60){
    secs = 0;
    mins += 1;
  }
  document.getElementById("secs").innerHTML = ("0" + secs).slice(-2);;
  document.getElementById("mins").innerHTML = ("0" + mins).slice(-2);;
}, 1000)

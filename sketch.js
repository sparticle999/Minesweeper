var scl = 20;

var rows = 50;
var cols = 50;

var game = [];

var bombs = 1500;

function setup() {
  var height = scl*cols;
  var width = scl*rows;
  createCanvas(width, height);
  background(51);
  createMap();
  pickLocations();
  addNumbers();
}

function createMap() {
  for(var i = 0; i < rows; i++){
    game[i] = [];
    for(var j = 0; j < cols; j++){
      game[i][j] = 0;
    }
  }
}

function pickLocations() {
  fill(255, 0, 100);
  for(var i = 0; i < bombs; i++){
    bomb = randomSquare();
    bomb.mult(scl);
    rect(bomb.x, bomb.y, scl, scl);
  }
}

function randomSquare() {
  let bomb = createVector(floor(random(cols)), floor(random(rows)));
  var tries = 0;
  if(game[bomb.x][bomb.y] == -1){
    randomSquare();
    console.log("hi");
    tries += 1;
    if(tries >= cols*rows){
      alert("too many bombs!");
      return;
    }
  }
  game[bomb.x][bomb.y] = -1;
  return bomb;
}

function addNumbers() {
  fill(255);
  //textAlign(RIGHT, CENTER);
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      game[i][j] = checkNeighbourTiles(i,j);
      text(game[i][j],i*scl,scl+j*scl);
    }
  }
}

function checkNeighbourTiles(aX, aY) {
  if(game[aX][aY] === -1){
    return -1;
  }
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

  var num = 0;

  for (i = 0; i < coords.length; i++) {
    var x = coords[i][0]
    var y = coords[i][1]
    if(x != -1 && y != -1 && x != rows && y != cols){
      if(game[x][y] === -1){
        num += 1;
      }
    }
  }

  return num;
}

// function draw() {
//   background(51);

//   fill(255, 0, 100);
//   rect(bomb.x, bomb.y, scl, scl);
// }
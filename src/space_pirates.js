//Space Pirates Game

//environment variables
var map = document.getElementById("map");
var message = document.getElementById("message");

//event listeners
window.addEventListener("keydown", keydownHandler, false);

var space = 
[
  [0,2,0,0,0,3],
  [0,0,0,1,0,0],
  [0,1,0,0,0,0],
  [0,0,0,0,2,0],
  [0,2,0,1,0,0],
  [0,0,0,0,0,0]
];

var gameObjects = 
[
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [0,0,0,0,0,0],
  [4,0,0,0,0,0]
];

//map key
var SPACE = 0;
var PLANET = 1;
var PIRATE = 2;
var HOMEWORLD = 3;
var SHIP = 4;

//keyboard constants
var UP = 38;
var DOWN = 40;
var RIGHT = 39;
var LEFT = 37;

//other constants
var SIZE = 64;

//dependent constants
var ROWS = space.length;
var COLUMNS = space[0].length;
var shipColumn;
var shipRow;
for(var row = 0; row < ROWS; row++) {
    for(var column = 0; column <COLUMNS; column++) {
      if(gameObjects[row][column] == SHIP) {
        shipRow = row;
        shipColumn = column;
      }
    }
}
render();

function render() {
  //clear map
  if(map.hasChildNodes()) {
    for(var i=0; i<ROWS*COLUMNS; i++) {
      map.removeChild(map.firstChild);
    }
  }
  message.innerHTML="Here!";
  //Render new map by looping through map arrays
  for(var row = 0; row < ROWS; row++) {
    for(var column = 0; column <COLUMNS; column++) {
      //create an img tag called cell
      var cell = document.createElement("img");
      //set its CSS class to "cell"
      cell.setAttribute("class","cell");
      //Add the img tag to the map div
      map.appendChild(cell);
      //find the correct image for this cell
      switch(space[row][column]){
        case SPACE:
          cell.src = "../images/space_64x64px.png";
          break;
        case PLANET:
          cell.src = "../images/planet_64x64px.png";
          break;
        case PIRATE:
          cell.src = "../images/pirate_64x64px.png";
          break;
        case HOMEWORLD:
          cell.src = "../images/homeworld_64x64px.png";
          break;
      }
      //look in the moveable objects array for this cell
      switch(gameObjects[row][column]){
        case SHIP:
          cell.src = "../images/ship_64x64px.png";
          break;
      }
      //position cell
      cell.style.top = row*SIZE+"px";
      cell.style.left = column*SIZE+"px";
    }
  }
}

function keydownHandler(event) {
  switch(event.keyCode){
    case UP:
      //move ship up one row in gameObjects array
      if(shipRow>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow--;
      }
      break;
      
    case DOWN:
      //move ship down one row in gameObjects array
      if(shipRow<ROWS-1) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow++;
      }
      break;
      
    case LEFT:
      //move ship left one col in gameObjects array
      if(shipColumn>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipColumn--;
      }
      break;
    
    case RIGHT:
      //move ship right one col in gameObjects array
      if(shipColumn<COLUMNS-1) {
        gameObjects[shipRow][shipColumn] = 0;
        shipColumn++;
      }
      break;
  }
  
  gameObjects[shipRow][shipColumn] = SHIP;
  
  //render the game
  render();
}

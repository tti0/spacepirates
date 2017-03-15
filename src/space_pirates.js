//Space Pirates Game

//environment variables
var map = document.getElementById("map");
var message = document.getElementById("message");
var statXP = document.getElementById("statXP");
var statCredits = document.getElementById("statCredits");
var statBounty = document.getElementById("statBounty");
var statFuel = document.getElementById("statFuel");
var messageSay;

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

//game vars
var fuel = 10;
var credits = 10;
var xp = 0;
messageSay = "Use the arrow keys to travel around.<br>Return home and pay off the bounty on your head!"
var bounty = 50;

render();

function render() {
  //clear map
  if(map.hasChildNodes()) {
    for(var i=0; i<ROWS*COLUMNS; i++) {
      map.removeChild(map.firstChild);
    }
  }
  
  message.innerHTML=messageSay;
  statBounty.innerHTML=bounty;
  statXP.innerHTML=xp;
  statFuel.innerHTML=fuel;
  statCredits.innerHTML=credits;
  
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
  
  //check what cell the ship is in
  switch(space[shipRow][shipColumn]) {
    case SPACE:
      messageSay = "You cruise through cyberspace.";
      break;
      
    case PIRATE:
      fight();
      break;
      
    case PLANET:
      trade();
      break;
      
    case HOMEWORLD:
      endGame();
      break;
  }
  
  //burn fuel
  fuel--;
  
  //check if the player is out of fuel or credits
  if(fuel <= 0 || credits <= 0) {
    endGame;
  }
  
  //render the game
  render();
}

function plural(number) {
  if(number>1){return "s";}
  return "";
}

function fight() {
  var attack = Math.ceil((fuel + credits + xp) / 2);
  var defence = Math.ceil(Math.random() * attack * 2);
  var penalty = Math.round(defence / 2);
  
  messageSay = "Your attack: " + attack + "<br>Their defence: " + defence;
  
  if(attack>=defence) {
    credits += penalty;
    xp += 2;
    messageSay = "You fight and WIN " + penalty + " credit" + plural(penalty) + ".";
  } else {
    credits -= penalty;
    xp += 1;
    messageSay = "You fight and LOOSE " + penalty + " credit" + plural(penalty) + ".";
  }
}

function trade() {
  var planetFuel = xp + credits;
  var cost = Math.ceil(Math.random()*planetFuel);
  
  if(credits>cost) {
    fuel += planetFuel;
    credits -= cost;
    xp += 2;
    messageSay = "You buy " + planetFuel + " fuel cell" + plural(planetFuel) + " for " + cost + " credit" + plural(cost) + ".";
  } else {
    xp += 1;
    messageSay = "You don't have enough credits to buy fuel here.";
  }
}

function endGame() {
  
}

//Space Pirates Game

//environment variables
var map = document.getElementById("map");
var message = document.getElementById("messageInside");
var statXP = document.getElementById("statXP");
var statCredits = document.getElementById("statCredits");
var statBounty = document.getElementById("statBounty");
var statFuel = document.getElementById("statFuel");
var messageSay;
var messageMood = 0;

//audio setup variables
var audio_bell = new Audio ('../audio/bell.wav');
var audio_crash = new Audio ('../audio/crash.wav');
var audio_fight = new Audio ('../audio/fight.wav');
var audio_fillup = new Audio ('../audio/fillup.wav');
var audio_lose = new Audio ('../audio/lose.wav');
var audio_win = new Audio ('../audio/win.wav');
var audio_woosh = new Audio ('../audio/woosh.wav');

//event listeners
window.addEventListener("keydown", keydownHandler, false);

var space =
[
  [5,0,0,2,0,0,3],
  [0,0,0,1,0,0,0],
  [0,1,0,0,0,0,2],
  [0,0,0,0,2,0,0],
  [0,2,0,1,0,0,0],
  [2,0,0,0,0,0,1],
  [0,0,0,2,0,0,0]
];

var gameObjects =
[
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0],
  [4,0,0,0,0,0,0]
];

//map key
var SPACE = 0;
var PLANET = 1;
var PIRATE = 2;
var HOMEWORLD = 3;
var SHIP = 4;
var SHOP = 5;

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
messageSay = "Use the arrow keys to travel around.<br>Before you return home, you must go to the shop and pay off the bounty on your head.";
var messageMood = 0;
var bounty = 100;

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
        case SHOP:
          cell.src = "../images/shop_64x64px.png";
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

  //set bg color of message box
  switch(messageMood){
    case 0: //neutral
      document.getElementById("messageInside").style.backgroundColor = "#001c54";
      break;
    case 1: //notify
      document.getElementById("messageInside").style.backgroundColor = "#efefef";
      break;
    case 2: //positive
      document.getElementById("messageInside").style.backgroundColor = "#328727";
      break;
    case 3: //negative
      document.getElementById("messageInside").style.backgroundColor = "#840606";
      break;
  }
}

function keydownHandler(event) {
  switch(event.keyCode){
    case UP:
      //move ship up one row in gameObjects array
      if(shipRow>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow--;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;

    case DOWN:
      //move ship down one row in gameObjects array
      if(shipRow<ROWS-1) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow++;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;

    case LEFT:
      //move ship left one col in gameObjects array
      if(shipColumn>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipColumn--;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;

    case RIGHT:
      //move ship right one col in gameObjects array
      if(shipColumn<COLUMNS-1) {
        gameObjects[shipRow][shipColumn] = 0;
        shipColumn++;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;
  }

  gameObjects[shipRow][shipColumn] = SHIP;

  //check what cell the ship is in
  switch(space[shipRow][shipColumn]) {
    case SPACE:
      messageSay = "You cruise through cyberspace.";
      messageMood = 0;
      break;

    case PIRATE:
      fight();
      break;

    case PLANET:
      trade();
      break;

    case HOMEWORLD:
      endGame("HOME");
      break;

    case SHOP:
      payOff();
  }


  //check if the player is out of fuel or credits
  if(fuel <= 0 || credits <= 0) {
    endGame("FUEL");
  }

  //render the game
  render();
}

function plural(number) {
  if(number>1){return "s";}
  return "";
}

function fight() {
  var winProbability = 0.2;
  var attack = Math.ceil((fuel + credits + xp) / 2);
  var defence = Math.ceil(Math.random() * attack / (1 - winProbability));
  var penalty = Math.round(defence / 2);

  messageSay = "Your attack: " + attack + "<br>Their defence: " + defence;

  if(attack>=defence) {
    credits += penalty;
    xp += 50;
    messageSay = "You fight and WIN " + penalty + " credit" + plural(penalty) + ".";
  } else {
    credits -= penalty;
    xp += 20;
    messageSay = "You fight and LOOSE " + penalty + " credit" + plural(penalty) + ".";
  }
}

function trade() {
  var planetFuel = Math.ceil(Math.random()*(xp + credits));
  var cost = Math.ceil(Math.random()*planetFuel);

  var r = confirm("At this planet, fuel will cost you " + cost + " credit" + plural(cost) + ".\nYou will gain " + planetFuel + " cell" + plural(planetFuel) + ".\nDo you wish to continue?");

  if (r) {
    if(credits>cost) {
      fuel += planetFuel;
      credits -= cost;
      xp += 20;
      messageSay = "You buy " + planetFuel + " fuel cell" + plural(planetFuel) + " for " + cost + " credit" + plural(cost) + ".";
    } else {
      xp += 10;
      messageSay = "You don't have enough credits to buy fuel here.";
    }
  } else {
    return;
  }


}

function payOff() {
  if (bounty == 0) {
    messageSay = "You have already paid off your bounty!";
    messageMood = 2;
  } else {
    var toPay = prompt("How much of your bounty do you wish to pay off?\nYour bounty is currently " + bounty + " credit" + plural(credits) + ".\nYou currently have " + credits + " credit" + plural(credits) + ".")
  }
}

function endGame(condition) {
  switch(condition) {
    case "HOME":
      messageSay = "You made it home alive!";
      messageMood = 2;
      break;
    case "FUEL":
      messageSay = "You ran out of fuel.";
      messageMood = 3;
      break;
  }

  messageSay += '<br><br><button id="playAgain" onclick="playAgain()">Play again?</button>';

  //document.getElementById("playAgain").addEventListener("click",function(){message.innerHTML += ";P";}, false);

  //var playAgainButton = document.getElementById("playAgain");
  //playAgainButton.addEventListener("click",location.reload(),false);

  window.removeEventListener("keydown", keydownHandler, false);

  render();
}

function playAgain(){
  location.reload();
}

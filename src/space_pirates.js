//Space Pirates Game

var soundEnabled = true;
//if you do not want sound, uncomment the following line, and comment out the preceeding line.
//var soundEnabled = false;

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
var audio_shop_bell = new Audio ('../audio/shop_bell.wav');
var audio_fillup = new Audio ('../audio/fillup.wav');
var audio_game_lose = new Audio ('../audio/game_lose.wav');
var audio_game_win = new Audio ('../audio/game_win.wav');
var audio_woosh = new Audio ('../audio/woosh.wav');
var audio_fight_win = new Audio ("../audio/fight_win.wav");
var audio_fight_lose = new Audio ("../audio/fight_lose.wav");

function playSfx(clip) {
  if (soundEnabled == true) {
    thisSoundCommand = clip + ".play();";
    eval(thisSoundCommand);
  } else {
    //do nothing.
  }
}

//event listeners
window.addEventListener("keydown", keydownHandler, false);

var space =
[
  [5,0,0,2,0,0,3],
  [0,0,0,1,0,0,0],
  [0,1,0,0,0,0,2],
  [0,0,0,0,2,0,0],
  [0,2,0,1,0,0,0],
  [0,0,0,0,0,0,1],
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
      if (gameObjects[row][column] == SHIP) {
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
var bounty = 150;

render();

function checkForLoss() {
  //check if the player is out of fuel or credits
  if (fuel <= 0) {
    endGame("FUEL");
  } else if (credits <= 0) {
    endGame("CREDITS");
  }
}

function render() {
  //clear map
  if (map.hasChildNodes()) {
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
      if (shipRow>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow--;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;
    case DOWN:
      //move ship down one row in gameObjects array
      if (shipRow<ROWS-1) {
        gameObjects[shipRow][shipColumn] = 0;
        shipRow++;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;
    case LEFT:
      //move ship left one col in gameObjects array
      if (shipColumn>0) {
        gameObjects[shipRow][shipColumn] = 0;
        shipColumn--;
        //burn fuel
        fuel--;
        xp += 1;
      }
      break;
    case RIGHT:
      //move ship right one col in gameObjects array
      if (shipColumn<COLUMNS-1) {
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
      homeworld();
      break;
    case SHOP:
      payOff();
      break;
  }
  playSfx("audio_woosh");
  checkForLoss();
  //render the game
  render();
}

function plural(number) {
  if (number>1){return "s";}
  return "";
}

function fight() {
  var winProbability = 0.6;
  var attack = Math.ceil((fuel + credits + (2 * xp) / 2));
  var defence = Math.ceil(Math.random() * attack / (1 - winProbability));
  var penalty = Math.round((Math.round(defence / 2)) / 2);
  if (attack>=defence) {
    playSfx("audio_fight_win");
    credits += penalty;
    xp += 5 * (attack - defence);
    messageSay = "You fight and WIN " + penalty + " credit" + plural(penalty) + ".";
    messageMood = 2;
  } else {
    playSfx("audio_fight_win");
    credits -= penalty;
    xp += 2 * (0 - attack - defence);
    messageSay = "You fight and LOOSE " + penalty + " credit" + plural(penalty / 3) + ".";
    messageMood = 3;
  }
  console.log(penalty);
}

function trade() {
  var planetFuel = Math.ceil(Math.random()*(xp + credits));
  var cost = Math.ceil(Math.random()*planetFuel);
  var r = confirm("At this planet, fuel will cost you " + cost + " credit" + plural(cost) + ".\nYou will gain " + planetFuel + " cell" + plural(planetFuel) + ".\nDo you wish to continue?");
  if (r) {
    if (credits>cost) {
      fuel += planetFuel;
      credits -= cost;
      xp += 20;
      messageSay = "You buy " + planetFuel + " fuel cell" + plural(planetFuel) + " for " + cost + " credit" + plural(cost) + ".";
      playSfx("audio_fillup");
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
    var toPay = prompt("How much of your bounty do you wish to pay off?\nYour bounty is currently " + bounty + " credit" + plural(credits) + ".\nYou currently have " + credits + " credit" + plural(credits) + ".\n(You can only pay off whole numbers.)");
    if (typeof toPay == 'stringValue' || typeof toPay == 'objectValue') {
      messageSay = 'You did not enter a whole number. Please come back again later.';
      messageMood = 0;
    } else if (toPay % 1 != 0) {
      messageSay = 'You did not enter a whole number. Please come back again later.';
      messageMood = 0;
    } else if (toPay > credits) {
      messageSay = 'You do not have enough credits to pay off this amount. Please come back again later.';
      messageMood = 0;
    } else if (toPay > bounty) {
      messageSay = 'You are trying to pay off an amount larger than your bounty. Please come back again later.';
      messageMood = 0;
    } else {
      bounty -= toPay;
      credits -= toPay;
      messageMood = 2;
      messageSay = "You have paid " + toPay + " credits off your bounty. Your bounty is now " + bounty + " credits.";
      playSfx("audio_shop_bell");
      render();
    }
  }
  render();
}

function homeworld() {
  if (bounty != 0) {
    endGame("NOPAY");
  } else {
    endGame("HOME");
  }
}

function endGame(condition) {
  switch(condition) {
    case "HOME":
      messageSay = "You made it home alive!";
      messageMood = 2;
      playSfx("audio_game_win");
      break;
    case "FUEL":
      messageSay = "You ran out of fuel and crashed.";
      messageMood = 3;
      playSfx("audio_game_lose");
      break;
    case "CREDITS":
      messageSay = "You ran out of credits and were caught by the Space Police.";
      messageMood = 3;
      playSfx("audio_game_lose");
      break;
    case "NOPAY":
      messageSay = "You came home before you paid off your bounty. You were caught by the Space Police.";
      messageMood = 3;
      playSfx("audio_game_lose");
      break;
  }
  messageSay += '<br><br><button id="playAgain" onclick="playAgain()">Play again?</button>';
  window.removeEventListener("keydown", keydownHandler, false);
  render();
}

function playAgain(){
  location.reload();
}

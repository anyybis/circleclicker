/* ---------------------------------------------------- */
/* Horribly messy circle-clicker "game"                 */
/* Cobbled together by A. Nyberg sometime late 2017     */
/* Feel free to copy, modify, share, poultryize, etc.   */
/* ---------------------------------------------------- */

/* ------------------ */
/* Member declaration */
/* ------------------ */

// Circle properties
const Circles = {
  amt: 16,
  colVals: [
    "#E74C3C",
    "#5DADE2",
    "#52BE80",
    "#A569BD",
    "#E67E22"
  ],
  colNames: [
    "red",
    "blue",
    "green",
    "purple",
    "orange"
  ],
};

// Functions to retrieve various game components
// Probably terrible practice
const Game = {
  area: function() {return document.getElementById("game-area")},
  circle: function() {return document.getElementsByClassName("game-circle")},
  infotext: function() {return document.getElementsByClassName("game-infotext")},
  score: function() {return document.getElementById("game-score")},
  timer: function() {return document.getElementById("game-timer")},
  objective: function() {return document.getElementById("game-objective")},
  startButton: function() {return document.getElementById("startButton")}
};

// Circle object constructor
function Circle(val1, val2, colVal) {
  this.val1 = val1;
  this.val2 = val2;
  this.colVal = colVal;
  this.colName = Circles.colNames[Circles.colVals.indexOf(colVal)];
}

// Various other stuff and things
// Initialise array to store circle objects
let circlesList = new Array(Circles.amt);
// Variable to store the target circle
let targetCircle;
// Super secret mystery variable
let score = 0;
// Variable to store time left
// Declared here so it can be used in score calculation as well
let time;

// Dummy timer so the program doesn't halt on first launch
let timer;

/* -------------- */
/* Core functions */
/* -------------- */

// Enable start button
function init() {
  Game.startButton().disabled = false;
}

// Reset circle array and game area
function clearBoard() {
  Game.area().innerHTML = "";
  circlesList.length = 0;
  circlesList.length = Circles.amt;
}

// Reset infotext (but do so terribly)
// (Timer, score, and objective)
function resetInfotext() {
  for (let q = 0; q < Game.infotext().length; q++) {
    Game.infotext()[q].style.opacity = "0";
  }
  setTimeout(function () {
    Game.score().style.textAlign = "left";
    Game.score().style.width = "45%";
    Game.timer().style.paddingRight = "0";
    Game.score().innerHTML = "<span>Score: -</span>";
    Game.timer().style.textAlign = "right";
    Game.timer().style.width = "45%";
    Game.timer().style.paddingLeft = "0";
    Game.timer().innerHTML = "<span></span>";
    Game.objective().innerHTML = "<span>Find the - circle - * -</span>";
  }, 600);
}

// (Re)start the game
function restartGame() {
  clearBoard();
  for (let z = 0; z < circlesList.length; z++) {
    circlesList[z] = new Circle(randInt(2, 9), randInt(2, 9), Circles.colVals[randInt(0, Circles.colVals.length - 1)]);
  }
  Game.area().innerHTML = circlesList.map(
    x => "<div class='game-circle' style='background-color:"
    + x.colVal
    + ";opacity:0;' onclick='checkMatch(\"" + x.val1 * x.val2 + "\", \"" + x.colVal  + "\");'>"
    + x.val1 * x.val2
    + "</div>").join("")
  ;
  revealCircles();
  setTimeout(function () {
    targetCircle = circlesList[randInt(0, circlesList.length - 1)];
    revealInfotext();
    gameTimer();
  }, 60 * circlesList.length);
}

// Check if the correct circle was clicked
function checkMatch(val, colVal) {
  if (val == targetCircle.val1 * targetCircle.val2 && colVal == targetCircle.colVal) {
    clearInterval(timer);
    for (let p = 0; p < Game.infotext().length; p++) {
      Game.infotext()[p].style.opacity = "0";
    }
    let u = 0;
    y = setInterval(function() {
      Game.circle()[u].style.opacity = "0";
      u++;
      if (u == circlesList.length) {
        clearInterval(y);
        setTimeout(function() {
          score += Math.round(10 * parseFloat(time));
          restartGame();
        }, 600);
      }
    }, 60);
  }
  else {
    clearInterval(timer);
    gameOver();
  }
}

// Simple game timer
function gameTimer() {
  time = 9.9;
  Game.timer().innerHTML = roundTo(time, 1);
  timer = setInterval(function() {
    time -= 0.1;
    Game.timer().innerHTML = roundTo(time, 1);
    if (parseFloat(roundTo(time, 1)) <= 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 100);
}

// Handles game over
// Pure spaghetti at this point
// Not quite sure what to do with it
function gameOver() {
  for (let c = 0; c < circlesList.length; c++) {
    Game.circle()[c].style.opacity = "0";
  }
  for (let v = 0; v < Game.infotext().length; v++) {
    Game.infotext()[v].style.opacity = "0";
  }
  setTimeout(function() {
    clearBoard();
    Game.area().style.width = "128px";
    Game.area().style.height = "64px";
    Game.score().style.width = "44%";
    Game.score().style.textAlign = "right";
    Game.score().style.paddingRight = "1%";
    Game.timer().style.width = "44%";
    Game.timer().style.textAlign = "left";
    Game.timer().style.paddingLeft = "1%";
    setTimeout(function() {
      Game.score().style.opacity = "1";
      Game.score().innerHTML = "<span>Game</span>";
      setTimeout(function() {
        Game.timer().style.opacity = "1";
        Game.timer().innerHTML = "<span style='color:#E74C3C'>Over</span>";
        setTimeout(function() {
          Game.objective().style.opacity = "1";
          Game.objective().innerHTML = "<span>Final score: <span style='color:#52BE80'>" + score + "</span></span>";
          Game.area().innerHTML = "<button id='startButton' onClick='boardSetup();'>Retry</button>";
          Game.startButton().style.opacity = "0";
          score = 0;
          setTimeout(function() {
            Game.startButton().style.opacity = "1";
            Game.startButton().disabled = false;
          }, 600);
        }, 600);
      }, 600);
    }, 600);
  }, 600);
}

// Reveal infotext
function revealInfotext() {
  Game.score().innerHTML = "<span>Score: <span style='color:#52BE80'>" + score + "</span></span>";
  Game.objective().innerHTML = "<span>Find the <span style='color:"
    + Circles.colVals[randInt(0, Circles.colVals.length - 1)] + ";'>"
    + targetCircle.colName + " </span> circle "
    + targetCircle.val1 + " * "
    + targetCircle.val2 + "</span>"
  ;
  for (let b = 0; b < Game.infotext().length; b++) {
    Game.infotext()[b].style.opacity = "1";
  }
}

// Set-up the board with a fancy animation
function boardSetup() {
  resetInfotext();
  Game.startButton().style.opacity = "0";
  Game.startButton().style.color = "#424242";
  Game.startButton().disabled = true;
  Game.area().style.height = "320px";
  Game.area().style.width = "320px";
  setTimeout(function() {
    restartGame();
  }, 600);
}

// Fade in the circles in succession
function revealCircles() {
  let n = 0;
  let g = 0;
  m = setInterval(function() {
    Game.circle()[n].style.opacity = "1";
    n++;
    if (n == circlesList.length) {
      clearInterval(m);
    }
  }, 60);
}

/* ---------------- */
/* Helper functions */
/* ---------------- */

// Generate "random" int in range
function randInt(min, max) {
  return Math.floor((Math.random() * (max - min + 1)) + min);
}

// Round to n places
// Slighty modified from: https://stackoverflow.com/a/15762794
function roundTo(n, digits) {
  var negative = false;
  if (digits === undefined) {
    digits = 0;
  }
  if (n < 0) {
    negative = true;
    n *= -1;
  }
  var mult = Math.pow(10, digits);
  n = parseFloat((n * mult).toFixed(11));
  n = (Math.round(n) / mult).toFixed(digits);
  if (negative) {
    n = (n * -1).toFixed(digits);
  }
  return n;
}

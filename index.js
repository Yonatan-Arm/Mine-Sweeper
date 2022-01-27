"use strict";

var lives = ['❤','❤','❤']
const Boomb = "🔥";
var gboard;
var count = 0;
const FLAG = "🚩";
const HAPPY = "🙂";
const SAD = "🤕";
var HINTS=['💡','💡','💡']
var countFlag = 0;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var isGameOn;
var gStartTime;
var gWatchInterval;
var emoji = document.querySelector(".emoji");
var hint = document.querySelector('.hints');
var live = document.querySelector("h2");

function level(level) {
  if (level.innerText === "easy") {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  } else if (level.innerText === "hard") {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  } else if(level.innerText === "expert") {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  restart()
}

function initGame() {
  emoji.innerText = HAPPY;
  hint.innerText = HINTS
  isGameOn= 'ON'
  gboard = buildBoard(gLevel.SIZE);
  printMat(gboard, ".board-container");
  live.innerText= 'lives :'+ lives ;
}

function cellClicked(elCell, cellI, cellJ) {
  if (isGameOn === false) return;
  if (isGameOn === 'ON') {
    isGameOn = true;
    startStopWatch();
    createBoomb(gLevel.MINES);
  }
  var currCell = gboard[cellI][cellJ];
  if (currCell.isShown === true) return;
  if (currCell.isMine === false) {
    count++;
    var counter = document.querySelector(".counter");
    counter.innerText = "count:" + count;
    elCell.style.backgroundColor = "grey";
    elCell.innerText = "";
    currCell.isShown = true;
    expandShown(gboard, cellI, cellJ);
    emoji.innerText = HAPPY;
    checkGameOver();
  } else {
    // Update the Model:
    currCell.isShown = true;
    // Update the Dom:
    elCell.innerText = Boomb;
    emoji.innerText = SAD;
    lives.pop()
    checkGameOver();
    live.innerText = "lives:" + lives;
  }
}

function createBoomb(quntity) {
  var cells = checkFreeCells(gboard);
  var posBoombs = [];
  while (quntity > 0) {
    var rendomIdx = getRandomIntInt(0, cells.length);
    var boombIdx = cells[rendomIdx];
    if (posBoombs.includes(boombIdx)) {
      continue;
    } else {
      gboard[boombIdx.i][boombIdx.j].isMine = true;
      posBoombs.push(boombIdx);
      quntity--
    }
  }
}

function expandShown(mat, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      var currCell = mat[i][j];
      if (currCell.isMine === false && currCell.isShown === false) {
        currCell.isShown = true;
        currCell.minesAroundCount = countBoombsAround(mat, i, j);
        renderCell({ i: i, j: j }, currCell.minesAroundCount);
        currCell.innerText = currCell.minesAroundCount;
      }
    }
  }
  return count;
}

function checkGameOver() {
  var popModal = document.querySelector(".modal");
  var closedCell= checkFreeCells(gboard)
  if (lives.length === 0) {
    popModal.style.display = "inline-block";
    popModal.innerText = "try better next time loser";
    endStopWatch();
    isGameOn = false;
  } else if (countFlag === gLevel.MINES || closedCell.length=== 0) {
    popModal.style.display = "inline-block";
    popModal.innerText = "you are the winner";
    endStopWatch();
    isGameOn = false;
  }
}

function rightButton(cell, i, j) {
  if (gboard[i][j].isShown === true) return;
  if (gboard[i][j].isMine === true) {
    var counterFlag = document.querySelector(".counter-flag");
    countFlag++;
    counterFlag.innerText = "counter flags: " + countFlag;
    checkGameOver();
  }
  cell.innerText = FLAG;
}

function restart() {
  lives = ['❤','❤','❤'];
  count = 0;
  countFlag = 0;
  isGameOn = 'ON';
  HINTS=['💡','💡','💡']
  endStopWatch();
  var live = document.querySelector("h2");
  live.innerText = "lives:" + lives;
  var counter = document.querySelector(".counter");
  counter.innerText = "count:" + count;
  var counterFlag = document.querySelector(".counter-flag");
  counterFlag.innerText = "counter flags: " + countFlag;
  var popModal = document.querySelector(".modal");
  popModal.style.display = "none";
  var elTime = document.querySelector(".timer");
  elTime.innerText = "timer: ";
  initGame()
}
 
function startStopWatch() {
  gWatchInterval = setInterval(updateWatch, 1);
  gStartTime = Date.now();
}

function updateWatch() {
  var now = Date.now();
  var time = ((now - gStartTime) / 1000).toFixed(3);
  var elTime = document.querySelector(".timer");
  elTime.innerText = time;
}

function endStopWatch() {
  clearInterval(gWatchInterval);
  updateWatch();
}

function openHints(){
  var freeCells= checkFreeCells(gboard)
  var rendomIdx = getRandomIntInt(0, freeCells.length);
  var hintIdx = freeCells[rendomIdx];
  var currcell=gboard[hintIdx.i][hintIdx.j]
HINTS.pop()
hint.innerText= HINTS
}

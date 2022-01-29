"use strict";

var lives = ["❤", "❤", "❤"];
const Boomb = "🔥";
var gboard;
var count = 0;
const FLAG = "🚩";
const HAPPY = "🙂";
const SAD = "🤕";
var HINTS = ["💡", "💡", "💡"];
var countFlag = 0;
var gLevel = {
  SIZE: 4,
  MINES: 2,
  level: "",
};
var gplayer = {
  name: "player",
  level: "",
  count: "",
  flag: "",
  time: "",
};

var isGameOn;
var gStartTime;
var gWatchInterval;

var emoji = document.querySelector(".emoji");
var hint = document.querySelector(".hints");
var live = document.querySelector("h2");

function levelGame(level) {
  if (level.innerText === "easy") {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    gLevel.level = "easy";
  } else if (level.innerText === "hard") {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
    gLevel.level = "hard";
  } else if (level.innerText === "expert") {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
    gLevel.level = "expert";
  }
  restart();
}

function initGame() {
  emoji.innerText = HAPPY;
  hint.innerText = HINTS;
  isGameOn = "ON";
  gboard = buildBoard(gLevel.SIZE);
  printMat(gboard, ".board-container");
  live.innerText = "lives :" + lives;
}

function cellClicked(elCell, cellI, cellJ) {
  if (isGameOn === false) return;
  if (isGameOn === "ON") {
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
    elCell.style.backgroundColor = "#EDEDED";
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
    lives.pop();
    checkGameOver();
    live.innerText = "lives:" + lives;
  }
}

function createBoomb(quntity) {
  var cells = checkFreeCells(gboard);
  var posBoombs = [];
  while (quntity > 0) {
    var rendomIdx = getRandomIntInt(0, cells.length - 1);
    var boombIdx = cells[rendomIdx];
    if (posBoombs.includes(boombIdx)) {
      continue;
    } else {
      gboard[boombIdx.i][boombIdx.j].isMine = true;
      posBoombs.push(boombIdx);
      quntity--;
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
        var elCurrcell = document.querySelector(`.cell-${i}-${j}`);
        elCurrcell.style.backgroundColor = "#EDEDED";
        currCell.minesAroundCount = countBoombsAround(mat, i, j);
        if (currCell.minesAroundCount === 0) {
          expandShown(mat, i, j);
        }
        renderCell({ i: i, j: j }, currCell.minesAroundCount);
        currCell.innerText = currCell.minesAroundCount;
      }
    }
  }
  return count;
}

function checkGameOver() {
  var popModal = document.querySelector(".modal");
  var closedCell = checkFreeCells(gboard);
  if (lives.length === 0) {
    popModal.style.display = "inline-block";
    popModal.innerText = "try better next time loser";
    endStopWatch();
    isGameOn = false;
  } else if (countFlag === gLevel.MINES || closedCell.length === 0) {
    var winnerName = prompt("what is your name");
    updatelocal(winnerName, gLevel.level, count, countFlag);
    var result = localStorage.getItem(gplayer);
    var newarr = JSON.parse(result);
    var winModal = document.querySelector(".modal-winner");
    winModal.innerText =
      "player name : " +
      newarr.name +
      "\n" +
      "count:" +
      newarr.count +
      "\n" +
      "level:" +
      newarr.level;
    winModal.style.display = "block";
    popModal.style.display = "inline-block";
    popModal.innerText = "you are the winner";
    endStopWatch();
    isGameOn = false;
  }
}


function rightButton(cell, i, j) {
  if (isGameOn === false) return;
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
  lives = ["❤", "❤", "❤"];
  count = 0;
  countFlag = 0;
  isGameOn = "ON";
  HINTS = ["💡", "💡", "💡"];
  endStopWatch();
  var live = document.querySelector("h2");
  live.innerText = "lives:" + lives;
  var counter = document.querySelector(".counter");
  counter.innerText = "count:" + count;
  var counterFlag = document.querySelector(".counter-flag");
  counterFlag.innerText = "counter flags: " + countFlag;
  var popModal = document.querySelector(".modal");
  popModal.style.display = "none";
  var winModal = document.querySelector(".modal-winner");
  winModal.style.display = "none";
  var elTime = document.querySelector(".timer");
  elTime.innerText = "timer: ";
  initGame();
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

function openHints() {
  if (HINTS.length > 0) {
    var freeCells = checkFreeCells(gboard);
    var rendomIdx = getRandomIntInt(0, freeCells.length);
    var hintIdx = freeCells[rendomIdx];
    var currcell = document.querySelector(`.cell-${hintIdx.i}-${hintIdx.j}`);
    currcell.style.backgroundColor = "#06FF00";
    setTimeout(function () {
      currcell.style.backgroundColor = "#92A9BD";
    }, 2500);
    HINTS.pop();
    hint.innerText = HINTS;
  } else {
    return;
  }
}

function updatelocal(name, level, count, flag, time) {
  var gplayer = {
    name: name,
    level: level,
    count: count,
    flag: flag,
  };
  localStorage.setItem(gplayer, JSON.stringify(gplayer));
}

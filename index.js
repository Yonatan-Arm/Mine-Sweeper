"use strict";

var lives = 3;
const Boomb = "🔥";
var gboard;
var count = 0;
const FLAG = "🚩";
var countFlag = 0;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

function level(level) {
  if (level.innerText === "easy") {
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
  } else if (level.innerText === "hard") {
    gLevel.SIZE = 8;
    gLevel.MINES = 12;
  } else {
    gLevel.SIZE = 12;
    gLevel.MINES = 30;
  }
  restart();
}

function initGame() {
  lives = 3;
  count = 0;
  gboard = buildBoard(gLevel.SIZE);
  createBoomb(gboard, gLevel.MINES);
  printMat(gboard, ".board-container");
}

function createBoomb(gboard, quntity) {
  var cells = checkCells(gboard);
  while (quntity > 0) {
    var rendomIdx = getRandomIntInt(0, cells.length);
    var boombIdx = cells[rendomIdx];
    gboard[boombIdx.i][boombIdx.j].isMine = true;
    quntity--;
    console.log(boombIdx.i, boombIdx.j);
  }
}

function cellClicked(elCell, cellI, cellJ) {
  gboard[cellI][cellJ].isShown = true;
  // console.log('elCell', elCell)
  if (gboard[cellI][cellJ].isMine === true) {
    // Update the Model:
    gboard[cellI][cellJ] = Boomb;
    // Update the Dom:
    elCell.innerText = Boomb;
    lives--;

    checkGameOver();
    var live = document.querySelector("h2");
    live.innerText = "lives:" + lives;
  } else {
    elCell.innerText = gboard[cellI][cellJ].minesAroundCount;
    expandShown(gboard, cellI, cellJ);
    var counter = document.querySelector(".counter");
    count++;
    counter.innerText = "count:" + count;
  }
}

function expandShown(mat, rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue;
      if (i === rowIdx && j === colIdx) continue;
      var currCell = mat[i][j];
      if (currCell.isMine === false) {
        currCell.isShown = true;
        renderCell({ i: i, j: j }, currCell.minesAroundCount);
        currCell.innerText = currCell.minesAroundCount;
      }
    }
  }
  return count;
}

function checkGameOver() {
  var popModal = document.querySelector(".modal");
  if (lives === 0) {
    popModal.style.display = "inline";
    popModal.innerText = "try better next time loser";
  } else if (countFlag === gLevel.MINES) {
    popModal.style.display = "inline";
    popModal.innerText = "you are the winner";
  }
}

function rightButton(cell, i, j) {
  if (gboard[i][j].isMine === true) {
    var counterFlag = document.querySelector(".counter-flag");
    countFlag++;
    counterFlag.innerText = "counter flags: " + countFlag;
    checkGameOver();
  }
  cell.innerText = FLAG;
}

function restart() {
  lives = 3;
  count = 0;
  countFlag=0;
  var counter = document.querySelector(".counter");
  counter.innerText = "count:" + count;
  var counterFlag = document.querySelector(".counter-flag");
  counterFlag.innerText = "counter flags: " + countFlag;
  var popModal = document.querySelector(".modal");
  popModal.style.display = "none";
  initGame();
}

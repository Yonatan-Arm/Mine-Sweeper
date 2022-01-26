'use strict'

var lives = 3;
const Boomb='🔥'
var gboard;
var count=0;
const FLAG='🚩'
var gLevel = {
  SIZE: 4 ,
  MINES:2 ,
}

function level(level){
  if(level.innerText === 'easy'){
    gLevel.SIZE=4
    gLevel.MINES=2
  } else if(level.innerText === 'hard'){
    gLevel.SIZE=8
    gLevel.MINES=12
  }else{
    gLevel.SIZE=12
    gLevel.MINES=30
  }
  initGame()
}
 

function initGame() {
   gboard= buildBoard(gLevel.SIZE);
   createBoomb(gboard ,gLevel.MINES);
   printMat(gboard, ".board-container");
}


function createBoomb(gboard , quntity){
   var cells = checkCells(gboard)
   while(quntity>0){
   var rendomIdx = getRandomIntInt(0, cells.length)
var boombIdx = cells[rendomIdx]
gboard[boombIdx.i][boombIdx.j].isMine = true;
   console.log(boombIdx);
   quntity--
     }
}



function cellClicked(elCell, cellI, cellJ) {
  gboard[cellI][cellJ].isShown= true;
  // console.log('elCell', elCell)
  if (gboard[cellI][cellJ].isMine === true) {
      // Update the Model:
    gboard[cellI][cellJ] = Boomb
      // Update the Dom:
      elCell.innerText = Boomb
      lives--
      var live= document.querySelector('h2')
      live.innerText= 'lives:'+ lives 
  }else{
    elCell.innerText = gboard[cellI][cellJ].minesAroundCount
     expandShown(gboard, cellI, cellJ)
    var counter=document.querySelector('.counter')
    count++
    counter.innerText = 'count:' + count
  }
}

function expandShown(mat,rowIdx, colIdx){
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
      if (i < 0 || i > mat.length - 1) continue
      for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      if (currCell.isMine === false){
        currCell.isShown= true;
        renderCell({i: i, j: j}, currCell.minesAroundCount)
        currCell.innerText= currCell.minesAroundCount
        console.log(currCell);
      } 
      }
    }
    return count
    }
  
     function checkGameOver(){
       var popModal=document.querySelector('modal')
       if(lives===0){
         popModal.style.display="block"
         popModal.innerText ='try better next time loser'
       }
     }

  
     function rightButton(cell) {
       cell.innerText = FLAG
     }
 



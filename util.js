'use strict'

 function buildBoard(SIZE){
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = createCell(board) ;
        }
    }
    return board;
}

function createCell(){
	var gcell={
	minesAroundCount: 0,
 isShown: false,
 isMine: false,
 isMarked: false
	}
return gcell;
}


  function printMat(mat, selector) {
	var strHTML = '<table border="4px"><tbody>';
	for (var i = 0; i < mat.length; i++) {
	  strHTML += '<tr>';
	  for (var j = 0; j < mat[0].length; j++) {
		  var cell=mat[i][j];
		 cell.minesAroundCount= countBoombsAround(mat,i ,j)
		var className = 'cell cell-' + i + '-' + j;
		strHTML += `<td class='${className}' + oncontextmenu='rightButton(this,${i} , ${j})' onclick='cellClicked( this, ${i}, ${j})'></td> `
	  }
	  strHTML += '</tr>'
	}
	strHTML += '</tbody></table>';
	var elContainer = document.querySelector(selector);
	elContainer.innerHTML = strHTML;
  }
//   `<td data-${num} onclick="cellClicked(${num} , ${sizeArr})">${num}</td>`


 function countBoombsAround(mat, rowIdx, colIdx) {
	var count = 0
	for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
	  if (i < 0 || i > mat.length - 1) continue
	  for (var j = colIdx - 1; j <= colIdx + 1; j++) {
		if (j < 0 || j > mat[0].length - 1) continue
		if (i === rowIdx && j === colIdx) continue
		var currCell = mat[i][j]
		if (currCell.isMine === true) count++
	  }
	}
	return count
  }

  
  function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    elCell.innerHTML = value;
  }

   
function checkCells(gBoard){
	var arr=[]
	for(var i=0; i<gBoard.length; i++){
		for(var j=0; j<gBoard[i].length;j++){
				arr.push({i:i, j:j})
			
		}
	}
	return arr
}
 

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
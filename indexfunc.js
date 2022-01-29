function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function printMat(mat, selector) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = 'cell cell-' + i + '-' + j;
        strHTML += '<td class="' + className + '">' + cell + '</td>'
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }

  function renderCell(location, value) {

    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
    if(value===boom){
      elCell.style.transition= 'linear'
    }
    elCell.innerHTML = value;
  }

  function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  
function checkCells(gBoard){
	var arr=[]
	for(var i=0; i<gBoard.length; i++){
		for(var j=0; j<gBoard[i].length;j++){
			if(gBoard[i][j]===EMPTY ){
				arr.push({i:i, j:j})
			}
		}
	}
	return arr

}


function countFoodAround(mat, rowIdx, colIdx) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i > mat.length - 1) continue
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j > mat[0].length - 1) continue
      if (i === rowIdx && j === colIdx) continue
      var currCell = mat[i][j]
      if (currCell === '$') count++
    }
  }
  return count
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
var tiles=[];
var isClicked = false;
var firstClickedTile;
var secondClickedTile;
var areTwoTilesClicked;
var textAboutWay = "";

$( document ).ready(function() {
    generateBoard();
    $("#generate-board").click( function(e) {
      e.preventDefault();
      resetComponents();
      generateBoard();
    });
});

function resetComponents(){
  tiles=[];
  isClicked=false;
  areTwoTilesClicked = false;
  setTextAboutWay("Szukamy drogi!");
}

function generateBoard() {
  generateRandomTilesTable(10);
  refreshView(10);
}

function generateRandomTilesTable( boardSize) {
  for(var i=0; i<boardSize; i++) {
    tiles.push([]);
    for(var j=0; j<boardSize; j++) {
      var pawn = Math.floor((Math.random()*2)); // 0 or 1
      tiles[i].push(pawn);
    }
  }
}

function refreshView(boardSize) {
  clearView();
  console.log("clear");
  for(var i=0; i<boardSize; i++) {
    var row = '<div class="row">';
    for(var j=0; j<boardSize; j++) {
      if(tiles[i][j] == 0) {
        row += addButton(i, j);
      }
      else if(tiles[i][j] == 1) {
        row += addButtonPawn(i, j);
      }
      else {
        row += addButtonClicked(i, j);
      }
    }
    row += '</div>';
    $("#game").append(row);
    console.log("append");
  }
}

function addButton(  i,  j) {
  var row = '<div class="button" id="tile'+i+'x'+j+'" ';
  row += addClickStr(i, j);
  return row;
}

function addButtonPawn( i,  j) {
  var row = '<div class="button pawn" id="tile'+i+'x'+j+'" ';
  row += addClickStr(i, j);
  return row;
}

function addButtonClicked( i,  j) {
  var row = '<div class="button clicked" id="tile'+i+'x'+j+'" ';
  row += addClickStr(i, j);
  return row;
}

function addClickStr( i,  j) {
  var str = addRightMouseClick(i, j);
  str += addLeftMouseClick(i, j);
  return str;
}

function addRightMouseClick(  i,  j) {
  var clickStr = 'contextmenu="" oncontextmenu="changePawn('+i+','+j+')" ';
  return clickStr;
}

function addLeftMouseClick(i, j) {
  var clickStr = 'onclick="clickTile('+i+','+j+')"></div>';
  return clickStr;
}

function clearView() {
  $(".button").remove();
}

function changePawn(i, j) {
  if(tiles[i][j]==1) {
    tiles[i][j]=0;
  }
  else if (tiles[i][j]==0) {
    tiles[i][j]=1;
  }
  refreshView(10);
  if(areTwoTilesClicked) {
    drawWay(firstClickedTile,secondClickedTile);
  }
}

function clickTile(x, y) {
  if( !hasPawn([x,y]) ) {
    if(isClicked) {
      secondClickedTile = [x,y];
      tiles[x][y] = 2;
      checkTile(secondClickedTile);
      drawWay(firstClickedTile,secondClickedTile);
      isClicked = false;
      areTwoTilesClicked = true;
    }
    else {
      setTextAboutWay("Szukamy drogi!");
      resetClickedTiles();
      areTwoTilesClicked = false;
      isClicked = true;
      firstClickedTile = [x,y];
      tiles[x][y] = 2;
      refreshView(10);
    }
  }
}

function checkTile([x,y]) {
  $('#tile'+x+'x'+y).toggleClass('clicked');
}

function resetClickedTiles() {
  for(var i=0; i<tiles.length; i++) {
    for(var j=0; j<tiles[1].length; j++) {
      if(tiles[i][j]==2) {
        tiles[i][j]=0;
      }
    }
  }
}

function drawWay([x1,y1],[x2,y2]) {
  var way = findWay([[x1,y1]],[x2,y2]);
  if(way) {
	  for(var i=0; i<way.length; i++) {
		  $('#tile'+way[i][0]+'x'+way[i][1]).addClass('way');
	  }
    setTextAboutWay("Oto Twoja droga!");
  }
  else {
    setTextAboutWay("Brak drogi.");
  }
}

function setTextAboutWay(str) {
  $("#textAboutWay").empty();
  $("#textAboutWay").append(str);
}

function findWay(way,destinityTile) {
	var lastIndex = way.length-1;
	if(areEqual(way[lastIndex],destinityTile)) {
		way.push(destinityTile);
		return way;
	}
	else {
		var neighborhoods = checkNeighborhood(way[lastIndex]);
		for( var i = 0; i<neighborhoods.length; i++) {
			if(!isWayContainTile(way,neighborhoods[i])) {
				var newWay = way.slice();
				newWay.push(neighborhoods[i]);
				var foundWay = findWay(newWay,destinityTile);
				if(foundWay) {
					return foundWay;
				}
			}
		}
	}
	return null;
}

function isWayContainTile(way, tile) {
	for(var i=0; i<way.length; i++) {
		if(areEqual(way[i],tile)) {
			return true;
		}
	}
	return false;
}

function checkNeighborhood([x,y]) {
  var neighborhood=[];
  if(isInBoard([x-1,y])) {
	if(!hasPawn([x-1,y])) {
		neighborhood.push([x-1,y]);
	}
  }
  if(isInBoard([x+1,y])) {
	if(!hasPawn([x+1,y])) {
		neighborhood.push([x+1,y]);
	}
  }
  if(isInBoard([x,y-1])) {
	if(!hasPawn([x,y-1])) {
		neighborhood.push([x,y-1]);
	}
  }
  if(isInBoard([x,y+1])) {
	if(!hasPawn([x,y+1])) {
		neighborhood.push([x,y+1]);
	}
  }
  return neighborhood;
}

function isInBoard(tab) {
  if(tab[0]<10 && tab[0] >=0) {
    if( tab[1]<10 && tab[1]>=0) {
      return true;
    }
  }
  return false;
}

function hasPawn(tab) {
  if($('#tile'+tab[0]+'x'+tab[1]).hasClass("pawn")){
    return true;
  }
  return false;
}

function areEqual(tab1, tab2) {
	var i =0;
	if(tab1.length!=tab2.length) {
		return false;
	}
	else {
		for(i=0; i<tab1.length; i++) {
			if(tab1[i]!=tab2[i]) {
				return false;
			}
		}
	}
	return true;
}

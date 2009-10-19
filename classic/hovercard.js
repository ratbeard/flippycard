var selectedRow = 0;
var selectedCol = 0;
var curRow = 0;
var curCol = 0;

var NUM_HOVER_ROWS = 4;
var NUM_HOVER_COLS = 7;

var DEFAULT_CARD_HEIGHT = 40;
var DEFAULT_CARD_WIDTH = 30;

var num_pairs = -1; // Number of pairs selected
var bonus = -1; // Is there a bonus card, i.e. odd number

function HoverCard(el) {
	coords = el.id.split("_");
	curRow = parseInt(coords[0]);
	curCol = parseInt(coords[1]);
	ClearBorders();
	SetBorders();
}

function SetBorders() {
	TopBorder()
	LeftBorder()
	RightBorder()
	BottomBorder()
}

function TopBorder() {HorizontalBorder(0,curCol,"Top")}
function BottomBorder() {HorizontalBorder(curRow, curCol, "Bottom")}
function LeftBorder() {VerticalBorder(curRow,0,"Left"); }
function RightBorder() {VerticalBorder(curRow, curCol, "Right");}

function VerticalBorder(row,col,borderSide) {
	for(var i=0; i<=row; i++) {
		card = document.getElementById(i+"_"+col);
		card.style["border"+borderSide] = "solid 2px black"
		card.style.width = parseInt(window.getComputedStyle(card, null).width) - 2 + 'px';
	}
}

function HorizontalBorder(row,col,borderSide) {
	for(var j=0; j<=col; j++) {
		card = document.getElementById(row+"_"+j);
		card.style["border"+borderSide] = "solid 2px black"
		card.style.height = parseInt(window.getComputedStyle(card, null).height) - 2 + 'px';
	}
}

function ClearBorders() {
	for(var i=0; i<NUM_HOVER_ROWS; i++) {
		for(var j=0; j<NUM_HOVER_COLS; j++) {
			card = document.getElementById(i+"_"+j);
			card.style.border = '';
			card.style.height = DEFAULT_CARD_HEIGHT;
			card.style.width = DEFAULT_CARD_WIDTH;
		}
	}
}

function SelectCard(el) {
	for(var i=0; i<NUM_HOVER_ROWS; i++) {
		for(var j=0; j<NUM_HOVER_COLS; j++) {
			card = document.getElementById(i+"_"+j);
			if(i<=curRow && j<=curCol) 
				card.className = "hovercard_selected"
			else
				card.className = "hovercard"
		}
	}
	selectedRow = curRow;
	selectedCol = curCol;
	
	
	num_pairs = (selectedRow+1)*(selectedCol+1)/2;
	bonus = 0;
	if(parseInt(num_pairs) != num_pairs) { // An odd number of cards
		bonus = 1;
		num_pairs = parseInt(num_pairs);
	}
	
	// Update Text on screen:
	var pair_text = num_pairs + " pairs"
	if(bonus)
		pair_text = num_pairs + " pairs + 1 bonus!"
	document.getElementById("num_pairs").firstChild.innerHTML = pair_text;
}

function LoseHover(el) {
	1
}

function StartGame() {
	if(num_pairs<=0) {
		alert("You must enter in at least 1 pair");
		return;
	}
	
	game_area = document.getElementById("game_area");
	clearChildren(game_area);
	var count = 0;
	for(var i=0; i<=selectedRow; i++) {
		for(var j=0; j<=selectedCol; j++) {
			var card_el = document.createElement("div");
			card_el.className = "normal card";
			card_el.id = "c"+count;
			card_el.setAttribute("onclick", "FlipCard(this)");
			game_area.appendChild(card_el);
			count += 1;
		}
		var br_el = document.createElement("br");
		br_el.className = "row_br";
		game_area.appendChild(br_el);
	}
	document.getElementById("card_area").style.display = "none";
	document.getElementById("game_area_wrap").style.display = "";
	init();
}

function SetupGame() {
	document.getElementById("card_area").style.display = "";
	document.getElementById("game_area_wrap").style.display = "none";
}
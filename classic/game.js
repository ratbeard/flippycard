var num_cards;
var MAX_NUM_PICS = 14;

// Card State Variables.  'Up' is temporary flipped over:
var DOWN = 0;
var UP = 1;
var MATCHED = 2;
var SPECIAL = 69;

// Load the images into memory:
for (var i=1; i<= MAX_NUM_PICS; i++) {
	src = "resources/pics/"+ i +".jpg";
	new Image().src = src;
}
new Image().src = "resources/pics/special.jpg";

var cards;
var curUpId; 		// Id of card thats currently flipped up
var curUpPicNum; 	// The pic num of the current flipped up card
var msg; 			// Area to place a msg to user
var num_matches; 	// How many matches have been made
var num_tries; 		// How many guesses have been made
var turningDown = false;  // Are we in the process of turning cards down?   

function init() {
	// init state:
	num_cards = num_pairs * 2 + bonus;
	curUpId = -1; 
	curUpPicNum = -1;
	num_matches = 0;
	num_tries = 0;                   
	

	// Reset text:
	msg = document.getElementById("output");
	msg.innerHTML = "";
	document.getElementById("tries").innerHTML = "0";
	document.getElementById("output").innerHTML = "Lets Play Flippy Card!";
	
	// Mix up our order of images:
	cardPicNums = [];
	for(var i=1; i<=num_pairs; i++) { // Pic nums start at 1
		cardPicNums.push(i);
		cardPicNums.push(i);
	}

	// Add 'special' single card if odd number of cards:
	if(bonus)  
		cardPicNums.push(SPECIAL);
	
	// Mix up cards:
	cardPicNums.sort(function() {return (Math.round(Math.random())-0.5);});
	
	// Get all the card elements and load them into a collection:
	cards = [];
	for(var i=0; i<num_cards; i++) {
		cards[i] = document.getElementById("c"+i);
	}
	
	// Add info and methods to each card:
	for(var i=0; i<num_cards; i++) {
		var c = cards[i];
		
		// Set state variables:
		c.state = DOWN;
		c.picNum = "p"+cardPicNums.pop();
		
		// Method to turn a card up.  
		// Return the picNum that was turned up:
		c.flipUp = function() {
			if(this.state != DOWN)  
				return -1;   
				
			this.className = "card "+this.picNum;
			this.state = UP;
			
			if(this.picNum=="p69")
				this.state = MATCHED;
				
			return this.picNum;
		} 
		
		// Method to turn a card down:
		c.flipDown = function() {
			if(this.state!=UP)  
				return false;
				
			this.className = "card normal";
			this.state = DOWN;
			
			return true;
		}
	}
}




function FlipCard(el) {
	if(turningDown) {
		msg.innerHTML = "You should be studying the cards!";
		return;
	}
	if(el.state!=DOWN) {
		msg.innerHTML = "This card is already up!";
		return;
	}
	if(curUpId==-1) { // Flip up first card 
		el.flipUp();
		//alert(el.picNum)
		if(el.picNum=="p"+SPECIAL) {
			msg.innerHTML = "You got the Special card!  Woot!";
			return;
		}
		curUpId = el.id;
		msg.innerHTML = "";
	}
	else { // Flip up second card.  Check if match:
		el.flipUp();
		if(el.picNum=="p"+SPECIAL) {
			msg.innerHTML = "You got the Special card!  Try another card!";
			return;
		}
		
		// Update num tries:
		num_tries += 1;
		document.getElementById("tries").innerHTML = num_tries;
		var el2 = document.getElementById(curUpId);
		if(el2.picNum==el.picNum) { // Match!
			el.state = MATCHED;
			el2.state = MATCHED;
			msg.innerHTML = "You got a Match!";
			num_matches += 1;
			if(num_matches==num_pairs) { // They win!
				msg.innerHTML = "You Win!!!!";
			}
		}
		else { // No match.  Wait a sec and turn them down
			turningDown = true;
			msg.innerHTML = getSorryMsg();
			setTimeout(function() {
				//alert('ho')
				el.flipDown();
				el2.flipDown();
				turningDown = false;
				msg.innerHTML = "";
			}, 1000);
		}
		curUpId = -1;
	}
}

// Inform user they did not get a match:
function getSorryMsg() { 
	var i = Math.floor(Math.random()*sorryMsgs.length);
	return sorryMsgs[i];
}
var sorryMsgs = ["You didn't get a match", "Not this time", "Sorry bro, wrong card", "Remember these cards!", 
	"Try and match cards", "Those cards are pretty close!", ":("];

function clearChildren(parent){
    while(parent.childNodes.length > 0){
        parent.removeChild(parent.childNodes[0]);
    }
} 
 /*
  * FUNCTION DECLARATIONS                   *******************************************************************************
  */

 // Shuffle function from http://stackoverflow.com/a/2450976
 function shuffle(array) {
 	var currentIndex = array.length,
 	temporaryValue,
 	randomIndex;
 	while (currentIndex !== 0) {
 		randomIndex = Math.floor(Math.random() * currentIndex);
 		currentIndex -= 1;
 		temporaryValue = array[currentIndex];
 		array[currentIndex] = array[randomIndex];
 		array[randomIndex] = temporaryValue;
 	}

 	return array;
 }

 function openCard(card) {
 	card.classList.add("open", "show");
 }

 function pushCard(card) {
 	openCards.push(card);
 }

 function match(cards) {

 	if (openCards[0].childNodes[1].className === openCards[1].childNodes[1].className) {
 		// Cards match
 		setTimeout(lockOpenCards, delay);
 		numberOfMatches = numberOfMatches + 1;

 		if (numberOfMatches === 8) {
 			// Finish the game since all the cards have been matched
 			setTimeout(finishGame, delay+200);
 		}
 	} else { // Cards don't match
 		setTimeout(removeOpenCards, delay);
 		clickedItem = null;
 	}
 }

 function lockOpenCards() {
 	for (var i = 0; i < openCards.length; i++) {
 		openCards[i].classList.remove("open", "show");
 		openCards[i].classList.add("match");
 	}
 	openCards = [];
 }

 function removeOpenCards() {
 	for (var i = 0; i < openCards.length; i++) {
 		openCards[i].classList.remove("open", "show");
 	}
 	openCards = [];
 }

 function increaseCountMoves() {
 	countMoves = countMoves + 1;
 	movesElement.textContent = countMoves;
 }

 function dropOneStar() {
 	for (var i = 0; i < starsElement.children.length; i++) {
 		if (starsElement.children[i].style.visibility !== "hidden") {
 			starsElement.children[i].style.visibility = "hidden";
 			numberOfStars = numberOfStars - 1;
 			break;
 		}
 	}
 }
 
 function timer() {
	second++;
    document.querySelector(".timer").innerHTML = "Seconds: " + second;
}

 function initGame() {

 	// Select the page elements
	allCards = document.querySelectorAll(".card");
 	movesElement = document.querySelector(".moves");
 	starsElement = document.querySelector(".stars");
 	refreshButton = document.querySelector(".restart");
 	modalElement = document.querySelector(".modal");
 	modalValuesElement = document.querySelector(".modal-values");
 	playAgainButton = document.querySelector(".play-again");

 	// Shuffle and set up the deck from scratch
 	let deckCards = ["fa fa-diamond", "fa fa-diamond",
 		"fa fa-paper-plane-o", "fa fa-paper-plane-o",
 		"fa fa-anchor", "fa fa-anchor",
 		"fa fa-bolt", "fa fa-bolt",
 		"fa fa-cube", "fa fa-cube",
 		"fa fa-leaf", "fa fa-leaf",
 		"fa fa-bicycle", "fa fa-bicycle",
 		"fa fa-bomb", "fa fa-bomb",
 	];
 	shuffle(deckCards);
 	// console.log(deckCards);

 	for (var i = 0; i < allCards.length; i++) {
 		allCards[i].className = "card";
 		allCards[i].childNodes[1].className = deckCards[i];
 	}

 	// Initialize the elements
 	openCards = [];
 	delay = 1000;
 	clickedItem = null;
 	previousTarget = null;
 	countMoves = 0;
 	numberOfMatches = 0;
 	numberOfStars = 3;
	second = 0;
 	movesElement.textContent = countMoves;

 	// Reset the stars
 	for (var i = 0; i < starsElement.children.length; i++) {
 		starsElement.children[i].style.visibility = "visible";
 	}

 	// Reset the modal
 	modalElement.style.display = "none";

 	// Record the starting time
	clearInterval(timerInternal);
 	timerInternal = setInterval(timer, 1000);
 }

 function finishGame() {
	// Find user's performance values
 	modalValuesElement.textContent = "With " + countMoves + " Moves " +
 		"and " + numberOfStars + " Star(s) " +
 		"in " + second +
 		" seconds";

 	// Display the modal to the user
 	modalElement.style.display = "block";
	
	// Clear the timer
 	clearInterval(timerInternal);
 }

 /*
  * GLOBAL VARIABLES                   *******************************************************************************
  */
 let allCards;
 let movesElement;
 let starsElement;
 let refreshButton;
 let modalElement;
 let playAgainButton;
 let modalValuesElement;

 let openCards;
 let delay;
 let clickedItem;
 let previousTarget; // In case the same element is being clicked

 let countMoves;
 let numberOfMatches; // When 8 matches, finish the game
 let numberOfStars;
 let second; // For the timer
 let timerInternal; // For the timer

 // Start the game
 initGame();

 /*
  * EVENTS                   *******************************************************************************
  */

 // Click events for the clicks on card
 allCards.forEach(function (card) {
 	card.addEventListener("click", function (event) {

 		clickedItem = event.target;

 		// Don't do anything if a matched card is clicked on
 		// Or the same card is clicked on
 		if (clickedItem.classList.contains("match") ||
 			clickedItem.parentNode.classList.contains("match") ||
 			clickedItem === previousTarget ||
 			clickedItem.childNodes[1] === previousTarget ||
 			clickedItem.parentNode === previousTarget) {
 			return;
 		}

 		if (openCards.length < 1) {
 			pushCard(card);
 			openCard(card);
 			increaseCountMoves();
 		} else if (openCards.length === 1) {
 			pushCard(card);
 			openCard(card);
 			increaseCountMoves();
 			match(openCards); // See if the second card opened is a match

 			// Number of moves drops the star rate
 			if (countMoves === 20) {
 				dropOneStar();
 			} else if (countMoves === 30) {
 				dropOneStar();
 			}
 		} else {
 			// not likely but - if more than 3 cards are open, remove them
 			removeOpenCards();
 		}
 		previousTarget = clickedItem;
 	});
 });

 // Click event for the refresh button
 refreshButton.addEventListener("click", function (event) {
 	initGame();
 });

 // Click event for the play-again button
 playAgainButton.addEventListener("click", function (event) {
 	initGame();
 });
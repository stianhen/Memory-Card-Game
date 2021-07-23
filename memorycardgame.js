// TODO (?)
// Remove console logging

const imagesPath = "images/";

var activePlayer;
var player1Score = 0;
var player2Score = 0;
var noOfFlips = 0;
var noOfCards = 18;
var images = [];
var firstFlippedCard;
var secondFlippedCard;
var hasflippedCard = false;
var canClick = true;


// Timer
var timerSec = 0;
function pad(val) { return val > 9 ? val : "0" + val; }
var timer = setInterval(function () {
    $("#sec").html(pad(timerSec++ % 60));
    $("#min").html(pad(parseInt(timerSec / 60, 10)));
}, 1000);


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    console.log("\tThe images has been randomly sorted");
}

function generateRandomImageList(){
    images.push("apache.gif");
    images.push("borat.gif");
    images.push("bunny.gif");
    images.push("cage.gif");
    images.push("hoff.gif");
    images.push("rick.gif");
    images.push("sprockets.gif");
    images.push("stareoff.gif");
    images.push("travolta.gif");

    images.push("apache.gif");
    images.push("borat.gif");
    images.push("bunny.gif");
    images.push("cage.gif");
    images.push("hoff.gif");
    images.push("rick.gif");
    images.push("sprockets.gif");
    images.push("stareoff.gif");
    images.push("travolta.gif");

    console.log("\tAdded " + images.length + " images");
    shuffleArray(images);
}

function createCards(){
    console.log("\tCreating the cards...");
    for (var i = 0; i < noOfCards; i++){
        kort = $("<div></div>").addClass("card");
        frontFace = $("<img></img>").addClass("cardFrontFace");
        backFace = $("<img></img>").addClass("cardBackFace");
        backFace.attr("src", imagesPath + images[i]);
        kort.append(frontFace);
        kort.append(backFace);
        $("#cards").append(kort);
    }
    console.log("\tDone creating cards!");
    cards = document.querySelectorAll(".card");
    cards.forEach(card => card.addEventListener("click", flipTheCard));
}

function addPoint(){
    if(activePlayer == "p1"){
        player1Score++;
        $("#player1score").text(player1Score);
        console.log("\t\tA point has been given to Player 1, who has " + player1Score + " points");
    }
    else{
        player2Score++;
        $("#player2score").text(player2Score);
        console.log("\t\tA point has been given to Player 2, who has " + player2Score + " points");
    }
}

function switchActivePlayer(){
    if (activePlayer == "p1"){
        activePlayer = "p2";
        console.log("Player 2 is the active player");
        $("#player2").css("color", "dodgerblue");
        $("#player1").css("color", "white");
    }else{
        activePlayer = "p1";
        console.log("Player 1 is the active player");
        $("#player1").css("color", "dodgerblue");
        $("#player2").css("color", "white");
    }
}
function increaseFlips(){
    noOfFlips++;
    $("#noOfFlips").text(noOfFlips);
}

function compareCards(){
    console.log("\tComparing the cards...");

    // If cards are matching
    if(firstFlippedCard.lastChild.src == secondFlippedCard.lastChild.src){
        console.log("\t\tThe cards are matching");
        // Removes the on click event listeners to deactivate the cards from the game
        firstFlippedCard.removeEventListener("click", flipTheCard);
        secondFlippedCard.removeEventListener("click", flipTheCard);
        addPoint();
        // "Removes" the pair of cards by fading them out
        jQuery(firstFlippedCard).delay(600).fadeTo(400, 0);
        jQuery(secondFlippedCard).delay(600).fadeTo(400, 0);
        // Wait until the delay + fade out is done (1 sec)
        setTimeout(function () {
            firstFlippedCard = undefined;
            secondFlippedCard = undefined;
            canClick = true;
        }, 1000);
    }
    // If non-matching cards 
    else{
        console.log("\t\tThe cards are NOT matching")
        // Timeout to allow the cards to be shown for 1 sec before flipping back
        setTimeout(function () {
            firstFlippedCard.classList.toggle('flip');
            secondFlippedCard.classList.toggle('flip');
            firstFlippedCard = undefined;
            secondFlippedCard = undefined;
            canClick = true;
        }, 1000);
        switchActivePlayer();
    }
}

function checkForWinner(){
    if (player1Score + player2Score == noOfCards/2){
        console.log("The game is over!");
        // Uses a timeout to allow cards to be "removed" before message pops up
        setTimeout(function () {
            var msg;
            if (player1Score > player2Score){
                msg = "Player 1 won!";
                console.log(msg);
            }
            else{
                msg = "Player 2 won!";
                console.log(msg);
            }
            $("#player1").css("color", "white");
            $("#player2").css("color", "white");
            $("#winner").text(msg);
            $("#winner").css({"visibility": "visible"});
        }, 1000);
        clearInterval(timer);
    }
}


function flipTheCard(){
    if (canClick == false){
        console.log("\t**** CLICKING LOCKED AT TME MOMENT ****");
        return;
    }
    if (firstFlippedCard !== "undefined" && this == firstFlippedCard){
        console.log("\t**** CAN'T CLICK TWICE ON A CARD ****");
        return;
    }
    canClick = false;
    increaseFlips();

    console.log("\tFlipped a card (" + noOfFlips + ")");
    this.classList.toggle('flip');

    // Checking if the flipped card is the first or second
    if(!hasflippedCard){
        firstFlippedCard = this;
        hasflippedCard = true;
    } else{
        secondFlippedCard = this;
        hasflippedCard = false;
    }
    
    // Only compare two cards if secondFlippedCard is set
    if (typeof secondFlippedCard !== "undefined"){
        compareCards();
        checkForWinner();
    }
    else{
        canClick = true;
    }
}

$(document).ready(function () {
    console.log("Starting game...");
    generateRandomImageList()
    createCards();
    activePlayer = "p1";
    $("#player1").css("color", "dodgerblue");
    console.log("The game is set");
    console.log("Player 1 is the active player");
});

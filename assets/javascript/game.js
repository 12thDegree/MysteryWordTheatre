
'use strict';

var TargetWord =           // Word list
    ["ZAAT","CALIGULA","INCHON","NUKE","HOBGOBLINS","THINGS",'NORTH',"ISTAR","NUKIE","SHOWGIRLS","STRIPTEASE","GLITTER","GIGLI","CATWOMAN","HUMSHAKALS",
    ];

const guesses = 10;          // Maximum number of tries player has

var LetterGuess = [];       // Stores the letters the user guessed in an array
var TargetwordIndex;        // Index of the current word in the array which is created by the newGame function
var WordView = [];          // This will be the word we actually build to match the current word. Also empty array
var UntilBoom = 0;          // How many tries the player has left
var allDone = false;        // Flag for 'press any key to try again'     
var Victory = 0;               // How many wins has the player racked up

// Game sounds
var clickIt = new Audio('./assets/sounds/typewriter-key.wav');
var WinFanfare = new Audio('./assets/sounds/you-win.wav');
var LoserDirge = new Audio('./assets/sounds/you-lose.wav');

// FUNCTION -- New game. Research shows this is to clear the values stored in the variables so the new game can spin up and fill 'em with new goodies.
// THis function creates the value stored in the var TargetWordIndex (remember comfusion over not having it defined in variable list?) Use Math.floor to round to the nearest whole.
//Also defining UntilBoom as the const:Guesses value (10)
function newGame() {
    UntilBoom = guesses;
    TargetwordIndex = Math.floor(Math.random() * (TargetWord.length));
    // Clean out arrays with empty brackets...doesn't mean anything first run, need for every occurance thereafter
    LetterGuess = [];
    WordView = [];

    // Make sure the hangman image is cleared... GET RID OF HANGMAN IMAGES
    // document.getElementById("hangmanImage").src = "";

    // Build the  targetword as an index for searcing each letter separately - and display "_" for each letter insted of the leter itself (how else we gunna'guess??)
    for (var i = 0; i < TargetWord[TargetwordIndex].length; i++) {
        WordView.push("_");
    }   

    // Clear game-play message info area/box
    document.getElementById("NoLuck").style.cssText= "display: none";
    document.getElementById("gameover-image").style.cssText = "display: none";
    document.getElementById("WinnerImg").style.cssText = "display: none";

    // Show display
    updateDisplay();
};

//  Updates the display on the HTML Page
function updateDisplay() {
    document.getElementById("totalWins").innerText = Victory;
    // Display how much of the word we've already guessed on screen.
    // Printing the array would add commas (,) - so we concatenate a string from each value in the array.
    var WordViewText = "";
    for (var i = 0; i < WordView.length; i++) {
        WordViewText += WordView[i];
    }
    document.getElementById("currentWord").innerText = WordViewText;
    document.getElementById("UntilBoom").innerText = UntilBoom;
    document.getElementById("LetterGuess").innerText = LetterGuess;
};


// Updates the image depending on how many guesses
// function updateHangmanImage() {
    // document.getElementById("hangmanImage").src = "assets/images/" + (guesses - UntilBoom) + ".png";
// };

// This function takes a letter and finds all instances of in the string and replaces them in the guess word.
function evaluateGuess(letter) {
    // Array to store positions of letters in string
    var positions = [];
    // Loop through word for multiples of guessed letter, store in an array.
    for (var i = 0; i < TargetWord[TargetwordIndex].length; i++) {
        if(TargetWord[TargetwordIndex][i] === letter) {
            positions.push(i);
        }
    }
    // if there are no matches in the targetWord[twIndex], -1 guess
    if (positions.length <= 0) {
        UntilBoom--;
    } else {
        // Loop through all the indicies and replace the '_' with a letter.
        for(var i = 0; i < positions.length; i++) {
            WordView[positions[i]] = letter;
        }
    }
};
// Checks for a win by seeing if there are any remaining underscores
function checkWin() {
    if(WordView.indexOf("_") === -1) {
        document.getElementById("WinnerImg").style.cssText = "display: block";
        document.getElementById("NoLuck").style.cssText= "display: block";
        Victory++;
        WinFanfare.play();
        allDone = true;
    }
};

function checkLoss(){
    if(UntilBoom <= 0) {
        LoserDirge.play();
        document.getElementById("gameover-image").style.cssText = "display: block";
        document.getElementById("NoLuck").style.cssText = "display:block";
        allDone = true;
    }
}

// Pick a letter, Any Letter you please!
function makeGuess(letter) {
    if (UntilBoom > 0) {
        // Make sure we didn't use this letter yet
        if (LetterGuess
        .indexOf(letter) === -1) {
            LetterGuess
        .push(letter);
            evaluateGuess(letter);
        }
    }
    
};


// Event listener for the key stromes, which feelds into the makeGuess function and the event the function(event) is the event.keyCode below. notice the blues either side of the period. 
document.onkeydown = function(event) {
    // If we finished a game, dump one keystroke and reset. Found this bit of solution... 
    if(allDone) {
        newGame();
        allDone = false;
    } else {
        // Check to make sure a-z was pressed. Keycodes restrict checks to letters, ignores other characters. 
        if(event.keyCode >= 65 && event.keyCode <= 90) {
            clickIt.play();
            makeGuess(event.key.toUpperCase());
            updateDisplay();
            checkWin();
            checkLoss();
        }
    }
};
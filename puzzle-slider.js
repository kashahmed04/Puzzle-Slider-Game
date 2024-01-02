
/*First variable stores each image object, the solved order is the specific
    order for which the images show up on the board when the sort function is called below but for now it's sorted,
    the random puzzles variable is used to store each folder for 
    each images pieces so we can set up a new puzzle when the next of previous button is clicked, the index puzzle
    variable is used for the current puzzle we are on to be able to set up each puzzle, the rows and columns
    variable sets up the rows and columns for the puzzle, and the turns variable is the counter for ho many turns the user
    has taken so far as they solve the puzzle. */
let pieces = [];
let solvedOrder = ["1","4","7","2","5","8","3","6","9"];
let winOrder = ["1","4","7","2","5","8","3","6","9"]; //Final order of the solves puzzle we use in Checksolved
let randomPuzzles = ["media/pieces-1/","media/pieces-2/","media/pieces-3/","media/pieces-4/","media/pieces-5/","media/pieces-6/"]
let indexPuzzle = 0; 
let rows = 3;
let columns = 3;
let turns = 0;

/*Calls the setPuzzle() function to set up the first puzzle on the board, if the next button is clicked then
    we play the sound associated with the button and target the board and check if the index is greater than or equal to 6, we
    reset to the first image otherwise we keep incrementing. The extra condtional in the else is a double check to make sure
    we don't go out of range. Same thing for the previous button being clicked but it's in reverse order. If the menu button is clicked
    then we play the sound associated with the button and go back to the menu page. The _self allowws us to stay in the same tab
    when we go from the menu to the game and the game to the menu. There is also the mute button and if that was clicked then the 
    background music gets muted and the innerHTML gets set to unmute so there is the text changes to unmute and we can keep clicking
    the mute and unmute to stop and start the background music. We also set up our sounds at the end of the onload and play
    the background music for the game.*/
window.onload = function(){

    setPuzzle(indexPuzzle); //onload only runs once
    
    document.querySelector("#nextbutton").onclick = e =>{ 
                                                          
                                                           
        buttonSound.play();                            
                                                        
        document.querySelector("#board").innerHTML = "";
        if(indexPuzzle >= 6){
            indexPuzzle = 0; 
            setPuzzle(indexPuzzle);
        }
        else{
            indexPuzzle++;
            
            if(indexPuzzle >= 6){
                indexPuzzle = 0;
            }
            setPuzzle(indexPuzzle);
        }
    }

    document.querySelector("#previousbutton").onclick = e =>{ 
        buttonSound.play();
        document.querySelector("#board").innerHTML = "";
        if(indexPuzzle <= 0){ 
            indexPuzzle = 5; 
            setPuzzle(indexPuzzle);
        }
        else{
            indexPuzzle--;
            if(indexPuzzle < 0){
                indexPuzzle = 5;
            }
            setPuzzle(indexPuzzle);
        }
    }

    document.querySelector("#menubutton").onclick = e =>{ 
        window.open("menu.html","_self"); 
    }

    document.querySelector("#mutebutton").onclick = e => { 
        buttonSound.play();
        backgroundSound.stop();
        let menu = document.querySelector("#mutebutton").innerHTML
        if(menu == "Mute"){
            document.querySelector("#mutebutton").innerText = "Unmute";
        }
        if(menu == "Unmute"){
            backgroundSound.play();
            document.querySelector("#mutebutton").innerText = "Mute";
        }
        
    }

    pickupSound = new Howl({
        src: ["sounds/pick-up.wav"]
    });

    placeSound = new Howl({
        src: ["sounds/place.wav"]
    });

    backgroundSound = new Howl({
        src: ["sounds/background-music.wav"], 
        loop: true
    });

    buttonSound = new Howl({
        src: ["sounds/buttons.wav"]
    });

    backgroundSound.play();

}

/*  First we set the solved order variable to it's sorted array of images so that for each time we click to go to a new puzzle 
    it generates a new array. After, we randomize that array then call the swap tiles in slide puzzle method so that we know the puzzle is solveable 
    each time we randomize it. Then, we have the current random order array for the random order so each time we go in we can make a copy then shift the
    values out for each image and empty out the pices array for each puzzle so we can keep track of the pieces to change the border color if they solve the puzzle. 
    After, we go through each row and column and set up the individual pieces on the board as well as set their ID and their src to be the specified 
    image by shifting out of the specificed folder for the image we are currently on. After, we make each piece an image object and 
    pass the current image into the class then associate event listeners to account for the movement of each piece. Also, we reset the turns 
    to 0 for each new image creates and call the checkSolved to see to change the background color if they got the puzzle solved.*/
function setPuzzle(index){

    solvedOrder.sort(() => Math.random()-0.5);
    SwapTilesInSlidePuzzle(solvedOrder);
    
    let currentRandomOrder = solvedOrder.slice(); 
    pieces = [];

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            let image = document.createElement("img");
            image.id = "tile" + r.toString() + "-" + c.toString();
            image.src = randomPuzzles[index] + currentRandomOrder.shift() + ".jpg";
    
            pieces.push(new Piece(image));

            image.addEventListener("dragstart", pieces[pieces.length - 1].dragStart); 
            image.addEventListener("dragover", pieces[pieces.length - 1].dragOver);
            image.addEventListener("dragenter", pieces[pieces.length - 1].dragEnter)
            image.addEventListener("dragLeave", pieces[pieces.length - 1].dragLeave);
            image.addEventListener("drop", pieces[pieces.length - 1].dragDrop);
            image.addEventListener("dragend", pieces[pieces.length - 1].dragEnd);
    
            document.querySelector("#turns").innerText = ` ${turns = 0}`;
           
    
    
        }
    }
    checkSolved();
}

/*If the length of the array is less than two we exit the method, otherwise if the 0 or 1 index is the 9th image (the white tile) then
  we set a temp variable to the 0th index then set the 0th index to the 1 index then set the first index to the temp variable which stored the
  0th index of the array. Otheriwse, we set the temp to the puzzle array length -1 then set the puzzle array length -1 to the puzzle array length
  minus 2 then set the puzzle array length -2 to the temp variable. This basically makes sure that we have an odd number of inversions (3) for our puzzle
  to become solveable.*/
function SwapTilesInSlidePuzzle(puzzle)
{
    
    if (puzzle.length < 2)
        return;
 
    if(puzzle[0] !== "9" && puzzle[1] !== "9") 
    {
        let temp = puzzle[0];
        puzzle[0] = puzzle[1];
        puzzle[1] = temp;
    }
    else
    {
        let temp = puzzle[puzzle.Length -1];
        puzzle[puzzle.Length - 1] = puzzle[puzzle.Length - 2];
        puzzle[puzzle.Length - 2] = temp;
    }
}

/*Set a variable for the solvedPieces and go through the win order array (solved order of the array to win) and if the current pieces images src
  includes the win order index, then we incremement the solvedPieces and finally we check if solvedPieces is 9 (total number of images) change the border
  color to green otherwise leave it the original darkblue color to show the puzzle had not been solved.*/ 
function checkSolved(){
    let solvedPieces = 0;
    for(let i = 0; i < winOrder.length; i++){
        if(pieces[i].image.src.includes(winOrder[i].toString())){
            solvedPieces++;
        }
    }

    if(solvedPieces == 9) {
        document.querySelector("#board").style.borderColor = "green"
    }
    else{
        document.querySelector("#board").style.borderColor = "#0353A4"
    }
}
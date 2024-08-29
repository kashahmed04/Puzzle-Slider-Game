
class Piece{
    /*We set the image in the constructor, append the current image to the board and declare the current tile,
    other tile, and turns.*/
    constructor(image,solvedOrder = ["1","4","7","2","5","8","3","6","9"]){ 
        this.image = image;
        document.querySelector("#board").append(this.image);
        this.currentTile; 
        this.otherTile;
        this.turns = 0;
        this.solvedOrder = solvedOrder;

    }

    /*Sets the current tile as the current image (the current image tile getting dragged)
        then plays the sound for us picking up the image to move it.*/
    dragStart(){
        this.currentTile = this.image; 
        pickupSound.play();
    }

    /*Preventative; stops default action from happening*/
    dragOver(e){
        e.preventDefault(); 
    }

    /*Preventative; stops default action from happening*/
    dragEnter(e){
        e.preventDefault();
    }

    /*This is the current image being dropped on*/
    dragDrop(){
        this.otherTile = this.image; 
    }

    /*First we take the position of our mouse and it gets us everything under our mouse (anything under our
        current square tile including our square tile) so we get the index 0 of that which is the image element
        for our other tile variable. After, we set the current tile that we are on and see if the other
        tile is undefined (we drag the tile outside the board onto the lightblue background) then we 
        exit the method and don't move anything. Also, we check that if the other image is not 9.jpeg
        then we also exit the method because we can't move the image if it's not direcly next to the 
        white tile. After we get our id for the image we are on and replace the "tile" with an empty
        string then split the id to get the 2 numbers for our current image coordinates (rows and columns)
        and we do the same for the other tile. After we set our condtionals to see if we are moving left, right,
        up, or down, and we swap the pieces based on the direction we want to swap them in. Then we increment
        the turn and play the sound associated to dropping the image. After, we call the checkSolved function to check
        if the puzzle has been solved or not to change the border color of the puzzle.*/
    dragEnd(e){
        
       this.otherTile = document.elementsFromPoint(e.clientX,e.clientY)[0]; 
       //takes position of our mouse and anything under the square tile that we are dragging
       //all elemnets under the point where our mouse is then we index at the image specifically
       this.currentTile = this; //current tile we are on
       if(this.otherTile.src == undefined){ 
            return;  
       }
       if(!this.otherTile.src.includes("9.jpg")){
            
           return; 
        }

        let currentCoords = this.currentTile.id.replace("tile", "").split("-");
        let r1 = parseInt(currentCoords[0]);
        let c1 = parseInt(currentCoords[1]);

        let otherCoords = this.otherTile.id.replace("tile", "").split("-"); 
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);

        let moveLeft = r1 == r2 && c2 == c1 - 1; 
        let moveRight = r1 == r2 && c2 == c1 + 1; 

        let moveUp = c1 == c2 && r2 == r1 - 1; 
        let moveDown = c1 == c2 && r2 == r1 + 1;

        if(moveLeft || moveRight || moveUp || moveDown){
            let currentImage = this.currentTile.src;
            let otherImage = this.otherTile.src;
    
            this.currentTile.src = otherImage;
            this.otherTile.src = currentImage;

            document.querySelector("#turns").innerText = ` ${turns += 1}`; 
            
            let temp = solvedOrder[currentCoords];
            solvedOrder[currentCoords] = solvedOrder[otherCoords];
            solvedOrder[otherCoords] = temp;

            let temp2 = pieces[currentCoords];
            pieces[currentCoords] = pieces[otherCoords];
            pieces[otherCoords] = temp2;

            placeSound.play();

            checkSolved();

        }
    }
}
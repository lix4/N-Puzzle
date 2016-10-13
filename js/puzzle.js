(function () {

    /*
        By: Xiwen Li
        On: 10/1/2016
    */

    "use strict";

    // CONSTANTS
    var SIZE = 4;  // 4 for 16 puzzle, 5 for 25 puzzle, etc.
    var BOARD_WIDTH = 500;  // 500 pixels
    var BORDER_SIZE = 3;    // 3 pixels


    // OTHER VARS
    var RADIOBUTTOMS;
    var TILES = [];
    var RANDOMS = [];
    var TABLE;
    var boardDiv;

    // called when the page first loads to create tiles and empty space 
    function setup() {
        boardDiv = document.getElementById("board");
        var RADIOBUTTOMS = document.getElementsByName("size");
        var chooseButton = document.getElementById("button");

        boardDiv.style.width = BOARD_WIDTH + "px";
        boardDiv.style.height = BOARD_WIDTH + "px";
        boardDiv.style.borderWidth = BORDER_SIZE + "px";

        chooseButton.onclick = function () {
            if (boardDiv.firstElementChild != null) {
                while (boardDiv.firstChild) {
                    boardDiv.removeChild(boardDiv.firstChild);
                }
            }

            TABLE = document.createElement("table");
            TABLE.style.backgroundColor = "red";


            for (var i = 0; i < RADIOBUTTOMS.length; i++) {
                if (RADIOBUTTOMS[i].checked) {
                    SIZE = RADIOBUTTOMS[i].value;
                    break;
                }
            }

            RANDOMS = randomIntegersGenerator(1, SIZE * SIZE);

            for (var j = 0; j < SIZE; j++) {
                TILES[j] = TABLE.insertRow(j);
                for (var z = 0; z < SIZE; z++) {
                    TILES[j][z] = TILES[j].insertCell(z);
                    var temp = document.createElement("span");
                    if ((j == SIZE - 1) && (z == SIZE - 1)) {
                        var temp = document.createElement("span");
                        temp.className = "space";
                        temp.style.width = "150px";
                        temp.style.height = "150px";
                        temp.style.display = "flex";
                        TILES[j][z].appendChild(temp);
                        break;
                    }
                    temp.className = "tile";
                    temp.textContent = RANDOMS.pop();
                    temp.style.display = "flex";
                    temp.style.justifyContent = "center";
                    temp.style.alignItems = "center";
                    temp.style.width = "150px";
                    temp.style.height = "150px";
                    temp.onclick = function () {
                        moveTile(this);
                        checkWinOrNot();
                    }
                    TILES[j][z].appendChild(temp);
                }
            }
            boardDiv.appendChild(TABLE);
            checkWinOrNot();
        }
    }

    function randomIntegersGenerator(min, max) {
        var randomsList = [];
        min = Math.ceil(min);
        max = Math.floor(max);
        for (var i = 0; i < (max - 1); i++) {
            var newNum = Math.floor(Math.random() * (max - 1) + 1);
            while (randomsList.indexOf(newNum) > -1) {
                var newNum = Math.floor(Math.random() * (max - 1) + 1);
            }
            randomsList.push(newNum);
        }
        return randomsList;
    }


    // Exchange the locations of two elements in the DOM.  
    // Assumes that neither element is the parent of the other.	
    // from http://stackoverflow.com/questions/10716986/swap-2-html-elements-and-preserve-event-listeners-on-them

    function swapDomElements(element1, element2) {
        // create marker element and insert it where element1 is
        var temp = document.createElement("div");
        element1.parentNode.insertBefore(temp, element1);

        // move element1 to immediately before element2
        element2.parentNode.insertBefore(element1, element2);

        // move element2 to immediately before where element1 used to be
        temp.parentNode.insertBefore(element2, temp);

        // remove temporary marker node
        temp.parentNode.removeChild(temp);
    }

    // If clicked tile is next to the empty space, 
    // swap them
    function moveTile(first) {
        var thisRow = first.parentNode.parentNode;
        var thisTable = first.parentNode.parentNode.parentNode.parentNode;
        var cIndex = first.parentNode.cellIndex;
        var rIndex = thisRow.rowIndex;

        var right = thisRow.cells[cIndex + 1];
        var left = thisRow.cells[cIndex - 1];
        if (thisTable.rows[rIndex - 1] != undefined) {
            var up = thisTable.rows[rIndex - 1].cells[cIndex];
        }

        if (thisTable.rows[rIndex + 1] != undefined) {
            var down = thisTable.rows[rIndex + 1].cells[cIndex];
        }

        if (right != undefined) {
            if (right.children[0].className == "space") {
                swapDomElements(first, right.children[0]);
            }
        }

        if (left != undefined) {
            if (left.children[0].className == "space") {
                swapDomElements(first, left.children[0]);
            }
        }

        if (up != undefined) {
            if (up.children[0].className == "space") {
                swapDomElements(first, up.children[0]);
            }
        }

        if (down != undefined) {
            if (down.children[0].className == "space") {
                swapDomElements(first, down.children[0]);
            }
        }
    }

    function checkWinOrNot() {
        var count = 1;
        var win = true;
        for (var j = 0; j < SIZE; j++) {
            for (var z = 0; z < SIZE; z++) {

                if ((j == SIZE - 1) && (z == SIZE - 1)) {

                    if (TABLE.rows[j].cells[z].childNodes[0].className == "space") {

                        break;
                    }
                }

                if (TABLE.rows[j].cells[z].childNodes[0].className == "space") {

                    win = false;
                    break;
                }

                if (parseInt(TABLE.rows[j].cells[z].childNodes[0].textContent) != count) {

                    win = false;
                    break;
                }

                count++;
            }
        }


        if (win) {
            for (var j = 0; j < SIZE; j++) {
                for (var z = 0; z < SIZE; z++) {
                    if ((j == SIZE - 1) && (z == SIZE - 1)) {
                        break;
                    }
                    TILES[j][z].childNodes[0].textContent = "You win!";
                    TILES[j][z].childNodes[0].onclick = null;
                    TILES[j][z].childNodes[0].style.backgroundColor = "transparent";
                    TILES[j][z].childNodes[0].style.color = "yellow";
                }
            }
        }
    }

    window.onload = setup;
})();

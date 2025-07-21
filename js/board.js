import { Cell } from "./cell.js";
import { getRandomIntUpTo } from "./utils.js";

export class Board {
    #board = [];
    #width = 0;
    #height = 0;
    #levelBombCount = 0;
    
    constructor(width, height, levelBombCount) {
        this.#width = width;
        this.#height = height;
        this.#levelBombCount = levelBombCount;

        this.#fillBoard();
    }

    #fillBoard() {
        for(let row = 0; row < this.#height; row++) {
            this.#board.push([]);
            for(let col = 0; col < this.#width; col++) {
                this.#board[row].push(new Cell());
            }
        }
    }

    genLevel() {
        let newBombRow, newBombCol;
        let countOfPlantedBombs = 0;
        let cell;

        while (countOfPlantedBombs < this.#levelBombCount) {
            newBombRow = getRandomIntUpTo(this.#height);
            newBombCol = getRandomIntUpTo(this.#width);

            cell = this.#board[newBombRow][newBombCol];

            if(!cell.checkBomb()) {
                cell.plantBomb();
                countOfPlantedBombs++;
            }
        }
    }

    draw() {
        let boardInStrFormat = "";
        let cell;

        for(let row = 0; row < this.#height; row++) {
            for(let col = 0; col < this.#width; col++) {
                cell = this.#board[row][col];
                
                boardInStrFormat += cell.draw();
            }
            boardInStrFormat += "\n";
        }

        console.log(boardInStrFormat);
    }
}

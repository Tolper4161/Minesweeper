import { Board } from "./board.js";

class Game {
    #board = null;

    constructor() {
        this.#board = new Board(3, 3, 4);
        this.#board.genLevel();
    }

    update() {
        this.#board.draw();
    }
}

const game = new Game();

game.update();

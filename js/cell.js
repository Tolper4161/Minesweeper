export class Cell {
    #hasBomb = false;

    constructor() {
        this.#hasBomb;
    }

    checkIsBomb() {
        return this.#hasBomb;
    }

    plantBomb() {
        this.#hasBomb = true;
    }

    log() {
        if (this.#hasBomb) {
            return "[*]";
        }
        return "[ ]";
    }

    draw() {
        
    }
}

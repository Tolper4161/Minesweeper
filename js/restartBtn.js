export class RestartBtn {
    #gameRestart;
    #gameOutcome = null;

    constructor(game) {
        this.#gameRestart = () => game.restart();;

        this.element = document.createElement("button");
        this.element.id = "restart-btn";
        this.element.addEventListener("mousedown", (event) => this.#eventMouseDown(event));
        this.element.addEventListener("mouseup", (event) => this.#eventMouseUp(event));
        this.element.addEventListener("mouseleave", (event) => this.#eventMouseLeave(event));
        this.element.addEventListener("click", (event) => this.restart(event));
    }

    #eventMouseDown(event) {
        if (event.button === 0) {
            const className = this.element.className;
            this.element.classList = `${ "clicked " }`;
        }
    }

    #eventMouseUp(event) {
        if (event.button === 0) {
            if (gameOutcome === null) this.element.classList = "";
            else this.element.classList = gameOutcome ? "victory" : "dead";
        }
    }

    #eventMouseLeave(event) {
        if (event.button === 0) {
            if (this.#gameOutcome === null) this.element.classList = "";
            else this.element.classList = gameOutcome ? "victory" : "dead";
        }
    }

    restart(event) {
        this.#gameOutcome = null;
        this.element.classList = "";
        this.#gameRestart(event);
    }

    gameOver(isVictory) {
        this.#gameOutcome = isVictory;
        this.element.classList = this.#gameOutcome ? "victory" : "dead";
    }
}
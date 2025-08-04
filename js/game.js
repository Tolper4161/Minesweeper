import { RestartBtn } from "./restartBtn.js";
import { Board } from "./board.js";

class Game {
    #board = null;
    #restartBtn = null;
    #debugMode = true;
    #gameOutcome = null;
    #immortalityMode = false;

    constructor() {
        this.element = document.createElement("div");
        this.element.id = "game";
        document.body.append(this.element);

        this.#restartBtn = new RestartBtn(this);
        this.#board = new Board(this, this.#restartBtn, 30, 16, 99);
    }

    update() {
        this.#board.draw();
    }

    BOOMgame(maxRepeats, delay) {
        let count = 0;
        
        const intervalId = setInterval(() => {
            console.log(count);
            this.element.classList = "BOOM";
            setTimeout(() => {
                this.element.classList = "";
            }, delay);
            count++;
            
            if (count >= maxRepeats) {
                clearInterval(intervalId);
            }
        }, delay + 5);
    }

    gameOver(isVictory) {
        this.#gameOutcome = isVictory;
        this.#restartBtn.gameOver(isVictory);

        if (!isVictory) {
            this.BOOMgame(5, 200);
        }
    }

    restart(event) {
        console.log("1 RESTART!!!", this.#board);
        this.#board.restart();
    }

    checkImmortalityMode() {
        return this.#immortalityMode;
    }

    /*
        ===========================
               ДЕБАГ-КОМАНДЫ
        ===========================
    */
    
    // Включает/выключает дебаг-мод
    #toggleDebugMode() {
        this.#debugMode = !this.#debugMode;

        if (this.#debugMode) {
            console.log("РЕЖИМ РАЗРАБОТЧИКА ВКЛЮЧЕН!");
        } else {
            console.log("РЕЖИМ РАЗРАБОТЧИКА ВЫКЛЮЧЕН!");
        }
    }

    // Выводит расположение мин на поле
    #debugLogBoard() {
        return this.#board.log();
    }

    // Проверяет выбранную ячейку на наличие мины или вокруг нее, если мины нет 
    #debugCheckCell(row, col) {
        if (this.#debugMode) {
            try {
                return this.#board.checkCell(row, col);
            } catch(e) {
                return e;
            }
        }
    }

    // Включает/выключает режим бессмертия
    #debugToggleImmortalityMode() {
        if (this.#debugMode) {
            this.#immortalityMode = !this.#immortalityMode;
            console.log(`РЕЖИМ БЕССМЕРТИЯ В${ this.#immortalityMode ? "" : "Ы" }КЛЮЧЕН!`);
        }
    }

    // Предоставляет интерфейс дебаг-команд для сохранения приватности остальных методов и полей
    getDebugInterface() {
        return({
            logBoard: () => this.#debugLogBoard(),
            checkCell: (row, col) => this.#debugCheckCell(row, col),
            toggleImmortalityMode: () => this.#debugToggleImmortalityMode(),
            toggle: () => this.#toggleDebugMode()
        });
    }
}

const game = new Game();
game.update();

// Закрепление интерфейса дебаг-команд
window.debug = game.getDebugInterface();

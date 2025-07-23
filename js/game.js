import { Board } from "./board.js";

class Game {
    #board = null;
    #debugMode = true;

    constructor() {
        this.#board = new Board("game", 30, 16, 99);
    }

    update() {
        this.#board.draw();
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

    // Предоставляет интерфейс дебаг-команд для сохранения приватности остальных методов и полей
    getDebugInterface() {
        return({
            logBoard: () => this.#debugLogBoard(),
            checkCell: (row, col) => this.#debugCheckCell(row, col),
            toggle: () => this.#toggleDebugMode()
        });
    }
}

const game = new Game();
game.update();

// Закрепление интерфейса дебаг-команд
window.debug = game.getDebugInterface();

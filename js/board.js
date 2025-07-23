import { Cell } from "./cell.js";
import { getRandomIntUpTo } from "./utils.js";

export class Board {
    #board = [];   // Матрица ячеек поля
    #element;
    #width = 0;
    #height = 0;
    #levelBombCount = 0;
    #isClickFirst = true;
    
    /**
     * Создаёт игровое поле заданного размера с указанным количеством бомб
     * @param {number} width - Ширина поля (количество столбцов)
     * @param {number} height - Высота поля (количество строк)
     * @param {number} levelBombCount - Количество бомб на уровне
     */
    constructor(gameElementId, width, height, levelBombCount) {
        let gameElement = document.getElementById(gameElementId);
        this.#element = document.createElement("section");
        this.#element.id = "board";
        gameElement.append(this.#element);

        this.#width = width;
        this.#height = height;
        this.#levelBombCount = levelBombCount;

        this.#fillBoard(); // Создаем доску. Ни одна ячейка не содержит мин
    }

    // Заполняет доску пустыми ячейками (без бомб)
    #fillBoard() {
        let cell;

        for(let row = 0; row < this.#height; row++) {
            this.#board.push([]);
            for(let col = 0; col < this.#width; col++) {
                cell = new Cell(row, col);
                cell.connectToBoard(this);
                
                this.#board[row].push(cell);
            }
        }
    }

    // Случайным образом расстанавливает мины на доске
    genLevel(forbiddenCellRow=null, forbiddenCellCol=null) {
        let newBombRow, newBombCol;
        let countOfPlantedBombs = 0;
        let cell;

        while (countOfPlantedBombs < this.#levelBombCount) {
            newBombRow = getRandomIntUpTo(this.#height);
            newBombCol = getRandomIntUpTo(this.#width);

            cell = this.#board[newBombRow][newBombCol];
            
            if (forbiddenCellRow !== null && forbiddenCellCol !== null) {
                if (
                    Math.abs(newBombRow - forbiddenCellRow) <= 1 && 
                    Math.abs(newBombCol - forbiddenCellCol) <= 1
                ) continue;
            }

            if (!cell.checkIsBomb()) {
                cell.plantBomb();
                countOfPlantedBombs++;
            }
        }
    }

    /*
        Проверяет выбранную ячейку на наличие мины и возвращает -1, если она там есть.
        Иначе, проверяет ячейки вокруг выбранной и возвращает результат:
            0 - вокруг пусто,
            1 - рядом одна мина,
            2 - две и т.д.
    */
    checkCell(row, col) {
        try {
            if (typeof row !== "number" || typeof col !== "number")
                throw TypeError("Одна или обе из введенных координат не являются числами!");
            if ((row < 0 || row >= this.#height) || (col < 0 || col >= this.#width ))
                throw RangeError("Введенные координаты ячейки выходят за пределы границ поля!");

            let rowAmount = 0, colAmount = 0;
            let bombCount = 0;
            let cell = this.#board[row][col];

            if (cell.checkIsBomb()) {
                return -1; // Во введенной ячейке мина
            } else {
                for(let i = 0; i < 9; i++) {
                    rowAmount = Math.floor(i / 3) - 1;
                    colAmount = i % 3 - 1;

                    if (rowAmount || colAmount) {
                        if (
                            (row + rowAmount >= 0 && row + rowAmount < this.#height) &&
                            (col + colAmount >= 0 && col + colAmount < this.#width)
                        ) {
                            cell = this.#board[row + rowAmount][col + colAmount];

                            if (cell.checkIsBomb()) bombCount++;
                        }
                    }
                }
            }
            return bombCount; // Введенная ячейка безопасна, а вокруг bombCount мин
        } catch(e) {
            if (e.name === "RangeError" || e.name === "TypeError") {
                console.log(`${e.name}: ${e.message}`);
            } else {
                throw e;
            }
        }
    }

    // Проверяет ячейку на мину. Если в ячейке мина, то осуществляет конец игры.
    // Если рядом с ячейкой бомба(-ы), просто возвращает их количество.
    // Если ячейка пуста, то происходит рекурсивное открытие всех пустых ячеек.
    clickToCell(row, col) {
        if (this.#isClickFirst) {
            this.genLevel(row, col);

            this.#isClickFirst = false;
        }
        
        let cellCheckingRes = this.checkCell(row, col);

        if (cellCheckingRes === -1) {
            console.log("BOOM!!!");
        }
        else if (cellCheckingRes === 0) {
            let rowAmount = 0, colAmount = 0;
            let cell;
            
            for(let i = 0; i < 9; i++) {
                rowAmount = Math.floor(i / 3) - 1;
                colAmount = i % 3 - 1;

                if (rowAmount || colAmount) {
                    if (
                        (row + rowAmount >= 0 && row + rowAmount < this.#height) &&
                        (col + colAmount >= 0 && col + colAmount < this.#width)
                    ) {
                        cell = this.#board[row + rowAmount][col + colAmount];
                        cellCheckingRes = this.checkCell(row + rowAmount, col + colAmount)

                        if (cell.checkIsClosed()) {
                            cell.open();
                        }
                    }
                }
            }

            return 0;
        }

        return cellCheckingRes;
    }

    // Возвращает расположение мин на поле
    log() {
        let boardInStrFormat = "";
        let cell;

        for(let row = 0; row < this.#height; row++) {
            for(let col = 0; col < this.#width; col++) {
                cell = this.#board[row][col];
                
                boardInStrFormat += cell.log();
            }
            boardInStrFormat += "\n";
        }

        console.log(boardInStrFormat);
    }

    // Отрисовка интерфейса поля
    draw() {
        let cell;
        let boardLine;

        for(let row = 0; row < this.#height; row++) {
            boardLine = document.createElement("div");
            boardLine.classList = "board__line";
            
            for(let col = 0; col < this.#width; col++) {
                cell = this.#board[row][col];
                boardLine.append(cell.draw());
            }

            this.#element.append(boardLine);
        }
    }
}

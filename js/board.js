import { Cell } from "./cell.js";
import { getRandomIntUpTo } from "./utils.js";

export class Board {
    #board = [];   // Матрица ячеек поля
    element;
    #elementCellContainer;
    #restartBtn;
    #width = 0;
    #height = 0;
    #levelBombCount = 0;
    #openedCellsCount = 0;
    #isClickFirst = true;
    #gameOver;
    
    /**
     * Создаёт игровое поле заданного размера с указанным количеством бомб
     * @param {number} width - Ширина поля (количество столбцов)
     * @param {number} height - Высота поля (количество строк)
     * @param {number} levelBombCount - Количество бомб на уровне
     */
    constructor(game, restartBtn, width, height, levelBombCount) {
        this.#width = width;
        this.#height = height;
        this.#levelBombCount = levelBombCount;
        this.#restartBtn = restartBtn;

        this.#gameOver = (isVictory) => game.gameOver(isVictory);
        this.gameCheckImmortalityMode = () => game.checkImmortalityMode();
        
        this.element = document.createElement("div");
        this.element.id = "board";
        

        let borderTop;
        let borderContainerTop = document.createElement("div");
        borderContainerTop.id = "border-container__top";
        
        borderTop = document.createElement("div");
        borderTop.classList = "border top-left";
        borderContainerTop.append(borderTop);
        
        borderTop = document.createElement("div");
        borderTop.classList = "border top";
        borderTop.style.width = `${ 32 * this.#width }px`;
        borderContainerTop.append(borderTop);
        
        borderTop = document.createElement("div");
        borderTop.classList = "border top-right";
        borderContainerTop.append(borderTop);
        

        let borderHeader;
        let borderContainerHeader = document.createElement("div");
        borderContainerHeader.id = "border-container__header";
        
        borderHeader = document.createElement("div");
        borderHeader.classList = "border left";
        borderHeader.style.height = `${ 32 * 2 }px`;
        borderContainerHeader.append(borderHeader);
        
        borderHeader = document.createElement("div");
        borderHeader.classList = "border header";
        borderHeader.style.width = `${ 32 * this.#width }px`;
        borderHeader.style.height = `${ 32 * 2 }px`;
        borderHeader.append(this.#restartBtn.element);
        borderContainerHeader.append(borderHeader);
        
        borderHeader = document.createElement("div");
        borderHeader.classList = "border right";
        borderHeader.style.height = `${ 32 * 2 }px`;
        borderContainerHeader.append(borderHeader);
        

        let borderMiddle;
        let borderContainerMiddle = document.createElement("div");
        borderContainerMiddle.id = "border-container__middle";
        
        borderMiddle = document.createElement("div");
        borderMiddle.classList = "border middle-left";
        borderContainerMiddle.append(borderMiddle);
        
        borderMiddle = document.createElement("div");
        borderMiddle.classList = "border middle";
        borderMiddle.style.width = `${ 32 * this.#width }px`;
        borderContainerMiddle.append(borderMiddle);
        
        borderMiddle = document.createElement("div");
        borderMiddle.classList = "border middle-right";
        borderContainerMiddle.append(borderMiddle);


        let borderLeft, borderRight;
        let borderContainerLeft = document.createElement("div");
        borderContainerLeft.id = "border-container__left";

        let borderContainerRight = document.createElement("div");
        borderContainerRight.id = "border-container__right";


        borderLeft = document.createElement("div");
        borderLeft.classList = "border left";
        borderLeft.style.height = `${ 32 * this.#height }px`;
        borderContainerLeft.append(borderLeft);

        borderRight = document.createElement("div");
        borderRight.classList = "border right";
        borderRight.style.height = `${ 32 * this.#height }px`;
        borderContainerRight.append(borderRight);

        
        let borderBottom;
        let borderContainerBottom = document.createElement("div");
        borderContainerBottom.id = "border-container__bottom";

        borderBottom = document.createElement("div");
        borderBottom.classList = "border bottom-left";
        borderContainerBottom.append(borderBottom);
        
        borderBottom = document.createElement("div");
        borderBottom.classList = "border bottom";
        borderBottom.style.width = `${ 32 * this.#width }px`;
        borderContainerBottom.append(borderBottom);
        
        borderBottom = document.createElement("div");
        borderBottom.classList = "border bottom-right";
        borderContainerBottom.append(borderBottom);


        this.#elementCellContainer = document.createElement("div");
        this.#elementCellContainer.id = "cell-container";

        this.element.append(borderContainerTop);
        this.element.append(borderContainerHeader);
        this.element.append(borderContainerMiddle);

        const boardContent = document.createElement("div");
        boardContent.classList = "board-content";

        boardContent.append(borderContainerLeft);
        boardContent.append(this.#elementCellContainer);
        boardContent.append(borderContainerRight);

        this.element.append(boardContent);
        
        this.element.append(borderContainerBottom);
        
        game.element.append(this.element);

        this.#fillBoard(); // Создаем доску. Ни одна ячейка не содержит мин
    }

    // Заполняет доску пустыми ячейками (без бомб)
    #fillBoard() {
        let cell;

        for(let row = 0; row < this.#height; row++) {
            this.#board.push([]);
            for(let col = 0; col < this.#width; col++) {
                cell = new Cell(this, row, col);
                
                this.#board[row].push(cell);
            }
        }
    }

    #clearBoard() {
        let cell;

        for(let row = 0; row < this.#height; row++) {
            for(let col = 0; col < this.#width; col++) {
                cell = this.#board[row][col];
                cell.restart();
            }
        }
    }

    restart() {
        this.#clearBoard();
        this.#isClickFirst = true;
        this.#elementCellContainer.classList = "";
        this.#openedCellsCount = 0;
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
        try {

            if (this.#isClickFirst) {
                this.genLevel(row, col);

                this.#isClickFirst = false;
            }
            
            let cellCheckingRes = this.checkCell(row, col);

            console.log("cellCheckingRes:", cellCheckingRes);
            if (cellCheckingRes !== -1) this.#openedCellsCount++;
            
            if (
                (cellCheckingRes !== -1 || this.gameCheckImmortalityMode()) &&
                (this.#openedCellsCount === this.#width * this.#height - this.#levelBombCount)
            ) {
                this.#gameOver(true);
                this.#elementCellContainer.classList = "game-over";
            }

            if (cellCheckingRes === -1) {
                if (!this.gameCheckImmortalityMode()) {
                    this.#gameOver(false);
                    this.#elementCellContainer.classList = "game-over";
                }
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
        } catch(e) {
            console.log(`${e.name}: ${e.message}`);
        }
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

        this.#elementCellContainer.innerHTML = "";

        for(let row = 0; row < this.#height; row++) {
            boardLine = document.createElement("div");
            boardLine.classList = "board__line";
            
            for(let col = 0; col < this.#width; col++) {
                cell = this.#board[row][col];
                boardLine.append(cell.draw());
            }

            this.#elementCellContainer.append(boardLine);
        }
    }
}

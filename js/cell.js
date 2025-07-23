export class Cell {
    #hasBomb = false;
    #hasFlag = false;
    #isClosed = true;
    #row = 0; #col = 0;
    #boardClickToCell;
    #element = document.createElement("button");

    constructor(row, col) {
        this.#row = row;
        this.#col = col;
        
        this.#element.classList = "cell closed";
        this.#element.addEventListener("mousedown", (event) => this.click(event));
        this.#element.addEventListener("contextmenu", (event) => event.preventDefault());
    }

    // Клик по ячейке
    click(event) {
        if (event.button === 0) {
            this.open();
        } else if (event.button === 2) {
            this.toggleFlag();
        }
    }

    // Привязывает ячейку к доске
    connectToBoard(board) {
        this.#boardClickToCell = (row, col) => board.clickToCell(row, col);
    }

    // Устанавливает мину в ячейку
    plantBomb() {
        this.#hasBomb = true;
    }

    // Проверяет ячейку на мину
    checkIsBomb() {
        return this.#hasBomb;
    }

    // Проверяет, загрыта ли ячейка
    checkIsClosed () {
        return this.#isClosed;
    }

    // Устанавливает/снимает флаг
    toggleFlag() {
        if (this.#isClosed) {
            this.#hasFlag = !this.#hasFlag;

            this.#element.classList = `cell closed ${ this.#hasFlag ? "flag" : "" }`;
        }
    }

    // Открывает ячейку, если на ней нет флажка
    open() {
        if (!this.#hasFlag) {
            if (this.#isClosed) {
                this.#isClosed = false;
                
                const clickingRes = this.#boardClickToCell(this.#row, this.#col);

                if (clickingRes === -1) {
                    this.#element.classList = "cell opened bomb";
                } else {
                    this.#element.classList = `cell opened num${ clickingRes }`;
                }
            }
        }
    }

    // Выводит содержимое ячейки в консоль
    log() {
        if (this.#hasBomb) {
            return "[*]";
        }
        return "[ ]";
    }

    // Отрисовывает интерфейс ячейки
    draw() {
        return this.#element;
    }
}

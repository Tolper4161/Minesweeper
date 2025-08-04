export class Cell {
    #hasBomb = false;
    #hasFlag = false;
    #isClosed = true;
    #row = 0; #col = 0;
    #boardClickToCell;
    #element = document.createElement("button");

    constructor(board, row, col) {
        this.#row = row;
        this.#col = col;
        
        this.#element.classList = "cell closed";
        this.#element.addEventListener("mousedown", (event) => this.click(event));
        this.#element.addEventListener("contextmenu", (event) => event.preventDefault());
        
        this.#boardClickToCell = (row, col) => board.clickToCell(row, col);
        this.gameCheckImmortalityMode = () => board.gameCheckImmortalityMode();
    }

    // Клик по ячейке
    click(event) {
        if (event.button === 0) {
            this.open();
        } else if (event.button === 2) {
            this.toggleFlag();
        }
    }

    // Устанавливает мину в ячейку
    plantBomb() {
        this.#hasBomb = true;
    }

    restart() {
        this.#hasBomb = false;
        this.#hasFlag = false;
        this.#isClosed = true;
        this.#element.classList = "cell closed";
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
    toggleFlag(value=null) {
        if (this.#isClosed || value !== null) {
            if (value === null) this.#hasFlag = !this.#hasFlag;
            else this.#hasFlag = value;

            this.#element.classList = `cell closed ${ this.#hasFlag ? "flag" : "" }`;
        }
    }

    // Открывает ячейку, если на ней нет флажка
    open() {
        try {
            if (!this.#hasFlag) {
                if (this.#isClosed) {
                    this.#isClosed = false;
                    
                    const clickingRes = this.#boardClickToCell(this.#row, this.#col);

                    if (clickingRes === -1) {
                        console.log(this.gameCheckImmortalityMode());
                        if (this.gameCheckImmortalityMode()) {
                            this.toggleFlag(true);
                        } else {
                            this.#element.classList = "cell opened bomb";
                        }    
                    } else {
                        this.#element.classList = `cell opened num${ clickingRes }`;
                    }
                }
            }
        } catch(e) {
            console.log(`${e.name}: ${e.message}`);
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

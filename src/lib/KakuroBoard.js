/**
 * @enum {number}
 * @readonly
 */
export const CellType = {
    Clue: 0,
    Field: 1
}

/**
 * @enum {number}
 * @readonly
 */
export const RunOrientation = {
    HORIZONTAL: 0,
    VERTICAL: 1
}

/**
 * @class
 * @constructor
 * @public
 */
class Cell {
    constructor(type, values=[], initPotentials=false) {
        /**
         * @type {CellType}
         */
        this.type = CellType.Field;

        this.value = 0;
        this.horizontalClue = 0;
        this.verticalClue = 0;

        this.horizontalFulfilled = false;
        this.verticalFulfilled = false;

        if (initPotentials)
            /**
             * @type {Set.<number>}
             */
            this.potentialValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        else
            this.potentialValues = new Set();


        this.type = type;
        switch (true) {
            case type===CellType.Field && values.length >= 1:
                this.value = values[0];
                break;
            case type===CellType.Clue && values.length >= 1:
                this.verticalClue = values[0];
                if (values.length >= 2) this.horizontalClue = values[1];
                break;
        }
    }
    switchPotentialValue(val) {
        this.potentialValues.has(val) ? this.potentialValues.delete(val) : this.potentialValues.add(val);
    }
}

/**
 * Run contains a set of cells meant to sum up to a certain value
 * @class
 * @constructor
 * @public
 */
class Run {
    /**
     * @param {Cell} clueCell
     * @param {RunOrientation} orientation
     */
    constructor(clueCell, orientation) {
        /**
         * @type {Array.<Cell>}
         * @public
         */
        this.containedCells = [];
        /**
         * @type {number}
         */
        this.targetSum = 0;

        /**
         * @type {Cell}
         */
        this.clueCell = clueCell;
        this.orientation = orientation;
    }

    getSum() {
        let encounteredValues = new Set();
        let sum = 0;
        this.containedCells.every((c) => {
            if (c.value <= 0 || c.value >=10 || encounteredValues.has(c.value)) {
                sum = 0;
                return false;
            }
            encounteredValues.add(c.value);
            sum += c.value;
            return true;
        });
        return sum;
    }

    checkFullfillment() {
        switch (this.orientation) {
            case RunOrientation.HORIZONTAL:
                this.clueCell.horizontalFulfilled = (this.getSum() === this.targetSum);
                return this.clueCell.horizontalFulfilled;
            case RunOrientation.VERTICAL:
                this.clueCell.verticalFulfilled = (this.getSum() === this.targetSum);
                return this.clueCell.verticalFulfilled;
        }
    }
}

/**
 * @class
 * @constructor
 * @public
 */
export class KakuroBoard {
    constructor() {
        /**
         * @type {number}
         */
        this.width = 3;
        /**
         * @type {number}
         */
        this.height = 3;
        /**
         * @type {Array.<Array.<Cell>>}
         * @public
         */
        this.board = [
                      [new Cell(CellType.Clue), new Cell(CellType.Clue, [12]), new Cell(CellType.Clue, [5])],
                      [new Cell(CellType.Clue, [0, 13]), new Cell(CellType.Field), new Cell(CellType.Field)],
                      [new Cell(CellType.Clue, [0, 4]), new Cell(CellType.Field), new Cell(CellType.Field)],
                     ]
    }

    /**
     * @param x
     * @param y
     * @returns {Run|null}
     */
    getVerticalRun(x, y) {
        if (y < 0) return null;
        if (this.board[y][x].type === CellType.Field) {
            return this.getVerticalRun(x, y-1);
        }
        else {
            if (this.board[y][x].verticalClue <= 0) return null;
            let ret = new Run(this.board[y][x], RunOrientation.VERTICAL);
            ret.targetSum = this.board[y][x].verticalClue;
            while (++y < this.height && this.board[y][x].type === CellType.Field) {
                ret.containedCells.push(this.board[y][x]);
            }
            return ret;
        }
    }

    /**
     * @param x
     * @param y
     * @returns {Run|null}
     */
    getHorizontalRun(x, y) {
        if (x < 0) return null;
        if (this.board[y][x].type === CellType.Field) {
            return this.getHorizontalRun(x-1, y);
        }
        else {
            if (this.board[y][x].horizontalClue <= 0) return null;
            let ret = new Run(this.board[y][x], RunOrientation.HORIZONTAL);
            ret.targetSum = this.board[y][x].horizontalClue;
            while (++x < this.width && this.board[y][x].type === CellType.Field) {
                ret.containedCells.push(this.board[y][x]);
            }
            return ret;
        }
    }

    checkSolution() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.height; x++) {
                if (this.board[y][x].type === CellType.Field) continue;
                let run = this.getHorizontalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) return false;

                run = this.getVerticalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) return false;
            }
        }
        return true;
    }



}
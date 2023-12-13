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
    constructor(type = CellType.Field, values=[], initPotentials=false) {
        /**
         * @type {CellType}
         */
        this.type = type;

        this.value = 0;
        this.horizontalClue = 0;
        this.verticalClue = 0;
        this.positionX = -1;
        this.positionY = -1;

        this.horizontalFulfilled = false;
        this.verticalFulfilled = false;

        if (initPotentials)
            /**
             * @type {Set.<number>}
             */
            this.potentialValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        else
            this.potentialValues = new Set();

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
    getSetOfValues() {
        let presentValues = new Set();
        this.containedCells.forEach((c) => {
            presentValues.add(c.value);
        });
        return presentValues;
    }
    isCluePossible(clue) {
        //TODO
    }
    getPossibleClues() {
        //TODO
    }
    getMaximallyConstrainingClue() {
        //TODO
    }
}

//from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
        this.width = 4;
        /**
         * @type {number}
         */
        this.height = 5;
        /**
         * @type {Array.<Array.<Cell>>}
         * @public
         */
        this.board = [
            [new Cell(CellType.Clue), new Cell(CellType.Clue, [6]), new Cell(CellType.Clue, [10]), new Cell(CellType.Clue)],
            [new Cell(CellType.Clue, [0, 7]), new Cell(CellType.Field), new Cell(CellType.Field), new Cell(CellType.Clue, [23])],
            [new Cell(CellType.Clue, [0, 11]), new Cell(CellType.Field), new Cell(CellType.Field), new Cell(CellType.Field)],
            [new Cell(CellType.Clue, [0, 14]), new Cell(CellType.Field), new Cell(CellType.Field), new Cell(CellType.Field)],
            [new Cell(CellType.Clue), new Cell(CellType.Clue, [0,7]), new Cell(CellType.Field), new Cell(CellType.Field)]
        ]
    }
    /**
     * @param x
     * @param y
     * @param allowZeroClue
     * @returns {Run|null}
     */
    getVerticalRun(x, y, allowZeroClue = false) {
        if (y < 0) return null;
        if (this.board[y][x].type === CellType.Field) {
            return this.getVerticalRun(x, y-1, allowZeroClue);
        }
        else {
            if (!allowZeroClue && this.board[y][x].verticalClue <= 0) return null;
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
     * @param allowZeroClue
     * @returns {Run|null}
     */
    getHorizontalRun(x, y, allowZeroClue= false,) {
        if (x < 0) return null;
        if (this.board[y][x].type === CellType.Field) {
            return this.getHorizontalRun(x-1, y, allowZeroClue);
        }
        else {
            if (!allowZeroClue && this.board[y][x].horizontalClue <= 0) return null;
            let ret = new Run(this.board[y][x], RunOrientation.HORIZONTAL);
            ret.targetSum = this.board[y][x].horizontalClue;
            while (++x < this.width && this.board[y][x].type === CellType.Field) {
                ret.containedCells.push(this.board[y][x]);
            }
            return ret;
        }
    }
    /**
     * @param x horizontal position of checked cell
     * @param y vertical position of checked cell
     * @returns {{horizontal: Set<any>, vertical: Set<any>}|boolean}
     * visible values or false if any value repeats vertically or horizontally
     */
    getVisibleValues(x, y) {
        const startX = x;
        const startY = y;

        const hvals = new Set();
        const vvals = new Set();

        while (this.board[++y]?.[x]?.type === CellType.Field)
            if (vvals.has(this.board[y][x].value))
                return false;
            else
                vvals.add(this.board[y][x].value);
        y = startY;
        while (this.board[--y]?.[x]?.type === CellType.Field)
            if (vvals.has(this.board[y][x].value))
                return false;
            else
                vvals.add(this.board[y][x].value);
        y = startY;
        while (this.board[y]?.[++x]?.type === CellType.Field)
            if (hvals.has(this.board[y][x].value))
                return false;
            else
                hvals.add(this.board[y][x].value);
        x = startX;
        while (this.board[y]?.[--x]?.type === CellType.Field)
            if (hvals.has(this.board[y][x].value))
                return false;
            else
                hvals.add(this.board[y][x].value);

        return {horizontal: hvals, vertical: vvals};
    }
    checkSolution() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x].type === CellType.Field) continue;
                let run = this.getHorizontalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) return false;

                run = this.getVerticalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) return false;
            }
        }
        return true;
    }
    checkSolutionAll() {
        let ret = true;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y][x].type === CellType.Field) continue;
                let run = this.getHorizontalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) ret = false;

                run = this.getVerticalRun(x, y);
                if (run !== null) if(!run.checkFullfillment()) ret = false;
            }
        }
        return ret;
    }
    async generateRandom(w, h, refreshFunc, timeStep) {
        if (w<3||h<3) return;
        let connected;
        const hash = (x, y) => x*Math.max(100,w+1,h+1) + y;
        const unhash = (v) => [Math.floor(v/Math.max(100,w+1,h+1)), v%Math.max(100,w+1,h+1)];
        do {
            this.board = [];
            this.width = w;
            this.height = h;

            const toFill = new Set();
            for (let i = 0; i < h; i++) {
                let row = [];
                this.board.push(row);
                for (let j = 0; j < w; j++) {
                    //const tmp = new Cell(!(j && i)?CellType.Clue:CellType.Field, [], true);
                    const tmp = new Cell(CellType.Clue, [], true);
                    tmp.positionX = j;
                    tmp.positionY = i;
                    row.push(tmp);
                    if (j && i) toFill.add(hash(j, i));
                }
            }

            const neighbours = new Set();
            const initial = Array.from(toFill)[Math.floor(Math.random()*toFill.size)];
            neighbours.add(initial);

            let iteration = 0;
            const toCheck = new Set();
            while (neighbours.size > 0) {
                const picked = Array.from(neighbours)[Math.floor(Math.random()*neighbours.size)];
                neighbours.delete(picked);
                toFill.delete(picked);

                const coords = unhash(picked);
                const cx = coords[0];
                const cy = coords[1];

                const cell = this.board[cy][cx];
                cell.type = CellType.Field;


                const hrun = this.getHorizontalRun(cx, cy, true).containedCells.length;
                const vrun = this.getVerticalRun(cx, cy, true).containedCells.length;

                iteration++;

                if (hrun > 9 || vrun > 9) {
                    cell.type = CellType.Clue;
                    continue;
                }

                if (iteration === 1 ||
                    hrun === 2 || vrun === 2 ||
                    Math.random()-(0.25*iteration/(w*h)) > 0.111*Math.max(hrun, vrun)) {
                    toCheck.add(picked);
                    [[cx+1, cy], [cx-1, cy], [cx, cy-1], [cx, cy+1]].forEach((pair) => {
                        const h = hash(...pair);
                        if (toFill.has(h)) {
                            neighbours.add(h);
                        }
                    });
                    continue;
                }

                cell.type = CellType.Clue;
            }

            let again = true;
            while (again) {
                again = false;

                for (let i = 0; i < w; i++) {
                    for (let j = 0; j < h; j++) {
                        if (this.board[j][i].type===CellType.Field) continue;
                        const hrun = this.getHorizontalRun(i, j, true);
                        const vrun = this.getVerticalRun(i, j, true);

                        if (hrun?.containedCells.length === 1) {
                            hrun.containedCells.forEach((c) => {
                                c.type = CellType.Clue;
                            });
                            again = true;
                        }

                        if (vrun?.containedCells.length === 1) {
                            vrun.containedCells.forEach((c) => {
                                c.type = CellType.Clue;
                            });
                            again = true;
                        }

                    }
                }
            }

            neighbours.add(initial);
            connected = new Set();
            while (neighbours.size > 0) {
                const picked = Array.from(neighbours)[Math.floor(Math.random() * neighbours.size)];
                neighbours.delete(picked);
                toCheck.delete(picked);

                const coords = unhash(picked);
                const cx = coords[0];
                const cy = coords[1];

                const cell = this.board[cy][cx];

                connected.add(picked);
                [[cx+1, cy], [cx-1, cy], [cx, cy-1], [cx, cy+1]].forEach((pair) => {
                    const h = hash(...pair);
                    if (toCheck.has(h) && this.board[pair[1]][pair[0]].type === CellType.Field) {
                        neighbours.add(h);
                    }
                });
            }

        } while(connected.size < 0.2*(w-1)*(h-1))

        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                if (!connected.has(hash(i, j))) {
                    this.board[j][i].type = CellType.Clue;
                }
            }
        }

        const finalVClues = new Set();
        const finalHClues = new Set();
        for (const h1 of connected) {
            const coords = unhash(h1);
            const cx = coords[0];
            const cy = coords[1];
            const hrun = this.getHorizontalRun(cx, cy, true);
            const vrun = this.getVerticalRun(cx, cy, true);
            const pots = this.board[cy][cx].potentialValues;
            const val = Array.from(pots)[getRandomInt(0, pots.size-1)];
            hrun.containedCells.forEach((c)=>c.potentialValues.delete(val));
            vrun.containedCells.forEach((c)=>c.potentialValues.delete(val));
            finalHClues.add(hrun.clueCell);
            finalVClues.add(vrun.clueCell);
            this.board[cy][cx].value = val;
        }

        for (const c of finalHClues) {
            const run = this.getHorizontalRun(c.positionX, c.positionY, true);
            c.horizontalClue = run.getSum();
        }

        for (const c of finalVClues) {
            const run = this.getVerticalRun(c.positionX, c.positionY, true);
            c.verticalClue = run.getSum();
        }

        for (const h1 of connected) {
            const coords = unhash(h1);
            const cx = coords[0];
            const cy = coords[1];
            this.board[cy][cx].value = 0;
            this.board[cy][cx].potentialValues.clear();
        }


    }
}

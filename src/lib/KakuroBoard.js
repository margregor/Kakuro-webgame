import {combinations, sumSets} from '$lib/combinations.js';
import xml2js from "xml2js";

/**
 * @enum {number}
 * @readonly
 */
export const CellType = {
	Clue: 0,
	Field: 1
};

/**
 * @enum {number}
 * @readonly
 */
export const RunOrientation = {
	HORIZONTAL: 0,
	VERTICAL: 1
};

/**
 * @class
 * @constructor
 * @public
 */
class Cell {
	constructor(type = CellType.Field, values = [], initPotentials = false, position) {
		/**
		 * @type {CellType}
		 */
		this.type = type;

		this.value = 0;
		this.horizontalClue = 0;
		this.verticalClue = 0;
		this.computedSumNumberHorizontal = undefined;
		this.computedSumNumberVertical = undefined;
		this.positionX = position?.[0];
		this.positionY = position?.[1];

		this.horizontalFulfilled = false;
		this.verticalFulfilled = false;

		if (initPotentials)
			/**
			 * @type {Set.<number>}
			 */
			this.potentialValues = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		else this.potentialValues = new Set();

		switch (true) {
			case type === CellType.Field && values.length >= 1:
				this.value = values[0];
				break;
			case type === CellType.Clue && values.length >= 1:
				this.verticalClue = values[0];
				if (values.length >= 2) this.horizontalClue = values[1];
				break;
		}
	}
	switchPotentialValue(val) {
		this.potentialValues.has(val)
			? this.potentialValues.delete(val)
			: this.potentialValues.add(val);
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
			if (c.value <= 0 || c.value >= 10 || encounteredValues.has(c.value)) {
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
				this.clueCell.horizontalFulfilled = this.getSum() === this.targetSum;
				return this.clueCell.horizontalFulfilled;
			case RunOrientation.VERTICAL:
				this.clueCell.verticalFulfilled = this.getSum() === this.targetSum;
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
	getEffectiveSizeAndTarget() {
		let effectiveSize = this.containedCells.length;
		let effectiveTarget = this.targetSum;
		for (const containedCell of this.containedCells) {
			if (containedCell.value !== 0) effectiveSize--;
			effectiveTarget -= containedCell.value;
		}
		return { effectiveSize: effectiveSize, effectiveTarget: effectiveTarget };
	}
	getSetOfPossibles() {
		let { effectiveSize, effectiveTarget } = this.getEffectiveSizeAndTarget();
		if (effectiveSize > 0) return new Set(sumSets[effectiveSize][effectiveTarget]);
		else return new Set();
	}
	getNumberOfEmpty() {
		let n = 0;
		for (const containedCell of this.containedCells) {
			if (containedCell.value === 0) n++;
		}
		return n;
	}
	getEmptyCells() {
		return this.containedCells.filter((cell) => cell.value === 0);
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
			[
				new Cell(CellType.Clue, undefined, false, [0, 0]),
				new Cell(CellType.Clue, [6], false, [1, 0]),
				new Cell(CellType.Clue, [10], false, [2, 0]),
				new Cell(CellType.Clue, undefined, false, [3, 0])
			],
			[
				new Cell(CellType.Clue, [0, 7], false, [0, 1]),
				new Cell(CellType.Field, undefined, false, [1, 1]),
				new Cell(CellType.Field, undefined, false, [2, 1]),
				new Cell(CellType.Clue, [23], false, [3, 1])
			],
			[
				new Cell(CellType.Clue, [0, 11], false, [0, 2]),
				new Cell(CellType.Field, undefined, false, [1, 2]),
				new Cell(CellType.Field, undefined, false, [2, 2]),
				new Cell(CellType.Field, undefined, false, [3, 2])
			],
			[
				new Cell(CellType.Clue, [0, 14], false, [0, 3]),
				new Cell(CellType.Field, undefined, false, [1, 3]),
				new Cell(CellType.Field, undefined, false, [2, 3]),
				new Cell(CellType.Field, undefined, false, [3, 3])
			],
			[
				new Cell(CellType.Clue, undefined, false, [0, 4]),
				new Cell(CellType.Clue, [0, 7], false, [1, 4]),
				new Cell(CellType.Field, undefined, false, [2, 4]),
				new Cell(CellType.Field, undefined, false, [3, 4])
			]
		];
	}

	addRow() {
		this.board.push([]);
		for (let i = 0; i < this.width; i++) {
			this.board[this.height].push(
				new Cell(i ? CellType.Field : CellType.Clue, undefined, false, [i, this.height])
			);
		}
		this.height++;
	}
	removeRow() {
		this.height--;
		this.board.pop();
	}
	addColumn() {
		for (let i = 0; i < this.height; i++) {
			this.board[i].push(
				new Cell(i ? CellType.Field : CellType.Clue, undefined, false, [this.width, i])
			);
		}
		this.width++;
	}
	removeColumn() {
		for (let i = 0; i < this.height; i++) {
			this.board[i].pop();
		}
		this.width--;
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
			return this.getVerticalRun(x, y - 1, allowZeroClue);
		} else {
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
	getHorizontalRun(x, y, allowZeroClue = false) {
		if (x < 0) return null;
		if (this.board[y][x].type === CellType.Field) {
			return this.getHorizontalRun(x - 1, y, allowZeroClue);
		} else {
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
			if (vvals.has(this.board[y][x].value)) return false;
			else vvals.add(this.board[y][x].value);
		y = startY;
		while (this.board[--y]?.[x]?.type === CellType.Field)
			if (vvals.has(this.board[y][x].value)) return false;
			else vvals.add(this.board[y][x].value);
		y = startY;
		while (this.board[y]?.[++x]?.type === CellType.Field)
			if (hvals.has(this.board[y][x].value)) return false;
			else hvals.add(this.board[y][x].value);
		x = startX;
		while (this.board[y]?.[--x]?.type === CellType.Field)
			if (hvals.has(this.board[y][x].value)) return false;
			else hvals.add(this.board[y][x].value);

		return { horizontal: hvals, vertical: vvals };
	}
	checkSolution() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.board[y][x].type === CellType.Field) continue;
				let run = this.getHorizontalRun(x, y);
				if (run !== null) if (!run.checkFullfillment()) return false;

				run = this.getVerticalRun(x, y);
				if (run !== null) if (!run.checkFullfillment()) return false;
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
				if (run !== null) if (!run.checkFullfillment()) ret = false;

				run = this.getVerticalRun(x, y);
				if (run !== null) if (!run.checkFullfillment()) ret = false;
			}
		}
		return ret;
	}

	/**
	 * @param f {function(Cell)}
	 */
	forEveryCell(f) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (f(this.board[y][x])) return;
			}
		}
	}
	/**
	 * @param f {function(Cell)}
	 */
	forEveryField(f) {
		this.forEveryCell((cell) => {
			if (cell.type === CellType.Field) {
				return f(cell);
			}
		});
	}
	/**
	 * @param f {function(Cell)}
	 */
	forEveryClue(f) {
		this.forEveryCell((cell) => {
			if (cell.type === CellType.Clue) {
				return f(cell);
			}
		});
	}
	/**
	 * @param f {function(Run)}
	 */
	forEveryRun(f) {
		this.forEveryClue((cell) => {
			for (const run of [
				this.getHorizontalRun(cell.positionX, cell.positionY),
				this.getVerticalRun(cell.positionX, cell.positionY)
			]) {
				if (run) {
					const res = f(run);
					if (res) return res;
				}
			}
		});
	}
	intersectionDL() {
		let ret = false;

		this.forEveryField((cell) => {
			for (const run of [
				this.getHorizontalRun(cell.positionX, cell.positionY),
				this.getVerticalRun(cell.positionX, cell.positionY)
			]) {
				if (run !== null) {
					const possibles = run.getSetOfPossibles();
					for (const cell of run.containedCells) {
						for (const potential of cell.potentialValues) {
							if (!possibles.has(potential)) {
								ret = cell.potentialValues.delete(potential) || ret;
							}
						}
					}
				}
			}
		});

		return ret;
	}
	searchForSolved() {
		let ret = false;

		let again = true;
		while (again) {
			again = false;
			this.forEveryField((cell) => {
				if (cell.potentialValues.size < 1 && cell.value === 0) {
					ret = false;
					return true;
				}
				if (cell.potentialValues.size === 1 && cell.value === 0) {
					cell.value = Array.from(cell.potentialValues)[0];
					ret = true;
					for (const run of [
						this.getHorizontalRun(cell.positionX, cell.positionY, true),
						this.getVerticalRun(cell.positionX, cell.positionY, true)
					]) {
						if (run !== null) {
							for (const containedCell of run.containedCells) {
								if (containedCell !== cell) {
									if (containedCell.potentialValues.delete(cell.value)) {
										again = true;
									}
								}
							}
						}
					}
				}
			});
		}

		return ret;
	}

	sumViabilityDL() {
		let ret = false;
		const canFormSum = (startIndex, cells, target, viableDigits, chosenNums) => {
			if (cells.length-1 === startIndex) {
				if (!chosenNums.has(target) && cells[startIndex].potentialValues.has(target)) {
					viableDigits.get(cells[startIndex]).add(target);
					viableDigits.sumCount++;
					return true;
				}
				return false;
			}
			let ret2 = false;
			for (const potentialValue of cells[startIndex].potentialValues) {
				if (chosenNums.has(potentialValue)) continue;
				chosenNums.add(potentialValue);
				const res = canFormSum(startIndex+1, cells, target-potentialValue, viableDigits, chosenNums);
				chosenNums.delete(potentialValue);
				if (res) {
					viableDigits.get(cells[startIndex]).add(potentialValue);
					ret2 = true;
				}
			}
			return ret2;
		};
		this.forEveryRun((run)=>{
			const emptyCells = run.getEmptyCells();
			if (emptyCells.length >0 && emptyCells.length <= 9) {
				/**
				 * @type {Map<Cell, Set<number>>}
				 */
				const viableDigits = new Map();
				for (const emptyCell of emptyCells) {
					viableDigits.set(emptyCell, new Set());
				}
				viableDigits.sumCount = 0;
				const chosenNums = new Set();
				canFormSum(0, emptyCells, run.getEffectiveSizeAndTarget().effectiveTarget, viableDigits, chosenNums);

				for (const entry of viableDigits) {
					run.orientation===RunOrientation.HORIZONTAL
						?
						entry[0].computedSumNumberHorizontal = viableDigits.sumCount
						:
						entry[0].computedSumNumberVertical = viableDigits.sumCount;
					for (const potentialValue of entry[0].potentialValues) {
						if (!entry[1].has(potentialValue)) {
							entry[0].potentialValues.delete(potentialValue);
							ret = true;
						}
					}
				}
			}
		});

		return ret;
	}

	initializePossibleValues() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.board[y][x].potentialValues.clear();
				if (this.board[y][x].type !== CellType.Field) continue;
				for (let i = 1; i <= 9; i++) {
					this.board[y][x].potentialValues.add(i);
				}
			}
		}
		this.forEveryClue((cell) => {
			for (const run of [
				this.getHorizontalRun(cell.positionX, cell.positionY, true),
				this.getVerticalRun(cell.positionX, cell.positionY, true  )
			]) {
				if (run !== null) {
					for (const containedCell of run.containedCells) {
						for (const containedCell1 of run.containedCells) {
							containedCell.potentialValues.delete(containedCell1.value);
						}
					}
				}
			}
		});
	}
	clearClues() {
		this.forEveryClue((cell) => {
			cell.horizontalClue = 0;
			cell.verticalClue = 0;
		});
	}

	async refineGenerated(refreshFunc, timeStep) {


		do {
			this.clear();
			if (!await this.solvePure(null, null, true)) {
				this.clearClues();
				this.clear();
				this.initializePossibleValues();
				this.randomlyFill();
				continue;
			}

			this.clearClues();

			this.forEveryField((cell) => {
				cell.potentialValues.clear();
			});
			this.initializePossibleValues();

			if (!this.randomlyFill()) {
				this.clearClues();
				this.clear();
				this.initializePossibleValues();
				this.randomlyFill();
				continue;
			}
			if (!await this.solvePure(null, null, true)) {
				this.clearClues();
				this.clear();
				this.initializePossibleValues();
				this.randomlyFill();
				continue;
			}

			if (refreshFunc) await refreshFunc();
			if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
			if (refreshFunc && !timeStep) alert();
		} while(!this.checkSolution())

		this.clear();

		return true;
	}

	getState() {
		const ret = {possibles: [], values: []};
		this.forEveryField((cell)=> {
			ret.values.push(cell.value);
			ret.possibles.push(Array.from(cell.potentialValues));
		});
		return ret;
	}

	/**
	 * @param {Object<Array<Array<number>>,Array<number>>} state
	 */
	setState(state) {
		const myStateValues = [...state.values];
		myStateValues.reverse();
		const myStatePossibles = [...state.possibles]
		myStatePossibles.reverse();
		this.forEveryField((cell)=> {
			cell.value = myStateValues.pop();
			cell.potentialValues.clear();
			myStatePossibles.pop().forEach((n)=>cell.potentialValues.add(n));
		});
	}

	/**
	 * @param refreshFunc
	 * @param timeStep
	 * @param initializePotentials
	 * @returns {Promise<boolean>} false if no solution exists, otherwise true
	 */
	async solvePure(refreshFunc, timeStep, initializePotentials = true) {
		if (initializePotentials) this.initializePossibleValues();

		let again;
		do {
			again = this.intersectionDL() || this.sumViabilityDL();
			if (!again) break;
			// if (refreshFunc) await refreshFunc();
			// if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
			// alert();
		} while (this.searchForSolved() || again);

		let ret = true;
		this.forEveryField((cell)=>{
				if (cell.value===0 && cell.potentialValues.size === 0) {
					ret = false;
					return true;
				}
			}
		);

		return ret;
	}

	clear() {
		this.forEveryCell((cell)=>{
			cell.potentialValues.clear();
			cell.value=0;
			cell.horizontalFulfilled=false;
			cell.verticalFulfilled=false;
		})
	}

	checkValidity() {
		let ret = true;
		this.forEveryRun((run) =>{
			if (run.getEmptyCells().length<=0 && !run.checkFullfillment()) {
				ret = false;
				return true;
			}
		});
		return ret;

	}

	async solveStackBased(refreshFunc, timeStep, cellSelection) {
		if (!await this.solvePure(refreshFunc, timeStep, true)) return false;
		if (this.checkSolution()) return true;

		const stateStack = [];
		stateStack.push(this.getState());

		if (refreshFunc) await refreshFunc();
		if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
		if (refreshFunc && !timeStep) alert();

		while (stateStack.length>0) {
			const currentState = stateStack.pop();
			this.setState(currentState);

			let chosenCell = null;
			let minPossibles = Infinity;
			let minSumCombinations = Infinity;


			if (cellSelection) {
				this.forEveryField((cell) => {
					if (cell.value === 0 && cell.potentialValues.size < minPossibles) {
						chosenCell = cell;
						minPossibles = cell.potentialValues.size;
					}
				});
			}
			else {
				this.forEveryField((cell) => {
					if (cell.value === 0 && Math.min(cell.computedSumNumberHorizontal, cell.computedSumNumberVertical) <= minSumCombinations) {
						if (Math.min(cell.computedSumNumberHorizontal, cell.computedSumNumberVertical) < minSumCombinations) {
							minSumCombinations = Math.min(cell.computedSumNumberHorizontal, cell.computedSumNumberVertical);
							minPossibles = cell.potentialValues.size;
							chosenCell = cell;
						} else if (cell.potentialValues.size < minPossibles) {
							chosenCell = cell;
							minPossibles = cell.potentialValues.size;
						}
					}
				});
			}
			if (!chosenCell) continue;
			if (chosenCell.potentialValues.size === 0) continue;
			if (chosenCell.potentialValues.size === 1) {
				chosenCell.value = Array.from(chosenCell.potentialValues)[0];
			}
			let chosenValue = Array.from(chosenCell.potentialValues)[0];
			chosenCell.potentialValues.clear();
			chosenCell.potentialValues.add(chosenValue);

			if (refreshFunc) await refreshFunc();
			if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
			if (refreshFunc && !timeStep) alert();

			if (!await this.solvePure(refreshFunc, timeStep, false) || !this.checkValidity()) {
				if (refreshFunc) await refreshFunc();
				if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
				if (refreshFunc && !timeStep) alert();

				this.setState(currentState);
				chosenCell.potentialValues.delete(chosenValue);
				if (chosenCell.potentialValues.size > 0) stateStack.push(this.getState());
			}
			else if (!this.checkSolution()) {
				const tmp = this.getState();
				this.setState(currentState);
				chosenCell.potentialValues.delete(chosenValue);
				if (chosenCell.potentialValues.size > 0) {
					stateStack.push(this.getState());
				}
				stateStack.push(tmp);
			}
			else {
				return true;
			}

			console.log(stateStack.length, stateStack)
			if (refreshFunc) await refreshFunc();
			if (timeStep) await new Promise((r) => setTimeout(r, timeStep));
			if (refreshFunc && !timeStep) alert();
		}
		return this.checkSolution();
	}

	randomlyFill() {
		const finalVClues = new Set();
		const finalHClues = new Set();

		this.forEveryField((cell)=>{
			const cx = cell.positionX;
			const cy = cell.positionY;
			const hrun = this.getHorizontalRun(cx, cy, true);
			const vrun = this.getVerticalRun(cx, cy, true);
			finalHClues.add(hrun.clueCell);
			finalVClues.add(vrun.clueCell);
			if (cell.value!==0) return;
			const pots = this.board[cy][cx].potentialValues;
			const val = Array.from(pots)[getRandomInt(0, pots.size - 1)];
			hrun.containedCells.forEach((c) => c.potentialValues.delete(val));
			vrun.containedCells.forEach((c) => c.potentialValues.delete(val));
			this.board[cy][cx].value = val;
		});

		for (const c of finalHClues) {
			const run = this.getHorizontalRun(c.positionX, c.positionY, true);
			c.horizontalClue = run.getSum();
		}

		for (const c of finalVClues) {
			const run = this.getVerticalRun(c.positionX, c.positionY, true);
			c.verticalClue = run.getSum();
		}

		if (!this.checkSolution()) return false;

		this.forEveryField((cell)=>{
			cell.potentialValues.clear();
			cell.value = 0;
		});

		return true;
	}

	async generateRandom(w, h, refreshFunc, timeStep) {
		if (w < 3 || h < 3) return;
		let connected;
		const hash = (x, y) => x * Math.max(100, w + 1, h + 1) + y;
		const unhash = (v) => [
			Math.floor(v / Math.max(100, w + 1, h + 1)),
			v % Math.max(100, w + 1, h + 1)
		];
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
			const initial = Array.from(toFill)[Math.floor(Math.random() * toFill.size)];
			neighbours.add(initial);

			let iteration = 0;
			const toCheck = new Set();
			while (neighbours.size > 0) {
				const picked = Array.from(neighbours)[Math.floor(Math.random() * neighbours.size)];
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

				if (
					iteration === 1 ||
					hrun === 2 ||
					vrun === 2 ||
					Math.random() - (0.25 * iteration) / (w * h) > 0.111 * Math.max(hrun, vrun)
				) {
					toCheck.add(picked);
					[
						[cx + 1, cy],
						[cx - 1, cy],
						[cx, cy - 1],
						[cx, cy + 1]
					].forEach((pair) => {
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
						if (this.board[j][i].type === CellType.Field) continue;
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
				[
					[cx + 1, cy],
					[cx - 1, cy],
					[cx, cy - 1],
					[cx, cy + 1]
				].forEach((pair) => {
					const h = hash(...pair);
					if (toCheck.has(h) && this.board[pair[1]][pair[0]].type === CellType.Field) {
						neighbours.add(h);
					}
				});
			}
		} while (connected.size < 0.2 * (w - 1) * (h - 1));

		for (let i = 0; i < w; i++) {
			for (let j = 0; j < h; j++) {
				if (!connected.has(hash(i, j))) {
					this.board[j][i].type = CellType.Clue;
				}
			}
		}

		if (!this.randomlyFill()) return true;
	}
}

export function boardToXml(obj){
	let board = [];
	let row = [];
	for (let y = 0; y < obj.height; y++) {
		for (let x = 0; x < obj.width; x++) {
			if(obj.board[y][x].type === CellType.Clue) {
				row.push({
					type: CellType.Clue,
					horizontalClue: obj.board[y][x].horizontalClue,
					verticalClue: obj.board[y][x].verticalClue
				});
			}else if(obj.board[y][x].type === CellType.Field){
				row.push({
					type: CellType.Field,
				});
			}
		}
		board.push({cell: row});
		row=[];
	}
	const xmlBuilder = new xml2js.Builder();

	return xmlBuilder.buildObject({board: board, width: obj.width, height: obj.height});
}


export function XmlToBoard(xml){
	const xmlParser = new xml2js.Parser();

	const board = new KakuroBoard();

	xmlParser.parseString(xml, (err, result) => {
		if (err) {
			return board;
		} else {
			//console.log(result);
			board.board = [];
			board.width = result.root.width[0];
			board.height = result.root.height[0];
			let row = [];
			let type;
			let horizontal;
			let vertical;
			for(let i = 0; i < board.height; i++){
				for(let j = 0; j < board.width; j++) {
					type = parseInt(result.root.board[i].cell[j].type)
					if(type === CellType.Clue){
						vertical = parseInt(result.root.board[i].cell[j].verticalClue);
						horizontal = parseInt(result.root.board[i].cell[j].horizontalClue);
						row.push(new Cell(CellType.Clue, [vertical, horizontal], false, [j,i]));
					}else{
						let cell = new Cell(CellType.Field, undefined, false, [j, i]);
						row.push(cell);
					}
				}
				board.board.push(row);
				row=[];
			}
		}
	});
	return board;
}

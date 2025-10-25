<script>
	import { KakuroBoard, CellType } from '$lib/KakuroBoard.js';
	import tippy from 'tippy.js';
	import 'tippy.js/dist/tippy.css';
	import 'tippy.js/themes/material.css';
	import { combinations } from '$lib/combinations.js';

	export let board = new KakuroBoard();
	export let inputtingHints = false;
	export let complete = false;
	export let tabNavigable = true;
	export let editing = false;

	const focusKeeper = { use: false, rowIndex: -1, columnIndex: -1 };

	function handleFieldKeydown(event, rowIndex, columnIndex) {
		if (event.code === 'Tab') return;

		//zmiana pola na czarne
		if (editing && event.code === 'KeyC') {
			board.board[rowIndex][columnIndex].potentialValues.clear();
			board.board[rowIndex][columnIndex].value = 0;
			board.board[rowIndex][columnIndex].horizontalClue = 0;
			board.board[rowIndex][columnIndex].verticalClue = 0;
			board.board[rowIndex][columnIndex].type = CellType.Clue;
			focusKeeper.use = true;
			focusKeeper.rowIndex = rowIndex;
			focusKeeper.columnIndex = columnIndex;
			return;
		}

		//zmiana zaznaczonego pola przez klawisze strzałek
		if (event.key.length >= 7) {
			let toFocus;

			switch (event.code.slice(5)) {
				case 'Up':
					// noinspection JSAssignmentUsedAsCondition
					if ((toFocus = document.getElementById('input' + columnIndex + 'x' + (rowIndex - 1))))
						toFocus.focus();
					else if (
						(toFocus = document.getElementById('vclue' + columnIndex + 'x' + (rowIndex - 1)))
					)
						toFocus.focus();
					break;
				case 'Down':
					// noinspection JSAssignmentUsedAsCondition
					if ((toFocus = document.getElementById('input' + columnIndex + 'x' + (rowIndex + 1))))
						toFocus.focus();
					else if (
						(toFocus = document.getElementById('hclue' + columnIndex + 'x' + (rowIndex + 1)))
					)
						toFocus.focus();
					break;
				case 'Left':
					// noinspection JSAssignmentUsedAsCondition
					if ((toFocus = document.getElementById('input' + (columnIndex - 1) + 'x' + rowIndex)))
						toFocus.focus();
					else if (
						(toFocus = document.getElementById('hclue' + (columnIndex - 1) + 'x' + rowIndex))
					)
						toFocus.focus();
					break;
				case 'Right':
					// noinspection JSAssignmentUsedAsCondition
					if ((toFocus = document.getElementById('input' + (columnIndex + 1) + 'x' + rowIndex)))
						toFocus.focus();
					else if (
						(toFocus = document.getElementById('vclue' + (columnIndex + 1) + 'x' + rowIndex))
					)
						toFocus.focus();
					break;
				default:
					break;
			}
		}
		//przełączenie trybu wpisywania cyfr pomocniczych na klawiaturze telefonu
		if (event.key === 'Unidentified' || event.key === '-') {
			inputtingHints = !inputtingHints;
			event.preventDefault();
			return;
		}
		const fKeyRe = new RegExp('^F\\d\\d?$');
		if (!fKeyRe.test(event.code)) event.preventDefault();
		if (event.repeat) return;

		//włączenie trybu wpisywania cyfr pomocniczych
		if (event.key === 'Alt' || event.key === 'Control' || event.key === 'Shift') {
			inputtingHints = true;
			return;
		}
		//usunięcie wartości w polu
		if (event.code === 'Backspace' || event.code === 'Delete' || event.keyCode === 8) {
			if (board.board[rowIndex][columnIndex].value === 0) {
				board.board[rowIndex][columnIndex].potentialValues.clear();
			}
			board.board[rowIndex][columnIndex].value = 0;
			event.currentTarget.value = '';
			board.getHorizontalRun(columnIndex, rowIndex)?.checkFullfillment();
			board.getVerticalRun(columnIndex, rowIndex)?.checkFullfillment();
			complete = board.checkSolution();
			return;
		}

		//wpisanie wartości
		const digitRe = new RegExp('^(Digit|Numpad)\\d$');
		let value;
		if (digitRe.test(event.code)) value = parseInt(event.code.slice(-1));
		else value = parseInt(event.key);

		if (!isNaN(value) && value > 0) {
			if (inputtingHints) {
				board.board[rowIndex][columnIndex].switchPotentialValue(value);
				board.board[rowIndex][columnIndex].value = 0;
				event.currentTarget.value = '';
			} else {
				board.board[rowIndex][columnIndex].value = value;
				event.currentTarget.value = value;
				board.getHorizontalRun(columnIndex, rowIndex)?.checkFullfillment();
				board.getVerticalRun(columnIndex, rowIndex)?.checkFullfillment();
				complete = board.checkSolution();
			}
		}
	}

	// noinspection JSUnusedLocalSymbols
	function handleFieldKeyup(event, rowIndex, cellIndex) {
		event.preventDefault();
		if (event.repeat) return;
		if (event.key === 'Alt' || event.key === 'Control' || event.key === 'Shift') {
			inputtingHints = false;
		}
	}

	export let showTooltipHints = true;

	function tooltip(node, options) {
		if (!showTooltipHints || !options.content) return;

		const tooltip = tippy(node, options);

		// noinspection JSUnusedGlobalSymbols
		return {
			update(options) {
				tooltip.setProps(options);
			},
			destroy() {
				tooltip.destroy();
			}
		};
	}

	function keepFocus(node, coords) {
		if (
			focusKeeper.use &&
			focusKeeper.rowIndex === coords.rowIndex &&
			focusKeeper.columnIndex === coords.columnIndex
		) {
			node.focus();
		}
		focusKeeper.use = false;
	}

	function handleClueKeydown(event, rowIndex, columnIndex, vertical) {
		if (event.code === 'Tab') return;
		event.preventDefault();
		let horizontal = !vertical;
		if (editing && event.code === 'KeyF') {
			board.board[rowIndex][columnIndex].potentialValues.clear();
			board.board[rowIndex][columnIndex].value = 0;
			board.board[rowIndex][columnIndex].horizontalClue = 0;
			board.board[rowIndex][columnIndex].verticalClue = 0;
			board.board[rowIndex][columnIndex].type = CellType.Field;
			focusKeeper.use = true;
			focusKeeper.rowIndex = rowIndex;
			focusKeeper.columnIndex = columnIndex;
			return;
		}
		if (editing && event.code === 'KeyE') {
			const result = Number(window.prompt('Type a number', event.srcElement.textContent));
			if (!isNaN(result) && result >= 0 && result <= 45) {
				if (horizontal) board.board[rowIndex][columnIndex].horizontalClue = result;
				else board.board[rowIndex][columnIndex].verticalClue = result;
			}
			return;
		}
		if (event.key.length >= 7) {
			let toFocus;

			switch (event.code.slice(5)) {
				case 'Up':
					// noinspection JSAssignmentUsedAsCondition
					if (horizontal) {
						if ((toFocus = document.getElementById('input' + columnIndex + 'x' + (rowIndex - 1))))
							toFocus.focus();
						else if (
							(toFocus = document.getElementById('vclue' + columnIndex + 'x' + (rowIndex - 1)))
						)
							toFocus.focus();
					} else {
						if ((toFocus = document.getElementById('hclue' + columnIndex + 'x' + rowIndex)))
							toFocus.focus();
					}
					break;
				case 'Down':
					// noinspection JSAssignmentUsedAsCondition
					if (vertical) {
						if ((toFocus = document.getElementById('input' + columnIndex + 'x' + (rowIndex + 1))))
							toFocus.focus();
						else if (
							(toFocus = document.getElementById('hclue' + columnIndex + 'x' + (rowIndex + 1)))
						)
							toFocus.focus();
					} else {
						if ((toFocus = document.getElementById('vclue' + columnIndex + 'x' + rowIndex)))
							toFocus.focus();
					}
					break;
				case 'Left':
					// noinspection JSAssignmentUsedAsCondition
					if (vertical) {
						if ((toFocus = document.getElementById('input' + (columnIndex - 1) + 'x' + rowIndex)))
							toFocus.focus();
						else if (
							(toFocus = document.getElementById('hclue' + (columnIndex - 1) + 'x' + rowIndex))
						)
							toFocus.focus();
					} else {
						if ((toFocus = document.getElementById('vclue' + columnIndex + 'x' + rowIndex)))
							toFocus.focus();
					}
					break;
				case 'Right':
					// noinspection JSAssignmentUsedAsCondition
					if (horizontal) {
						if ((toFocus = document.getElementById('input' + (columnIndex + 1) + 'x' + rowIndex)))
							toFocus.focus();
						else if (
							(toFocus = document.getElementById('vclue' + (columnIndex + 1) + 'x' + rowIndex))
						)
							toFocus.focus();
					} else {
						if ((toFocus = document.getElementById('hclue' + columnIndex + 'x' + rowIndex)))
							toFocus.focus();
					}
					break;
				default:
					break;
			}
		}
	}
</script>

<div class="kakuro-board" style:--board-width={board.width}>
	{#each board.board as row, rowIndex}
		{#each row as cell, columnIndex}
			{#if cell.type === CellType.Field}
				<div class="cell" id="cell{columnIndex}x{rowIndex}">
					<label style="margin-top: -18px;">
						{#if cell.value === 0}
							<svg class="icon" width="40px" height="40px" viewBox="0 -25 100 100">
								{#each cell.potentialValues as val}
									<text
										x={5 + 33 * ((val - 1) % 3)}
										y={5 + 33 * Math.floor((val - 1) / 3)}
										stroke="black"
										font-size="40"
										fill="black"
									>
										{val}
									</text>
								{/each}
							</svg>
						{/if}
						<input
							value={cell.value > 0 ? cell.value : ''}
							tabindex={tabNavigable ? '0' : '-1'}
							id="input{columnIndex}x{rowIndex}"
							use:keepFocus={{ columnIndex: columnIndex, rowIndex: rowIndex }}
							type="number"
							on:keydown={(event) => handleFieldKeydown(event, rowIndex, columnIndex)}
							on:keyup={(event) => handleFieldKeyup(event, rowIndex, columnIndex)}
							on:input={(e) => (e.currentTarget.value = cell.value ? cell.value : '')}
						/>
					</label>
				</div>
			{:else}
				<div class="cell clue" id="cell{columnIndex}x{rowIndex}">
					<svg width="40px" height="40px" viewBox="0 0 100 100" id="clue{columnIndex}x{rowIndex}">
						<line
							x1="0"
							y1="0"
							x2="100"
							y2="100"
							stroke="white"
							stroke-width="3px"
							stroke-linecap="square"
						/>
						{#if cell.horizontalFulfilled}
							<polygon points="0,0 100,0 100,100" fill="green" />
						{/if}
						{#if cell.verticalFulfilled}
							<polygon points="0,0 0,100 100,100" fill="green" />
						{/if}
						{#key showTooltipHints}
							{#if cell.verticalClue > 0 || editing}
								<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
								<text
									on:keydown={(e) => handleClueKeydown(e, rowIndex, columnIndex, true)}
									inputmode="decimal"
									role="textbox"
									id="vclue{columnIndex}x{rowIndex}"
									x="5"
									y="95"
									stroke="white"
									font-size="50"
									fill="white"
									tabindex={(tabNavigable && showTooltipHints) || editing ? '0' : '-1'}
									use:tooltip={{
										allowHTML: true,
										content:
											combinations[
												board.getVerticalRun(columnIndex, rowIndex)?.containedCells.length
											]?.[cell.verticalClue],
										theme: 'material'
									}}
								>
									{cell.verticalClue}
								</text>
							{/if}
							{#if cell.horizontalClue > 0 || editing}
								<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
								<text
									on:keydown={(e) => handleClueKeydown(e, rowIndex, columnIndex, false)}
									role="textbox"
									id="hclue{columnIndex}x{rowIndex}"
									x="95"
									y="40"
									stroke="white"
									font-size="50"
									fill="white"
									text-anchor="end"
									use:keepFocus={{ columnIndex: columnIndex, rowIndex: rowIndex }}
									tabindex={(tabNavigable && showTooltipHints) || editing ? '0' : '-1'}
									use:tooltip={{
										allowHTML: true,
										content:
											combinations[
												board.getHorizontalRun(columnIndex, rowIndex)?.containedCells.length
											]?.[cell.horizontalClue],
										theme: 'material'
									}}
								>
									{cell.horizontalClue}
								</text>
							{/if}
						{/key}
					</svg>
				</div>
			{/if}
		{/each}
	{/each}
</div>

<style>
	.kakuro-board {
		display: grid;
		grid-template-columns: repeat(var(--board-width), 1fr);
		grid-gap: 0;
	}

	.cell {
		width: 40px;
		height: 40px;
		text-align: center;
		line-height: 40px;
		font-size: 20px;
		border: 1px solid #ccc;
	}

	.cell.clue {
		background: black;
	}

	input[type='number'] {
		width: 90%;
		height: 95%;
		border: none;
		text-align: center;
		font-size: 35px;
		appearance: textfield;
		caret-color: transparent;
		-moz-appearance: textfield;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	label {
		position: relative;
	}

	.icon {
		position: absolute;
		display: inline-block;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
</style>

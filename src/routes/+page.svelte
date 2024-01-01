<script>
	import KakuroBoardView from '$lib/KakuroBoardView.svelte';
	import {boardToXml, XmlToBoard} from "$lib/KakuroBoard.js";

	let showingHints = true;
	let pencilMarking = false;
	let complete = false;
	let editing = false;

	let currentBoard;

	let generateWidth = 3;
	let generateHeight = 3;

	async function refreshBoard() {
		currentBoard = currentBoard;
	}
	async function generateNewBoard(e) {
		e.srcElement.disabled = true;
		while(await currentBoard.generateRandom(generateWidth, generateHeight, null, null)){};
		currentBoard.checkSolutionAll()
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}

	async function solveBoard(e) {
		e.srcElement.disabled = true;

		// currentBoard.clear();
		// console.time('newMethod');
		// await currentBoard.solveStackBased(refreshBoard, 1, false);
		// console.timeEnd('newMethod');

		currentBoard.clear();
		console.time('basicMethod');
		await currentBoard.solveStackBased(refreshBoard, 1, true);
		console.timeEnd('basicMethod');

		complete = currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}

	async function solveBoardPure(e) {
		e.srcElement.disabled = true;
		await currentBoard.solvePure(refreshBoard, 1);
		complete = currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}
	async function refineBoard(e) {
		e.srcElement.disabled = true;

		await currentBoard.refineGenerated(refreshBoard, 1);

		complete=false;
		currentBoard=currentBoard;
		e.srcElement.disabled = false;
	}
</script>

<div>
	<p>
		<label>
			<input type="checkbox" bind:checked={showingHints} />
			Show hint tooltips
		</label>
	</p>
	<p>
		<label>
			<input type="checkbox" bind:checked={pencilMarking} />
			Input pencil marks
		</label>
	</p>
	<p>
		<label>
			<input type="checkbox" bind:checked={editing} />
			Editing
		</label>
		{#if editing}
			<button
				disabled={currentBoard.height >= 40}
				on:click={() => {
					currentBoard.addRow();
					currentBoard = currentBoard;
				}}
			>
				Add row
			</button>
			<button
				disabled={currentBoard.width >= 40}
				on:click={() => {
					currentBoard.addColumn();
					currentBoard = currentBoard;
				}}
			>
				Add column
			</button>
			<button
				disabled={currentBoard.height <= 3}
				on:click={() => {
					currentBoard.removeRow();
					currentBoard = currentBoard;
				}}
			>
				Remove row
			</button>
			<button
				disabled={currentBoard.width <= 3}
				on:click={() => {
					currentBoard.removeColumn();
					currentBoard = currentBoard;
				}}
			>
				Remove column
			</button>
			Current size: {currentBoard.width}x{currentBoard.height}
		{/if}
	</p>
	<div>
		<label>
			Width
			<input bind:value={generateWidth} type="range" min="3" max="40" />
		</label>
		<label>
			Height
			<input bind:value={generateHeight} type="range" min="3" max="40" />
		</label>
	</div>
	<button on:click={generateNewBoard}>Generate new {generateWidth} by {generateHeight} board</button>
	<button on:click={solveBoard}>Try solve</button>
	<button on:click={solveBoardPure}>Try solve pure</button>
	<button on:click={()=>{currentBoard.clear();complete=false;currentBoard=currentBoard;}}>Clear board</button>
	<button on:click={(e)=>{refineBoard(e)}}>Refine</button>
	<button on:click={()=>{
		localStorage.setItem("savedBoard", boardToXml(currentBoard))
	}}>Save board to local storage</button>
	<button on:click={()=>{
		const toLoad = localStorage.getItem("savedBoard");
		if (toLoad) currentBoard = XmlToBoard(toLoad);
	}}>Load board from local storage</button>

	<span> {@html complete ? 'You did it!' : '<br/>'} </span>

	<div>
		<KakuroBoardView
			bind:board={currentBoard}
			showTooltipHints={showingHints}
			bind:inputtingHints={pencilMarking}
			bind:complete
			{editing}
		/>
		{#if editing}
			c - change field to clue<br />
			f - change clue to field<br />
			e - edit target sums in clue<br />
		{/if}
	</div>
</div>

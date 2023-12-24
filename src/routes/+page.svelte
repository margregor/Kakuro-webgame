<script>
	import KakuroBoardView from '$lib/KakuroBoardView.svelte';

	let showingHints = true;
	let pencilMarking = false;
	let complete = false;

	let currentBoard;

	let width = 3;
	let height = 3;

	async function refreshBoard() {
		currentBoard = currentBoard;
	}
	async function generateNewBoard(e) {
		e.srcElement.disabled = true;
		await currentBoard.generateRandom(width, height, null, 0);
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}

	async function solveBoard(e) {
		e.srcElement.disabled = true;
		await currentBoard.solvePure();
		currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

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
	<div>
		<label>
			Width
			<input bind:value={width} type="range" min="3" max="40" />
		</label>
		<label>
			Height
			<input bind:value={height} type="range" min="3" max="40" />
		</label>
	</div>
	<button on:click={generateNewBoard}>Generate new {width} by {height} board</button>
	<button on:click={solveBoard}>Try solve</button>

	<span> {@html complete ? 'You did it!' : '<br/>'} </span>

	<div>
		<KakuroBoardView
			bind:board={currentBoard}
			showTooltipHints={showingHints}
			bind:inputtingHints={pencilMarking}
			bind:complete
		/>
	</div>
</div>

<script>
	import KakuroBoardView from '$lib/KakuroBoardView.svelte';

	let showingHints = true;
	let pencilMarking = false;
	let complete = false;
	let editing = false;
	let visualization = false;

	let currentBoard;

	let generateWidth = 3;
	let generateHeight = 3;

	async function refreshBoard() {
		currentBoard = currentBoard;
	}
	async function generateNewBoard(e) {
		e.srcElement.disabled = true;
		if (visualization) {
			while (await currentBoard.generateRandom(generateWidth, generateHeight, refreshBoard, 1)) {}
		} else {
			while (await currentBoard.generateRandom(generateWidth, generateHeight, null, null)) {}
		}
		currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}

	async function solveBoard(e) {
		e.srcElement.disabled = true;

		if (visualization) {
			await currentBoard.solveStackBased(refreshBoard, 1, true);
		} else {
			await currentBoard.solveStackBased(null, null, true);
		}

		complete = currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}

	async function solveBoardPure(e) {
		e.srcElement.disabled = true;
		if (visualization) {
			await currentBoard.solvePure(refreshBoard, 1);
		} else {
			await currentBoard.solvePure(null, null);
		}
		complete = currentBoard.checkSolutionAll();
		currentBoard = currentBoard;

		e.srcElement.disabled = false;
	}
	async function refineBoard(e) {
		e.srcElement.disabled = true;

		if (visualization) {
			await currentBoard.refineGenerated(refreshBoard, 1);
		} else {
			await currentBoard.refineGenerated(null, null);
		}

		complete = false;
		currentBoard = currentBoard;
		e.srcElement.disabled = false;
	}
</script>

<div>
	<p>
		<label>
			<input type="checkbox" bind:checked={showingHints} />
			Pokazuj dymki ze wskazówkami
		</label>
	</p>
	<p>
		<label>
			<input type="checkbox" bind:checked={pencilMarking} />
			Wpisuj cyfry pomocnicze
		</label>
	</p>
	<p>
		<label>
			<input type="checkbox" bind:checked={visualization} />
			Wizualizuj procesy
		</label>
	</p>
	<p>
		<label>
			<input type="checkbox" bind:checked={editing} />
			Edytuj planszę
		</label>
		{#if editing}
			<button
				disabled={currentBoard.height >= 100}
				on:click={() => {
					currentBoard.addRow();
					currentBoard = currentBoard;
				}}
			>
				Dodaj rząd
			</button>
			<button
				disabled={currentBoard.width >= 100}
				on:click={() => {
					currentBoard.addColumn();
					currentBoard = currentBoard;
				}}
			>
				Dodaj kolumnę
			</button>
			<button
				disabled={currentBoard.height <= 3}
				on:click={() => {
					currentBoard.removeRow();
					currentBoard = currentBoard;
				}}
			>
				Usuń rząd
			</button>
			<button
				disabled={currentBoard.width <= 3}
				on:click={() => {
					currentBoard.removeColumn();
					currentBoard = currentBoard;
				}}
			>
				Usuń kolumnę
			</button>
			Obecny rozmiar: {currentBoard.width}x{currentBoard.height}
		{/if}
	</p>
	<div>
		<label>
			Szerokość planszy do wygenerowania
			<input bind:value={generateWidth} type="range" min="3" max="15" />
		</label>
		<label>
			Wysokość planszy do wygenerowania
			<input bind:value={generateHeight} type="range" min="3" max="15" />
		</label>
	</div>
	<button on:click={generateNewBoard}
		>Wygeneruj nową planszę o rozmiarze {generateWidth} na {generateHeight}</button
	>
	<button on:click={solveBoard}>Rozwiąż planszę{visualization ? ' z wizualizacją' : ''}</button>
	<button on:click={solveBoardPure}>Rozwiąż metodami logicznymi</button>
	<button
		on:click={() => {
			currentBoard.clear();
			complete = false;
			currentBoard = currentBoard;
		}}>Wyczyść planszę</button
	>
	<button
		on:click={(e) => {
			refineBoard(e);
		}}>Ogranicz ilość rozwiązań planszy{visualization ? ' z wizualizacją' : ''}</button
	>
	<br />
	<span style="font-size: 2em"> {@html complete ? 'Rozwiązanie poprawne! Brawo!!' : '<br/>'} </span>

	<div>
		<KakuroBoardView
			bind:board={currentBoard}
			showTooltipHints={showingHints}
			bind:inputtingHints={pencilMarking}
			bind:complete
			{editing}
		/>
		{#if editing}
			c - zmień pole na czarne<br />
			f - zmień pole na białe<br />
			e - zmień wartość sumy docelowej<br />
		{/if}
	</div>
</div>

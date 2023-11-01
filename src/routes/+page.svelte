<script>
    import KakuroBoardView from '$lib/KakuroBoardView.svelte';


    let showingHints = true;
    let pencilMarking = false;
    let complete = false;

    let currentBoard;

    async function refreshBoard() {
        currentBoard = currentBoard;
    }
    async function generateNewBoard(e) {

        e.srcElement.disabled = true;
        await currentBoard.generateRandom(15, 15, refreshBoard, 1);
        currentBoard = currentBoard;

        e.srcElement.disabled = false;
    }
</script>

<main>
    <p>
        <label>
            <input type="checkbox" bind:checked={showingHints}>
            Show hint tooltips
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" bind:checked={pencilMarking}>
            Input pencil marks
        </label>
    </p>
    <button on:click={generateNewBoard}>Generate new 10 by 10 board</button>

    <KakuroBoardView bind:board={currentBoard} showTooltipHints={showingHints} bind:inputtingHints={pencilMarking} bind:complete/>
    <span> {@html complete?"You did it!":"<br/>"} </span>

</main>

<style>
    main {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>

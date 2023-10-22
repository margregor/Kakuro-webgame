<script>
    import KakuroBoardView from '$lib/KakuroBoardView.svelte';

    let showingHints = true;
    let pencilMarking = false;
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

    <KakuroBoardView showTooltipHints={showingHints} bind:inputtingHints={pencilMarking}/>
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

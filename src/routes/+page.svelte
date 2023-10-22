<script>
    import KakuroBoardView from '$lib/KakuroBoardView.svelte';

    let showingHints = true;
</script>

<main>
    <p>
        <label>
            <input type="checkbox" bind:checked={showingHints}>
            Show hint tooltips
        </label>
    </p>
    <KakuroBoardView showTooltipHints={showingHints}/>
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

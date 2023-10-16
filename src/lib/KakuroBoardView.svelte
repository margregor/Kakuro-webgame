<script>
    import { KakuroBoard, CellType } from "$lib/KakuroBoard.js";
    let board = new KakuroBoard();

    console.log(board.board);

    function handleFieldInput(event, rowIndex, cellIndex) {
        if (event.inputType === "insertText" || event.inputType === "insertReplacementText")
        {
            const value = parseInt(event.data);
            if (!isNaN(value) && value>0)
            {
                board.board[rowIndex][cellIndex].value = value;
                event.currentTarget.value = value;
            }
            else
            {
                board.board[rowIndex][cellIndex].value = 0;
                event.currentTarget.value = '';
            }
        }
    }
</script>

<style>
    .kakuro-board {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2px;
    }

    .cell {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
        border: 1px solid #ccc;
    }

    .clue {
        width: 40px;
        height: 40px;
        text-align: left;
        line-height: 40px;
        font-size: 20px;
        border: 1px solid #ccc;
        background: black;
    }

    input {
        width: 90%;
        height: 90%;
        border: none;
        text-align: center;
        font-size: 20px;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: textfield;
    }
</style>

<div class="kakuro-board" style="grid-template-columns: repeat({board.height}, 1fr);">
    {#each board.board as row, rowIndex}
        {#each row as cell, cellIndex}
            {#if cell.type === CellType.Field}
            <div class="cell">
                <input
                        type="number"
                        value={cell.value>0?cell.value:''}
                        min="0"
                        max="9"
                        on:input={(event) => handleFieldInput(event, rowIndex, cellIndex)}

                />
            </div>
            {:else}
                <div class="clue">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="white" stroke-width="3px"/>
                        <text x="5" y="95" stroke="white" font-size="50" fill="white">
                            {cell.verticalClue>0?cell.verticalClue:''}
                        </text>
                        <text x="95" y="40" stroke="white" font-size="50" fill="white" text-anchor="end">
                            {cell.horizontalClue>0?cell.horizontalClue:''}
                        </text>
                    </svg>
                </div>
            {/if}
        {/each}
    {/each}
</div>

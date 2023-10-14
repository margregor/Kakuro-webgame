<script>
    let board = [
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', ''],
    ];

    function handleCellInput(event, rowIndex, cellIndex) {
        if (event.inputType === "insertText")
        {
            const value = parseInt(event.data);
            if (!isNaN(value) && value>0)
            {
                board[rowIndex][cellIndex] = value;
                event.currentTarget.value = value;
            }
            else
            {
                board[rowIndex][cellIndex] = '';
                event.currentTarget.value = '';
            }
        }
    }
</script>

<style>
    .sudoku-board {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
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

    input {
        width: 100%;
        height: 100%;
        border: none;
        text-align: center;
        font-size: 20px;
        -webkit-appearance: none;
        -moz-appearance: textfield;
    }
</style>

<div class="sudoku-board">
    {#each board as row, rowIndex}
        {#each row as cell, cellIndex}
            <div class="cell">
                <input
                        type="number"
                        value={cell}
                        min="0"
                        max="9"
                        on:input={(event) => handleCellInput(event, rowIndex, cellIndex)}
                />
            </div>
        {/each}
    {/each}
</div>

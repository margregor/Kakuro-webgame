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
            if (!isNaN(value))
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
        inputmode: numeric;
    }
</style>

<div class="sudoku-board">
    {#each board as row, rowIndex}
        {#each row as cell, cellIndex}
            <div class="cell">
                <input
                        type="text"
                        value={cell}
                        on:input={(event) => handleCellInput(event, rowIndex, cellIndex)}
                />
            </div>
        {/each}
    {/each}
</div>

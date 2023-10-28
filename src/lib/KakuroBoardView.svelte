<script>
    import { KakuroBoard, CellType } from "$lib/KakuroBoard.js";
    import tippy from "tippy.js";
    import 'tippy.js/dist/tippy.css';
    import 'tippy.js/themes/material.css';
    import {combinations} from "$lib/combinations.js";

    let board = new KakuroBoard();
    export let inputtingHints = false;

    let iShiftReleaseTime = Date.now();

    function handleFieldKeydown(event, rowIndex, columnIndex) {
        // console.log(board.board[rowIndex][cellIndex].input);

        //console.log(toFocus = document.getElementById("input"+(columnIndex+1)+"x"+rowIndex));
        if (event.key.length>=7) {
            let toFocus;

            switch (event.key.slice(5)) {
                case "Up":
                    // noinspection JSAssignmentUsedAsCondition
                    if (toFocus = document.getElementById("input"+(columnIndex)+"x"+(rowIndex-1)))
                        toFocus.focus();
                    break;
                case "Down":
                    // noinspection JSAssignmentUsedAsCondition
                    if (toFocus = document.getElementById("input"+(columnIndex)+"x"+(rowIndex+1)))
                        toFocus.focus();
                    break;
                case "Left":
                    // noinspection JSAssignmentUsedAsCondition
                    if (toFocus = document.getElementById("input"+(columnIndex-1)+"x"+(rowIndex)))
                        toFocus.focus();
                    break;
                case "Right":
                    // noinspection JSAssignmentUsedAsCondition
                    if (toFocus = document.getElementById("input"+(columnIndex+1)+"x"+(rowIndex)))
                        toFocus.focus();
                    break;
                default:
                    break;
            }
        }
        if (event.key === "Unidentified" || event.key === "-") {
            inputtingHints = !inputtingHints;
            event.preventDefault();
            return;
        }
        const fKeyRe = new RegExp("^F\\d\\d?$");
        if (!fKeyRe.test(event.code)) event.preventDefault();
        if (event.repeat) return;

        if (event.key === "Control") {
            inputtingHints = true;
            return;
        }
        if (event.key === "Backspace") {
            if (board.board[rowIndex][columnIndex].value === 0) {
                board.board[rowIndex][columnIndex].potentialValues.clear();
            }
            board.board[rowIndex][columnIndex].value = 0;
            event.currentTarget.value = '';
            return;
        }

        const digitRe = new RegExp("^(Digit|Numpad)\\d$");
        let value;
        if (digitRe.test(event.code)) value = parseInt(event.code.slice(-1));
        else value = parseInt(event.key);

        if (!isNaN(value) && value>0)
        {
            if(inputtingHints || (Date.now() - iShiftReleaseTime) < 20) {
                board.board[rowIndex][columnIndex].switchPotentialValue(value);
                board.board[rowIndex][columnIndex].value = 0;
                event.currentTarget.value = '';
            }
            else {
                board.board[rowIndex][columnIndex].value = value;
                event.currentTarget.value = value;
            }
        }
    }

    // noinspection JSUnusedLocalSymbols
    function handleFieldKeyup(event, rowIndex, cellIndex) {
        event.preventDefault();
        if (event.repeat) return;
        if (event.key === "Control") {
            iShiftReleaseTime = Date.now();
            inputtingHints = false;
        }

    }

    export let showTooltipHints = true;

    function tooltip(node, options) {
        if (!showTooltipHints) return;

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
</script>

<style>
    .kakuro-board {
        display: grid;
        grid-template-columns: repeat(var(--board-width), 1fr);
        grid-gap: 0;
        max-width: 40px;
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

    input {
        width: 90%;
        height: 95%;
        border: none;
        text-align: center;
        font-size: 35px;
        appearance: textfield;
        caret-color: transparent;
        -webkit-appearance: none;
        -moz-appearance: textfield;
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

<div class="kakuro-board" style:--board-width={board.width}>
    {#each board.board as row, rowIndex}
        {#each row as cell, columnIndex}
            {#if cell.type === CellType.Field}
            <div class="cell">
                <label class="name-label">
                {#if cell.value===0}
                    <svg class="icon" width="40px" height="40px" viewBox="0 -25 100 100">
                        {#each cell.potentialValues as val}
                        <text x={5+33*((val-1)%3)} y={5+33*Math.floor((val-1)/3)} stroke="black" font-size="40" fill="black">
                            {val}
                        </text>
                        {/each}
                    </svg>
                {/if}

                <input
                        id="input{columnIndex}x{rowIndex}"
                        type="number"
                        value={cell.value>0?cell.value:''}
                        min="1"
                        max="9"
                        maxlength="0"
                        on:keydown={(event) => handleFieldKeydown(event, rowIndex, columnIndex)}
                        on:keyup={(event) => handleFieldKeyup(event, rowIndex, columnIndex)}
                        on:input={(e)=>e.currentTarget.value = cell.value ? cell.value : ''}
                />
                </label>
            </div>
            {:else}
                <div class="cell clue">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <line x1="0" y1="0" x2="100" y2="100" stroke="white" stroke-width="3px"/>

                        {#key showTooltipHints}
                            {#if cell.verticalClue>0}
                            <text x="5" y="95" stroke="white" font-size="50" fill="white"
                                  use:tooltip={{ allowHTML: true, content: combinations[2][cell.verticalClue], theme: 'material' }}>
                                {cell.verticalClue}
                            </text>
                            {/if}

                            {#if cell.horizontalClue>0}
                            <text x="95" y="40" stroke="white" font-size="50" fill="white" text-anchor="end"
                                  use:tooltip={{ allowHTML: true, content: combinations[2][cell.horizontalClue], theme: 'material' }}>
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

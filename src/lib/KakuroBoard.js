export const CellType = {
    Clue: 0,
    Field: 1
}

class Cell {
    constructor(type, values=[]) {
        this.type = CellType.Field;
        this.value = 0;
        this.horizontalClue = 0;
        this.verticalClue = 0;
        this.potentialValues = [];

        this.type = type;
        switch (true) {
            case type===CellType.Field && values.length >= 1:
                this.value = values[0];
                break;
            case type===CellType.Clue && values.length >= 1:
                this.verticalClue = values[0];
                if (values.length >= 2) this.horizontalClue = values[1];
                break;
        }
    }
}

export class KakuroBoard {
    constructor() {
        this.width = 3;
        this.height = 3;
        this.board = [
                      [new Cell(CellType.Clue), new Cell(CellType.Clue, [12]), new Cell(CellType.Clue, [5])],
                      [new Cell(CellType.Clue, [0, 13]), new Cell(CellType.Field), new Cell(CellType.Field)],
                      [new Cell(CellType.Clue, [0, 4]), new Cell(CellType.Field), new Cell(CellType.Field)],
                     ]
    }

}
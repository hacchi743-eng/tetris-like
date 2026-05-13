export class Board {
  width = 10;

  height = 20;

  cells: number[][];

  constructor() {
    this.cells = Array.from(
      { length: this.height },
      () => Array(this.width).fill(0)
    );
  }
}
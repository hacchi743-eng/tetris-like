export class Board {
  width = 15;

  height = 30;

  cells: number[][];

  constructor() {
    this.cells = Array.from(
      { length: this.height },
      () => Array(this.width).fill(0)
    );
  }
}
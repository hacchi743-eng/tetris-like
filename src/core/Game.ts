import { Board } from "./Board";
import { Piece } from "./Piece";

export class Game {
  board = new Board();

  piece = new Piece();

  nextPiece = new Piece();

  gameOver = false;

  fallTimer = 0;

  fallInterval = 500;

  update(delta: number) {
    if (this.gameOver) return;

    this.fallTimer += delta;

    if (this.fallTimer >= this.fallInterval) {
      this.fallTimer = 0;

      this.moveDown();
    }
  }

  moveLeft() {
    if (
      !this.isColliding(
        this.piece,
        -1,
        0
      )
    ) {
      this.piece.x--;
    }
  }

  moveRight() {
    if (
      !this.isColliding(
        this.piece,
        1,
        0
      )
    ) {
      this.piece.x++;
    }
  }

  moveDown() {
    if (
      !this.isColliding(
        this.piece,
        0,
        1
      )
    ) {
      this.piece.y++;

      return;
    }

    this.fixPiece();

    this.clearLines();

    this.spawnPiece();
  }

  rotate() {
    const backup =
      structuredClone(this.piece.shape);

    this.piece.rotate();

    if (
      !this.isColliding(
        this.piece,
        0,
        0
      )
    ) {
      return;
    }

    if (
      !this.isColliding(
        this.piece,
        -1,
        0
      )
    ) {
      this.piece.x--;

      return;
    }

    if (
      !this.isColliding(
        this.piece,
        1,
        0
      )
    ) {
      this.piece.x++;

      return;
    }

    this.piece.shape = backup;
  }

  isColliding(
    piece: Piece,
    offsetX: number,
    offsetY: number
  ) {
    for (const cell of piece.shape) {
      const x =
        piece.x +
        cell.x +
        offsetX;

      const y =
        piece.y +
        cell.y +
        offsetY;

      if (x < 0) return true;

      if (x >= this.board.width)
        return true;

      if (y >= this.board.height)
        return true;

      if (y < 0) continue;

      if (this.board.cells[y][x])
        return true;
    }

    return false;
  }

  fixPiece() {
    for (const cell of this.piece.shape) {
      const x =
        this.piece.x + cell.x;

      const y =
        this.piece.y + cell.y;

      if (
        y >= 0 &&
        y < this.board.height
      ) {
        this.board.cells[y][x] = 1;
      }
    }
  }

  clearLines() {
    this.board.cells =
      this.board.cells.filter(
        (row) =>
          row.some(
            (cell) => cell === 0
          )
      );

    while (
      this.board.cells.length <
      this.board.height
    ) {
      this.board.cells.unshift(
        Array(this.board.width).fill(
          0
        )
      );
    }
  }

  spawnPiece() {
    this.piece = this.nextPiece;

    this.piece.x = 3;
    this.piece.y = 0;

    this.nextPiece = new Piece();

    if (
      this.isColliding(
        this.piece,
        0,
        0
      )
    ) {
      this.gameOver = true;
    }
  }
}
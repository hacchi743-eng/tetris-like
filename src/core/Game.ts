// Game.ts

import { Board } from "./Board";
import { Piece } from "./Piece";

export class Game {
  board = new Board();

  piece = Piece.random();

  nextPiece = Piece.random();

  holdPiece?: Piece;

  canHold = true;

  gameOver = false;

  paused = false;

  score = 0;

  fallTimer = 0;

  speedLevel = 10;

  lastRotate = false;

  get fallInterval() {
    // 1～20段階
    // 数字大きいほど速い

    return (
      1050 - this.speedLevel * 50
    );
  }

  update(delta: number) {
    if (this.gameOver) return;

    if (this.paused) return;

    this.fallTimer += delta;

    if (
      this.fallTimer >=
      this.fallInterval
    ) {
      this.fallTimer = 0;

      this.moveDown();
    }
  }

  setSpeed(level: number) {
    this.speedLevel = Math.max(
      1,
      Math.min(20, level)
    );
  }

  togglePause() {
    this.paused = !this.paused;
  }

  restart() {
    const keepSpeed =
      this.speedLevel;

    this.board = new Board();

    this.piece = Piece.random();

    this.nextPiece =
      Piece.random();

    this.holdPiece = undefined;

    this.canHold = true;

    this.gameOver = false;

    this.paused = false;

    this.score = 0;

    this.fallTimer = 0;

    this.speedLevel = keepSpeed;
  }

  moveLeft() {
    if (this.paused) return;

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
    if (this.paused) return;

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
    if (this.paused) return;

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

    this.canHold = true;
  }

  hardDrop() {
    if (this.paused) return;

    let distance = 0;

    while (
      !this.isColliding(
        this.piece,
        0,
        distance + 1
      )
    ) {
      distance++;
    }

    this.piece.y += distance;

    this.score += distance * 2;

    this.moveDown();
  }

  hold() {
    if (!this.canHold) return;

    this.canHold = false;

    if (!this.holdPiece) {
      this.holdPiece =
        Piece.random();

      Object.assign(
        this.holdPiece,
        structuredClone(this.piece)
      );

      this.spawnPiece();

      return;
    }

    const temp = this.holdPiece;

    this.holdPiece =
      Piece.random();

    Object.assign(
      this.holdPiece,
      structuredClone(this.piece)
    );

    this.piece = temp;

    this.piece.x = 3;
    this.piece.y = 0;
  }

  rotate() {
    const backup =
      structuredClone(
        this.piece.shape
      );

    this.piece.rotate();

    this.lastRotate = true;

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
    const before =
      this.board.cells.length;

    this.board.cells =
      this.board.cells.filter(
        (row) =>
          row.some(
            (cell) => cell === 0
          )
      );

    const cleared =
      before -
      this.board.cells.length;

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

    if (cleared > 0) {
      this.score += cleared * 100;

      if (
        this.piece.isT &&
        this.lastRotate
      ) {
        this.score += 400;
      }
    }

    this.lastRotate = false;
  }

  spawnPiece() {
    this.piece = this.nextPiece;

    this.piece.x = 3;
    this.piece.y = 0;

    this.nextPiece =
      Piece.random();

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

  getGhostY() {
    let distance = 0;

    while (
      !this.isColliding(
        this.piece,
        0,
        distance + 1
      )
    ) {
      distance++;
    }

    return this.piece.y + distance;
  }
}
import Phaser from "phaser";

import { Board } from "../core/Board";
import { Piece } from "../core/Piece";

export class BoardRenderer {
  scene: Phaser.Scene;

  graphics: Phaser.GameObjects.Graphics;

  cellSize = 28;

  offsetX = 40;

  offsetY = 40;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.graphics =
      scene.add.graphics();
  }

  render(
    board: Board,
    piece: Piece,
    nextPiece: Piece,
    gameOver: boolean
  ) {
    this.graphics.clear();

    this.drawGrid(board);

    this.drawBoard(board);

    this.drawPiece(piece);

    this.drawNext(nextPiece);

    if (gameOver) {
      this.drawGameOver();
    }
  }

  drawGrid(board: Board) {
    this.graphics.lineStyle(1, 0x333333);

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        this.graphics.strokeRect(
          this.offsetX +
            x * this.cellSize,

          this.offsetY +
            y * this.cellSize,

          this.cellSize,

          this.cellSize
        );
      }
    }
  }

  drawBoard(board: Board) {
    this.graphics.fillStyle(0x6666ff);

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        if (board.cells[y][x]) {
          this.drawCell(x, y);
        }
      }
    }
  }

  drawPiece(piece: Piece) {
    this.graphics.fillStyle(0x00ffcc);

    for (const cell of piece.shape) {
      this.drawCell(
        piece.x + cell.x,
        piece.y + cell.y
      );
    }
  }

  drawNext(piece: Piece) {
    this.graphics.fillStyle(0xffcc00);

    for (const cell of piece.shape) {
      this.graphics.fillRect(
        340 + cell.x * 20,
        80 + cell.y * 20,
        18,
        18
      );
    }
  }

  drawCell(x: number, y: number) {
    this.graphics.fillRect(
      this.offsetX +
        x * this.cellSize,

      this.offsetY +
        y * this.cellSize,

      this.cellSize,

      this.cellSize
    );
  }

  drawGameOver() {
    this.scene.add.text(
      90,
      300,
      "GAME OVER",
      {
        fontSize: "32px",
        color: "#ff0000",
      }
    );
  }
}
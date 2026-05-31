import Phaser from "phaser";

import { Board } from "../core/Board";
import { Piece } from "../core/Piece";

export class BoardRenderer {
  scene: Phaser.Scene;

  graphics: Phaser.GameObjects.Graphics;

  scoreText!: Phaser.GameObjects.Text;

  pauseButton!: Phaser.GameObjects.Text;

  retryButton?: Phaser.GameObjects.Text;

  speedInput?: HTMLInputElement;

  cellSize = 28;

  offsetX = 40;

  offsetY = 80;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.graphics = scene.add.graphics();

    this.scoreText = scene.add.text(
      20,
      20,
      "SCORE: 0",
      {
        fontSize: "24px",
      }
    );

    this.pauseButton = scene.add.text(
      300,
      20,
      "PAUSE",
      {
        fontSize: "24px",
        backgroundColor: "#444",
      }
    )
    .setPadding(10)
    .setInteractive();
  }

  render(
    board: Board,
    piece: Piece,
    nextPiece: Piece,
    holdPiece: Piece | undefined,
    gameOver: boolean,
    score: number,
    ghostY: number,
    paused: boolean
  ) {
    this.graphics.clear();

    this.scoreText.setText(
      `SCORE: ${score}`
    );

  }

  drawPauseMenu(paused: boolean) {
    if (!paused) {
      if (this.retryButton) {
        this.retryButton.destroy();
        this.retryButton = undefined;
      }

      if (this.speedInput) {
        this.speedInput.remove();
        this.speedInput = undefined;
      }

      return;
    }

    if (!this.retryButton) {
      this.retryButton = this.scene.add.text(
        140,
        300,
        "RETRY",
        {
          fontSize: "32px",
          backgroundColor: "#880000",
        }
      )
      .setPadding(20)
      .setInteractive();

      this.speedInput = document.createElement(
        "input"
      );

      this.speedInput.type = "number";

      this.speedInput.value = "500";

      this.speedInput.style.position = "absolute";
      this.speedInput.style.left = "20px";
      this.speedInput.style.top = "80px";
      this.speedInput.style.width = "100px";

      document.body.appendChild(
        this.speedInput
      );
    }
  }

  gameOverText?: Phaser.GameObjects.Text;

  drawGameOver(gameOver: boolean) {
    if (!gameOver) {
      if (this.gameOverText) {
        this.gameOverText.destroy();
        this.gameOverText = undefined;
      }

      return;
    }

    if (!this.gameOverText) {
      this.gameOverText = this.scene.add
        .text(
          this.scene.cameras.main.centerX,
          this.scene.cameras.main.centerY,
          "GAME OVER",
          {
            fontSize: "40px",
            color: "#ff0000",
          }
        )
        .setOrigin(0.5);
    }
  }
}
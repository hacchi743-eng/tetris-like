import Phaser from "phaser";

import { Board } from "../core/Board";
import { Piece } from "../core/Piece";

export class BoardRenderer {
  scene: Phaser.Scene;

  graphics: Phaser.GameObjects.Graphics;

  scoreText!: Phaser.GameObjects.Text;

  pauseButton!: Phaser.GameObjects.Text;

  retryButton?: Phaser.GameObjects.Text;

  speedDownButton?: Phaser.GameObjects.Text;

  speedUpButton?: Phaser.GameObjects.Text;

  speedText?: Phaser.GameObjects.Text;
  
  pauseOverlay?: Phaser.GameObjects.Rectangle;

  pausePanel?: Phaser.GameObjects.Rectangle;

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


    this.pauseButton = scene.add
      .text(
        300,
        20,
        "PAUSE",
        {
          fontSize: "24px",
          backgroundColor: "#444",
        }
      )
      .setPadding(10)
      .setName("PAUSE")
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
    paused: boolean,
    speedLevel: number
  ) {
    this.graphics.clear();

    this.scoreText.setText(
      `SCORE: ${score}`
    );

    this.drawGrid(board);

    this.drawBoard(board);

    this.drawGhost(piece, ghostY);

    this.drawPiece(piece);

    this.drawNext(nextPiece);

    this.drawHold(holdPiece);

    this.drawButtons();

    this.drawPauseMenu(
      paused,
      speedLevel
    );

    this.drawGameOver(gameOver);
  }

  drawGrid(board: Board) {
    this.graphics.lineStyle(1, 0x333333);

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        this.graphics.strokeRect(
          this.offsetX + x * this.cellSize,
          this.offsetY + y * this.cellSize,
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

  drawGhost(piece: Piece, ghostY: number) {
    this.graphics.fillStyle(0xffffff, 0.3);

    for (const cell of piece.shape) {
      this.drawCell(
        piece.x + cell.x,
        ghostY + cell.y
      );
    }
  }

  drawNext(piece: Piece) {
    this.graphics.fillStyle(0xffcc00);

    for (const cell of piece.shape) {
      this.graphics.fillRect(
        340 + cell.x * 20,
        120 + cell.y * 20,
        18,
        18
      );
    }
  }

  drawHold(piece?: Piece) {
    if (!piece) return;

    this.graphics.fillStyle(0xff66cc);

    for (const cell of piece.shape) {
      this.graphics.fillRect(
        340 + cell.x * 20,
        260 + cell.y * 20,
        18,
        18
      );
    }
  }

  drawCell(x: number, y: number) {
    this.graphics.fillRect(
      this.offsetX + x * this.cellSize,
      this.offsetY + y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  buttonsCreated = false;

  drawButtons() {
    if (this.buttonsCreated) return;

    this.buttonsCreated = true;

    const buttons = [
      {
        label: "◁",
        x: 20,
        y: 680,
        width: 90,
        height: 60,
      },

      {
        label: "▷",
        x: 120,
        y: 680,
        width: 90,
        height: 60,
      },

      {
        label: "▽",
        x: 220,
        y: 680,
        width: 90,
        height: 60,
      },

      {
        label: "↻",
        x: 340,
        y: 660,
        width: 90,
        height: 60,
      },

      {
        label: "HOLD",
        x: 320,
        y: 610,
        width: 110,
        height: 50,
      },
    ];

    buttons.forEach((b) => {
      const bg = this.scene.add
        .rectangle(
          b.x,
          b.y,
          b.width,
          b.height,
          0x444444
        )
        .setOrigin(0)
        .setInteractive();

      bg.setName(b.label);

      this.scene.add
        .text(
          b.x + b.width / 2,
          b.y + b.height / 2,
          b.label,
          {
            fontSize: "22px",
          }
        )
        .setOrigin(0.5);
    });
  }

  drawPauseMenu(
    paused: boolean,
    speedLevel: number
  ) {
    if (!paused) {
      this.pauseOverlay?.destroy();
      this.pauseOverlay = undefined;

      this.pausePanel?.destroy();
      this.pausePanel = undefined;

      this.retryButton?.destroy();
      this.retryButton = undefined;

      this.speedDownButton?.destroy();
      this.speedDownButton = undefined;

      this.speedUpButton?.destroy();
      this.speedUpButton = undefined;

      this.speedText?.destroy();
      this.speedText = undefined;

      return;
    }

    if (!this.pauseOverlay) {
      this.pauseOverlay =
        this.scene.add.rectangle(
          0,
          0,
          420,
          760,
          0x000000,
          0.5
        )
        .setOrigin(0);

      this.pausePanel =
        this.scene.add.rectangle(
          210,
          340,
          280,
          240,
          0x222222
        );

      this.retryButton =
        this.scene.add
          .text(
            210,
            270,
            "RETRY",
            {
              fontSize: "32px",
              backgroundColor:
                "#880000",
            }
          )
          .setOrigin(0.5)
          .setPadding(20)
          .setName("RETRY")
          .setInteractive();

      this.speedDownButton =
        this.scene.add
          .text(
            120,
            380,
            "-",
            {
              fontSize: "40px",
              backgroundColor:
                "#444",
            }
          )
          .setOrigin(0.5)
          .setPadding(20)
          .setName("SPEED_DOWN")
          .setInteractive();

      this.speedText =
        this.scene.add.text(
          210,
          380,
          `SPEED \n${speedLevel}`,
          {
            fontSize: "28px",
          }
        )
        .setOrigin(0.5);

      this.speedUpButton =
        this.scene.add
          .text(
            300,
            380,
            "+",
            {
              fontSize: "40px",
              backgroundColor:
                "#444",
            }
          )
          .setOrigin(0.5)
          .setPadding(20)
          .setName("SPEED_UP")
          .setInteractive();
    }

    this.speedText?.setText(
      `SPEED ${speedLevel}`
    );
  }

  gameOverText?: Phaser.GameObjects.Text;

  gameOverRetryButton?: Phaser.GameObjects.Text;

  drawGameOver(gameOver: boolean) {
    if (!gameOver) {
      if (this.gameOverText) {
        this.gameOverText.destroy();

        this.gameOverText =
          undefined;
      }

      if (
        this.gameOverRetryButton
      ) {
        this.gameOverRetryButton.destroy();

        this.gameOverRetryButton =
          undefined;
      }

      return;
    }

    if (!this.gameOverText) {
      this.gameOverText =
        this.scene.add
          .text(
            this.scene.cameras.main
              .centerX,

            this.scene.cameras.main
              .centerY - 60,

            "GAME OVER",

            {
              fontSize: "40px",
              color: "#ff0000",
            }
          )
          .setOrigin(0.5);

      this.gameOverRetryButton =
        this.scene.add
          .text(
            this.scene.cameras.main
              .centerX,

            this.scene.cameras.main
              .centerY + 20,

            "RETRY",

            {
              fontSize: "32px",
              backgroundColor:
                "#880000",
            }
          )
          .setOrigin(0.5)
          .setPadding(20)
          .setName("RETRY")
          .setInteractive();
    }
  }
}
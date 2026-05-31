import Phaser from "phaser";

import { Board } from "../core/Board";
import { Piece } from "../core/Piece";

export class BoardRenderer {
  scene: Phaser.Scene;

  graphics: Phaser.GameObjects.Graphics;

  scoreText!: Phaser.GameObjects.Text;

  pauseButton!: Phaser.GameObjects.Text;

  retryButton?: Phaser.GameObjects.Text;

  speedDownButton?:
  Phaser.GameObjects.Text;

  speedUpButton?:
    Phaser.GameObjects.Text;

  speedText?:
    Phaser.GameObjects.Text;

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
    },

    {
      label: "▷",
      x: 120,
      y: 680,
    },

    {
      label: "▽",
      x: 220,
      y: 680,
    },

    {
      label: "↻",
      x: 320,
      y: 680,
    },

    {
      label: "HOLD",
      x: 320,
      y: 610,
    },
  ];

  buttons.forEach((b) => {
    this.scene.add
      .text(
        b.x,
        b.y,
        b.label,
        {
          fontSize: "24px",
          backgroundColor: "#444",
        }
      )
      .setPadding(10)
      .setName(b.label)
      .setInteractive();
  });
}


// BoardRenderer.ts
// drawPauseMenu()

drawPauseMenu(
  paused: boolean,
  speedLevel: number
) {
  if (!paused) {
    if (this.retryButton) {
      this.retryButton.destroy();
      this.retryButton =
        undefined;
    }

    if (
      this.speedDownButton
    ) {
      this.speedDownButton.destroy();

      this.speedDownButton =
        undefined;
    }

    if (
      this.speedUpButton
    ) {
      this.speedUpButton.destroy();

      this.speedUpButton =
        undefined;
    }

    if (this.speedText) {
      this.speedText.destroy();

      this.speedText =
        undefined;
    }

    return;
  }

  if (!this.retryButton) {
    this.retryButton =
      this.scene.add
        .text(
          140,
          260,
          "RETRY",
          {
            fontSize: "32px",
            backgroundColor:
              "#880000",
          }
        )
        .setPadding(20)
        .setName("RETRY")
        .setInteractive();

    this.speedDownButton =
      this.scene.add
        .text(
          80,
          360,
          "-",
          {
            fontSize: "40px",
            backgroundColor:
              "#444",
          }
        )
        .setPadding(20)
        .setName("SPEED_DOWN")
        .setInteractive();

    this.speedText =
      this.scene.add.text(
        180,
        375,
        `SPEED ${speedLevel}`,
        {
          fontSize: "28px",
        }
      );

    this.speedUpButton =
      this.scene.add
        .text(
          340,
          360,
          "+",
          {
            fontSize: "40px",
            backgroundColor:
              "#444",
          }
        )
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
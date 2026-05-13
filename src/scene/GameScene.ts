import Phaser from "phaser";

import { Game } from "../core/Game";

import { BoardRenderer } from "../render/BoardRenderer";

export class GameScene extends Phaser.Scene {
  gameLogic!: Game;

  boardRenderer!: BoardRenderer;

  create() {
    this.gameLogic = new Game();

    this.boardRenderer =
      new BoardRenderer(this);

    this.input.keyboard?.on(
      "keydown-LEFT",
      () => {
        this.gameLogic.moveLeft();
      }
    );

    this.input.keyboard?.on(
      "keydown-RIGHT",
      () => {
        this.gameLogic.moveRight();
      }
    );

    this.input.keyboard?.on(
      "keydown-DOWN",
      () => {
        this.gameLogic.moveDown();
      }
    );

    this.input.keyboard?.on(
      "keydown-UP",
      () => {
        this.gameLogic.rotate();
      }
    );

    this.setupMobileInput();
  }

  update(
    _: number,
    delta: number
  ) {
    this.gameLogic.update(delta);

    this.boardRenderer.render(
      this.gameLogic.board,
      this.gameLogic.piece,
      this.gameLogic.nextPiece,
      this.gameLogic.gameOver
    );
  }

  setupMobileInput() {
    this.input.on(
      "pointerdown",
      (pointer: Phaser.Input.Pointer) => {
        const x = pointer.x;
        const y = pointer.y;

        if (y > 500) {
          this.gameLogic.moveDown();

          return;
        }

        if (x < 120) {
          this.gameLogic.moveLeft();

          return;
        }

        if (x > 240) {
          this.gameLogic.moveRight();

          return;
        }

        this.gameLogic.rotate();
      }
    );
  }
}
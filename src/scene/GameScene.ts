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

    this.setupKeyboard();

    this.setupButtons();
  }

  setupKeyboard() {
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

    this.input.keyboard?.on(
      "keydown-SPACE",
      () => {
        this.gameLogic.hardDrop();
      }
    );

    this.input.keyboard?.on(
      "keydown-C",
      () => {
        this.gameLogic.hold();
      }
    );

    this.input.keyboard?.on(
      "keydown-ESC",
      () => {
        this.gameLogic.togglePause();
      }
    );
  }

// GameScene.ts

setupButtons() {
  this.input.on(
    "gameobjectdown",
    (
      _: Phaser.Input.Pointer,
      obj: Phaser.GameObjects.Text
    ) => {
      switch (obj.name) {
        case "LEFT":
          this.gameLogic.moveLeft();
          break;

        case "RIGHT":
          this.gameLogic.moveRight();
          break;

        case "DROP":
          this.gameLogic.hardDrop();
          break;

        case "ROTATE":
          this.gameLogic.rotate();
          break;

        case "HOLD":
          this.gameLogic.hold();
          break;
      }

      if (obj.text === "PAUSE") {
        this.gameLogic.togglePause();
      }

      if (obj.text === "RETRY") {
        this.gameLogic.restart();
      }
    }
  );
}

 // GameScene.ts update()

update(_: number, delta: number) {
  this.gameLogic.update(delta);

  if (
    this.boardRenderer.speedInput
  ) {
    const value = Number(
      this.boardRenderer
        .speedInput.value
    );

    if (!isNaN(value)) {
      this.gameLogic.setSpeed(
        value
      );
    }
  }

  this.boardRenderer.render(
    this.gameLogic.board,
    this.gameLogic.piece,
    this.gameLogic.nextPiece,
    this.gameLogic.holdPiece,
    this.gameLogic.gameOver,
    this.gameLogic.score,
    this.gameLogic.getGhostY(),
    this.gameLogic.paused,
    this.gameLogic.speedLevel
  );

  this.boardRenderer.drawPauseMenu(
    this.gameLogic.paused,
    this.gameLogic.speedLevel
  );
}
}
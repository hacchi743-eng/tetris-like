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

setupButtons() {
  this.input.on(
    "gameobjectdown",
    (
      _: Phaser.Input.Pointer,
      obj: Phaser.GameObjects.Text
    ) => {
      switch (obj.name) {
        case "◁":
          this.gameLogic.moveLeft();
          break;

        case "▷":
          this.gameLogic.moveRight();
          break;

        case "▽":
          this.gameLogic.hardDrop();
          break;

        case "↻":
          this.gameLogic.rotate();
          break;

        case "HOLD":
          this.gameLogic.hold();
          break;

        case "PAUSE":
          this.gameLogic.togglePause();
          break;

        case "RETRY":
          this.gameLogic.restart();
          break;

        case "SPEED_DOWN":
          this.gameLogic.setSpeed(
            this.gameLogic.speedLevel - 1
          );
          break;

        case "SPEED_UP":
          this.gameLogic.setSpeed(
            this.gameLogic.speedLevel + 1
          );
          break;
      }
    }
  );
}
update(_: number, delta: number) {
  this.gameLogic.update(delta);

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
}
}
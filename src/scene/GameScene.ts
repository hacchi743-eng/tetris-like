import Phaser from "phaser";

import { Game } from "../core/Game";

import { BoardRenderer } from "../render/BoardRenderer";

export class GameScene extends Phaser.Scene {
  gameLogic!: Game;

  boardRenderer!: BoardRenderer;

  private leftDasTimeout?: number;
  private rightDasTimeout?: number;

  private leftRepeatTimer?: number;
  private rightRepeatTimer?: number;

  private downRepeatTimer?: number;

  private lastDownTap = 0;

  create() {
    this.gameLogic = new Game();

    this.boardRenderer =
      new BoardRenderer(this);

    this.setupKeyboard();

    this.setupButtons();

    this.boardRenderer.drawButtons();

   this.setupTouchControls();
  }

  setupTouchControls() {
    const left =
      this.boardRenderer.leftButton;

    const right =
      this.boardRenderer.rightButton;

    const down =
      this.boardRenderer.downButton;

    const rotate =
      this.boardRenderer.rotateButton;

    const hold =
      this.boardRenderer.holdButton;

    if (
      !left ||
      !right ||
      !down ||
      !rotate ||
      !hold
    ) {
      return;
    }

    left.on("pointerdown", () => {
      this.gameLogic.moveLeft();

      this.leftDasTimeout =
        window.setTimeout(() => {
          this.leftRepeatTimer =
            window.setInterval(() => {
              this.gameLogic.moveLeft();
            }, 50);
        }, 180);
    });

    right.on("pointerdown", () => {
      this.gameLogic.moveRight();

      this.rightDasTimeout =
        window.setTimeout(() => {
          this.rightRepeatTimer =
            window.setInterval(() => {
              this.gameLogic.moveRight();
            }, 50);
        }, 180);
    });

    down.on("pointerdown", () => {
      this.gameLogic.moveDown();

      this.downRepeatTimer =
        window.setInterval(() => {
          this.gameLogic.moveDown();
        }, 40);
    });

    down.on("pointerup", () => {
      clearInterval(
        this.downRepeatTimer
      );

      const now = Date.now();

      if (
        now - this.lastDownTap < 250
      ) {
        this.lastDownTap = 0;

        this.gameLogic.hardDrop();

        return;
      }

      this.lastDownTap = now;
    });

    down.on("pointerout", () => {
      clearInterval(
        this.downRepeatTimer
      );
    });

    rotate.on("pointerdown", () => {
      this.gameLogic.rotate();
    });

    hold.on("pointerdown", () => {
      this.gameLogic.hold();
    });

    const stopLeft = () => {
      clearTimeout(
        this.leftDasTimeout
      );

      clearInterval(
        this.leftRepeatTimer
      );
    };

    const stopRight = () => {
      clearTimeout(
        this.rightDasTimeout
      );

      clearInterval(
        this.rightRepeatTimer
      );
    };

    const stopDown = () => {
      clearInterval(
        this.downRepeatTimer
      );
    };

    left.on("pointerup", stopLeft);
    left.on("pointerout", stopLeft);

    right.on("pointerup", stopRight);
    right.on("pointerout", stopRight);

    down.on("pointerup", stopDown);
    down.on("pointerout", stopDown);

    this.input.on(
      "pointerup",
      () => {
        stopLeft();
        stopRight();
        stopDown();
      }
    );
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
        obj: Phaser.GameObjects.GameObject
      ) => {
        const action =
          obj.getData?.("action");

        switch (action) {

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
              console.log("DOWN");
            this.gameLogic.setSpeed(
              this.gameLogic.speedLevel - 1
            );
              console.log(
    this.gameLogic.speedLevel
  );
            break;

          case "SPEED_UP":
              console.log("UP");
            this.gameLogic.setSpeed(
              this.gameLogic.speedLevel + 1
            );
              console.log(
    this.gameLogic.speedLevel
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
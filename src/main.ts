import Phaser from "phaser";
import { GameScene } from "./scene/GameScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 420,
  height: 760,

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  backgroundColor: "#111111",

  scene: [GameScene],
});
import {CONSTANTS} from "./constants.js"

function spawnStars() {
  add([
    sprite("star", { anim: "star" }),
    anchor("center"),
    scale(rand(CONSTANTS.SCALE/5, CONSTANTS.SCALE/1.5)),
    move(LEFT, rand(50, 200)*CONSTANTS.SCALE),
    pos(width() - CONSTANTS.SCALE/2, rand(0, height())),
    offscreen({ destroy: true }),
    opacity(rand(0.3, 0.8)),
    z(0),
  ]);

  wait(rand(0.1, 2), spawnStars);
}

export default spawnStars;
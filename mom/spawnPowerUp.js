import {CONSTANTS} from "./constants.js"

function spawnPowerUp(){
  if(chance(0.5)){
    // let type = choose(["fire", "upgrade", "shield"])
    let type = chance(0.5) ? "upgrade" : "shield";
    add([
      sprite("power-ups", { anim: type }),
      anchor("center"),
      scale(CONSTANTS.SCALE/2),
      move(LEFT, rand(50, 300)*CONSTANTS.SCALE),
      pos(width() - 20*CONSTANTS.SCALE, rand(20*CONSTANTS.SCALE, height()-20*CONSTANTS.SCALE)),
      offscreen({ destroy: true }),
      z(50),
      area({shape: new Polygon([vec2(-30, 0), vec2(0, -30), vec2(30, 0), vec2(0, 30)])}),
      "power",
      type,
    ])
  }

  wait(rand(5, 15), spawnPowerUp);
}

export default spawnPowerUp;
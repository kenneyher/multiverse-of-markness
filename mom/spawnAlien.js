function spawnEnemy() {
  console.log('hi')
  const SCALE = width()/800;
  const HP = {
    "alien": 3,
    "chief": 5,
    "bot": 7
  }

  let type = choose(["alien", "chief"]);
  add([
    sprite("enemies", { anim: type, flipX: true }),
    anchor("center"),
    area({ scale: vec2(0.6, 0.6)}),
    scale(SCALE),
    pos(width()-40*SCALE, rand(50*SCALE, height() - 50*SCALE)),
    health(HP[type]),
    z(5),
    offscreen({ destroy: true }),
    "enemy",
    type,
    {
      t: 0,
      speed: -120,
      speedY: 0,
      dir:1,
    },
  ]);

  wait(rand(1.25, 5), spawnEnemy);
}

export default spawnEnemy;
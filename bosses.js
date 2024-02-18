import { CONSTANTS } from "./constants.js";

function addBoom(p, s, boss){
  play("boom", {volume: 0.2})
  const boom = add([
    sprite("boom", {anim: "explode"}),
    scale(s*CONSTANTS.SCALE),
    pos(p),
    z(100),
    anchor("center"),
    "boom"
  ])
  boom.onAnimEnd((anim) => {
    if(anim == "explode"){
      go("win", boss)
      destroy(boom);
    }
  })
}

function spawnBoss(player, b) {
  const boss = add([
    sprite(b, { anim: "idle" }),
    pos(width() / 1.3, height() / 2),
    z(10),
    scale(3.5),
    anchor("center"),
    area({ scale: 0.8 }),
    state("idle"),
    health(300, 300),
    timer(),
    color(),
    // "enemy",
    "boss",
    {
      t: 0,
      atkTimer: 0,
      atkTime: 5,
      drones: 0,
    },
    // enemy({ dmg: 50 }),
  ]);
  function generateDrone(player, x, y) {
    const d = add([
      sprite("drone"),
      anchor("center"),
      pos(x, y),
      area( { scale: 0.7 }),
      scale(CONSTANTS.SCALE),
      z(5),
      state("idle"),
      "drone",
      "dangerous",
      {
        max: y - 3,
        min: y + 3,
        dir: 1,
        origin: { x: x, y: y },
      },
    ]);
    d.onStateEnter("idle", async () => {
      await wait(rand(3, 5));
      d.enterState(choose(["beam", "attack", "idle"]));
    });
    d.onStateEnter("beam", async () => {
      d.add([
        sprite("beam"),
        pos(0, 0),
        anchor("left"),
        area(),
        scale(-width(), 0),
        "beam",
        "e-bullet",
      ]);
      await tween(
        d.get("beam")[0].scale.y,
        0.5,
        0.15,
        (val) => (d.get("beam")[0].scale.y = val),
        easings.easeIn
      );
      await wait(2);
      await tween(
        d.get("beam")[0].scale.y,
        0,
        0.15,
        (val) => (d.get("beam")[0].scale.y = val),
        easings.easeOut
      );
      d.get("beam")[0].destroy();
      d.enterState("idle");
    });
    d.onStateEnter("attack", async () => {
      await tween(
        d.pos,
        player.pos,
        2.5,
        (val) => (d.pos = val),
        easings.easeInOutBack
      );
      // await wait(rand(0.05, 0.15));
      await tween(
        d.pos,
        vec2(d.origin.x, d.origin.y),
        3,
        (val) => (d.pos = val),
        easings.easeOutBack
      );
      d.enterState("idle");
    })
  }
  

  if (b == "mecca") {
    const scene = add([]);
    const right = add([
      sprite("hands", { anim: "right" }),
      anchor("center"),
      pos(width() / 1.6, height() / 2.5),
      scale(2.8),
      z(5),
      area({
        shape: new Polygon([
          vec2(-40, 50),
          vec2(-40, -20),
          vec2(20, -40),
          vec2(60, 0),
          vec2(20, 40),
        ]),
      }),
      "dangerous",
    ]);
    onUpdate(() => {
      right.pos.x += wave(-0.25, 0.25, time() * 0.5, Math.cos);
      right.pos.y += wave(-0.25, 0.25, time() * 0.5, Math.sin);

      left.pos.x += wave(-0.25, 0.25, time() * 0.5, Math.cos);
      left.pos.y += wave(-0.25, 0.25, time() * 0.5, Math.sin);

      boss.pos.x = wave(width() / 1.35, width() / 1.25, time() * 0.5, Math.cos);
      boss.pos.y = wave(height() / 2.1, height() / 1.9, time() * 0.5, Math.cos);

      if (boss.hp() < boss.maxHP() / 2 && boss.drones < 1) {
        boss.drones = 4;
        generateDrone(player, width() - 200, height()/10);
        generateDrone(player, width() - 350, height()/5);
        generateDrone(player, width() - 350, height()/1.25);
        generateDrone(player, width() - 200, height()/1.1);
      }
    });



    const left = add([
      sprite("hands", { anim: "left" }),
      anchor("center"),
      pos(boss.pos.x + 50, boss.pos.y + 50),
      scale(2.8),
      z(50),
      area({
        shape: new Polygon([
          vec2(-40, 50),
          vec2(-40, -20),
          vec2(20, -40),
          vec2(60, 0),
          vec2(20, 40),
        ]),
      }),
      "dangerous",
    ]);

    boss.onStateEnter("idle", async () => {
      await boss.wait(randi(2, 5));
      if (boss.state !== "idle") return;
      boss.enterState(chance(0.5) ? "punch" : "atk");
      // boss.enterState("punch");
    });
    boss.onStateEnter("punch", async () => {
      left.play("atk");
      await wait(0.5);
      const player = get("player")[0];
      const dir = player.pos.sub(left.pos).unit();
      const dest = player.pos.add(dir.scale(100));
      const dis = player.pos.dist(left.pos);
      await tween(
        left.pos,
        dest,
        0.8,
        (p) => (left.pos = p),
        easings.easeInOut
      );
      await wait(0.5);
      boss.enterState("return");
    });
    boss.onStateEnter("return", async () => {
      const dir = boss.pos.sub(left.pos).unit();
      const dest = boss.pos.add(dir.scale(200));
      const dis = boss.pos.dist(left.pos);
      left.play("left");
      await tween(left.pos, dest, 2, (p) => (left.pos = p), easings.easeInOut);
      await wait(1);
      boss.enterState("idle");
    });
    boss.onStateEnter("atk", () => {
      boss.atkTime = randi(5, 15);
    });
    boss.onStateUpdate("atk", () => {
      boss.t += dt();
      boss.atkTimer += dt();

      if (boss.t >= 0.35) {
        add([
          sprite("e-bullet", { anim: "bullet" }),
          pos(boss.pos.x - 20, boss.pos.y),
          scale(CONSTANTS.SCALE / 2),
          area({ scale: vec2(0.5, 0.5) }),
          anchor("center"),
          opacity(1),
          move(vec2(-1, rand(-0.8, 0.8)), 150 * CONSTANTS.SCALE),
          z(50),
          offscreen({ destroy: true }),
          "dangerous",
        ]);
        boss.t = 0;
      }

      if (boss.atkTimer >= boss.atkTime) {
        boss.enterState("idle");
        boss.atkTimer = 0;
      }
    });


    onUpdate("drone", (d) => {
      if (d.pos.y < d.max) {
        d.dir = 1;
      }
      if (d.pos.y > d.min) {
        d.dir = -1;
      }

      d.move(0, d.dir * 5);
    });

  }
}

export default spawnBoss;

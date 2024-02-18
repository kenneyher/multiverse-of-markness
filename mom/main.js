import kaboom from "https://unpkg.com/kaboom@3000.1.17/dist/kaboom.mjs";
import spawnAlien from "./spawnAlien.js";
import spawnStars from "./spawnStars.js";
import spawnPowerUp from "./spawnPowerUp.js";
import loadAll from "./loader.js";
import choose from "./choose.js";
import main from "./screen.js";
import win from "./complete.js";
import spawnBoss from "./bosses.js";
import { stats } from "./charStats.js";
import { CONSTANTS } from "./constants.js";

kaboom({
  global: true,
  background: [30, 30, 50],
  font: "lazy",
});

loadAll();
let boomsLeft;
let gameover = false;

function addBoom(p, s, isPlayer){
  play("boom", {volume: 0.2})
  const boom = add([
    sprite("boom", {anim: "explode"}),
    scale(s*CONSTANTS.SCALE),
    pos(p),
    z(100),
    anchor("center"),
    "boom"
  ])
  if(isPlayer){
    boom.use("playerBoom");
  }
  boom.onAnimEnd((anim) => {
    if(anim == "explode"){
      destroy(boom);
      if(isPlayer){
        boomsLeft -= 1;
      }
    }
  })
}
async function playerKaboom(p){
  addBoom(p, rand(1), true)
  while(boomsLeft > 1){
    await wait(rand(0.05, 0.25), () => {addBoom(vec2(p.x + rand(-50, 50), p.y + rand(-50, 50)), rand(0.5, 3), true)})
  }
  gameover = true;
  go('choose');
}

scene("main", main)
scene("choose", choose);
scene("win", win);

scene("play", (char, buffs) => {
  gameover = false;
  const music = play("boss", {loop: true, volume: 0.5});
  let score = 0;

  add([
    rect(width(), 5 * CONSTANTS.SCALE),
    pos(0, height() + 20),
    area(),
    body({ isStatic: true }),
    tile(),
  ]);
  add([
    rect(width(), 5 * CONSTANTS.SCALE),
    pos(0, -20),
    area(),
    body({ isStatic: true }),
    tile(),
  ]);
  add([
    rect(5 * CONSTANTS.SCALE, height()),
    pos(-20, 0),
    area(),
    body({ isStatic: true }),
    tile(),
  ]);
  add([
    rect(5 * CONSTANTS.SCALE, height()),
    pos(width() + 20, 0),
    area(),
    body({ isStatic: true }),
    tile(),
  ]);

  const player = add([
    sprite("chars", { anim: char + "-idle" }),
    pos(100, height() / 2),
    scale(CONSTANTS.SCALE),
    area({
      shape: new Polygon([
        vec2(-15, 20),
        vec2(-20, -5),
        vec2(0, -20),
        vec2(25, -15),
        vec2(27, 0),
        vec2(20, 18),
      ]),
    }),
    health(3),
    body(),
    state("normal"),
    z(0),
    anchor("center"),
    {
      speed: stats[char].speed * CONSTANTS.SCALE,
      upgrade: 0,
      modifier: false,
      modifierType: null,
      hasShield: false,
      blinking: false,
      atk: 1,
    },
    "player"
  ]);
  spawnBoss(player, "mecca");

  for(let i=0; i<buffs.length; i++){
    let modifier = buffs[i];
    if(modifier == null){
      continue;
    }
    if(i == 0){
      switch(modifier.target) {
        case "speed":
          if(modifier.type == "increment"){
            player.speed += modifier.buff;
          }
          break;
        case "health":
          if(modifier.type == "increment"){
            player.setHP(player.hp() + modifier.buff);
            player.setMaxHP(player.hp() + modifier.buff);
          }
          break;
        case "attack":
          if(modifier.type == "modifier"){
            player.modifier = true;
            player.modifierType = modifier.buff;
          }
          break;
        default: 
          debug.error('problem with player modifier');
          break;
      }
    } else {
      switch(modifier.buff.target){
        case "speed":
          if(modifier.buff.type == "increment"){
            player.speed += modifier.buff.change;
          }
          break;
        case "hp":
            if(modifier.buff.type  == "increment"){
              player.setHP(player.hp() + modifier.buff.change);
              player.setMaxHP(player.hp() + modifier.buff.change);
            }
            break;
        case "atk":
          if(modifier.buff.type == "increment"){
            player.atk += modifier.buff.change;
          }
          break;
      }
      switch(modifier.debuff.target){
        case "speed":
          if(modifier.debuff.type  == "decreasement"){
            player.speed -= modifier.debuff.change;
          }
          break;
        case "hp":
            if(modifier.debuff.type  == "decreasement"){
              player.setMaxHP(player.hp() - modifier.debuff.change);
              player.setHP(player.hp() - modifier.debuff.change);
            }
            break;
        case "atk":
          if(modifier.debuff.type  == "decreasement"){
            player.atk -= modifier.debuff.change;
          }
          break;
      }
    }
  }

  player.onStateEnter("blinking", async () => {
    player.blinking = true;
    for(let i=0; i<12; i++){
      player.opacity = 0;
      await wait(0.1);
      player.opacity = 1;
      await wait(0.11);
    }
    player.blinking = false;
    player.enterState("normal");
  })

  const ui = add([]);
  ui.add([
    sprite("icons", {frame: 1}),
    anchor("center"),
    pos(50, 50),
    z(10),
    scale(CONSTANTS.SCALE/2),
  ])
  ui.add([
    text(`${player.hp()}`, { size: 15 * CONSTANTS.SCALE }),
    pos(80, 50),
    z(10),
    color(107, 254, 174),
    "ui",
    "hp",
  ]);

  onUpdate("ui", (UI) => {
    if (UI.is("hp")) {
      UI.text = `${player.hp()}`;
    }
  });

  onKeyDown("up", () => {
    player.move(0, -player.speed);
  });
  onKeyDown("down", () => {
    player.move(0, player.speed);
  });
  onKeyDown("left", () => {
    player.move(-player.speed, 0);
  });
  onKeyDown("right", () => {
    player.move(player.speed, 0);
  });

  let angles = [
    0,
    0.25,
    -0.25,
  ];
  loop(0.5, () => {
    if (!player.modifier) {
      add([
        sprite("bullets", { anim: char }),
        pos(player.pos.x + 50, player.pos.y),
        scale(CONSTANTS.SCALE / 2),
        area({ scale: vec2(0.8, 0.5) }),
        anchor("center"),
        z(10),
        rotate(0),
        move(RIGHT, 200 * CONSTANTS.SCALE),
        offscreen({ destroy: true }),
        "bullet",
      ]);
    } 
    if(player.modifier && player.modifierType == "three-way"){
      for (let j = 0; j < angles.length; j++) {
        add([
          sprite("bullets", { anim: char }),
          pos(player.pos.x + 50, player.pos.y),
          scale(CONSTANTS.SCALE / 2),
          area({ scale: vec2(0.8, 0.5) }),
          anchor("center"),
          z(10),
          rotate(0),
          move(vec2(1, angles[j]), 200 * CONSTANTS.SCALE),
          offscreen({ destroy: true }),
          "bullet",
        ]);
      }
    }
    play("shoot", { volume: 0.015 });
  });

  spawnStars();
  spawnAlien();

  player.onCollide("ebullet", (d) => {
    if(player.blinking) return;
    if(!player.hasShield){
      player.hurt(1);
      d.destroy();
    } else {
      player.get("guard")[0].destroy();
      player.hasShield = false;
    }
    player.enterState("blinking")
    d.destroy();
  });
  player.onCollide("dangerous", (d) => {
    if(player.blinking) return;
    if(!player.hasShield){
      player.hurt(1);
    } else {
      player.get("guard")[0].destroy();
      player.hasShield = false;
    }
    player.enterState("blinking");
  });
  player.onCollide("enemy", (e) => {
    if(player.blinking) return;
    if(!player.hasShield){
      player.hurt(1);
      d.destroy();
    } else {
      player.get("guard")[0].destroy();
      player.hasShield = false;
    }
  })
  player.onCollide("power", (p) => {
    if (p.is("upgrade")) {
      player.upgrade = player.upgrade == 2 ? 2 : (player.upgrade += 1);
    }
    if (p.is("shield") && !player.hasShield) {
      player.add([
				sprite("shield", { anim: "shield" }),
				scale(CONSTANTS.SCALE),
				z(60),
				anchor("center"),
				"guard",
			]);
      player.hasShield = true;
    }
    p.destroy();
  });
  player.onHurt(() => {
    if (player.curAnim() !== `${char}-hurt`) {
      player.play(`${char}-hurt`);
      player.upgrade = 0;
      play("hit", { volume: 0.1 });
      shake(50);
    }
  });
  player.onAnimEnd((anim) => {
    if (anim == `${char}-hurt`) {
      if (player.curAnim() !== `${char}-idle`) {
        player.play(`${char}-idle`);
      }
    }
  });
  player.onDeath(() => {
    boomsLeft = randi(3, 5);
    playerKaboom(player.pos)
    player.destroy()
  });

  player.onCollideUpdate("e-bullet", (e) => {
    if(player.blinking) return;
    if(!player.hasShield){
      player.hurt(1);
    } else {
      player.get("guard")[0].destroy();
      player.hasShield = false;
    }
    player.enterState("blinking");
  })

  onCollide("bullet", "enemy", (b, a) => {
    a.hurt(player.atk);
    b.destroy();
  });
  onCollide("bullet", "boss", (bu, b) => {
    b.hurt(player.atk);
    bu.destroy();
  })

  on("death", "enemy", (e) => {
    score++;
    addBoom(e.pos, 1.5);
    destroy(e);
  });

  onUpdate("enemy", (e) => {
    e.t += dt();
    if (e.t > 3) {
      add([
        sprite("e-bullet", { anim: "bullet" }),
        pos(e.pos.x - 20, e.pos.y),
        scale(CONSTANTS.SCALE / 2),
        area({ scale: vec2(0.7, 0.7) }),
        anchor("center"),
        opacity(1),
        move(LEFT, 150 * CONSTANTS.SCALE),
        z(10),
        offscreen({ destroy: true }),
        "ebullet",
      ]);
      if (e.is("chief") || e.is("bot")) {
        add([
          sprite("e-bullet", { anim: "bullet" }),
          pos(e.pos.x - 20 * CONSTANTS.SCALE, e.pos.y),
          scale(CONSTANTS.SCALE/2),
          area({ scale: vec2(0.7, 0.7) }),
          anchor("center"),
          move(vec2(-1, 0.5), 150 * CONSTANTS.SCALE),
          z(10),
          offscreen({ destroy: true }),
          "ebullet",
        ]);
        add([
          sprite("e-bullet", { anim: "bullet" }),
          pos(e.pos.x - 20 * CONSTANTS.SCALE, e.pos.y),
          scale(CONSTANTS.SCALE / 2),
          area({ scale: vec2(0.7, 0.7) }),
          anchor("center"),
          z(10),
          move(vec2(-1, -0.5), 150 * CONSTANTS.SCALE),
          offscreen({ destroy: true }),
          "ebullet",
        ]);
      }
      e.t = 0;
    }

    if(e.is("alien") || e.is("chief")){
      e.move(-50*CONSTANTS.SCALE, 0)
    }
    else if(e.is("bot")){
      if(e.pos.y < 20){
        e.dir = 1;
      }
      if(e.pos.y > height() - 20){
        e.dir = -1;
      }
      e.move(0, e.dir*(40*CONSTANTS.SCALE));
    }
  });
  onUpdate("bullet", (b) => {
    if (char == "viking") {
      b.angle += 5 * CONSTANTS.SCALE;
    }

    if(gameover){
      music.loop = false;
      music.stop();
    }
  });

  let boss = get("boss")[0];
  const bossHP = ui.add([
    rect(20, height()),
    color(255, 106, 116),
    pos(width() - 20, 0),
    {
			max: boss.maxHP(),
			set(hp) {
				this.height = height() * hp / this.max
				this.flash = true
			},
		},
  ])

  boss.onHurt(() => {
    bossHP.set(boss.hp());
  })
  boss.onDeath(async () => {
    music.loop = false;
    music.stop();
    await wait(0.1, () => addBoom(boss.pos, randi(3, 5), false))
    await wait(0.1, () => addBoom(boss.pos, randi(3, 5), false))
    await wait(0.1, () => addBoom(boss.pos, randi(3, 5), false))
    await wait(0.5, () => go("win", "boss"))
  }) 

  bossHP.onUpdate(() => {
		if (bossHP.flash) {
			bossHP.color = rgb(255, 255, 255)
			bossHP.flash = false
		} else {
			bossHP.color = rgb(255, 106, 116)
		}
	})
});

go("main");

function loadAll(){
  loadSprite("chars", "sprites/chars.png", {
    sliceY: 7, 
    sliceX: 10, 
    anims: 
    {
      "clown-idle": {from: 0, to: 1, loop: true, speed: 3},
      "clown-hurt": {from: 2, to: 4, speed: 5},
      "mark-idle": {from: 5, to: 9, loop: true, speed: 5},
      "mark-hurt": {from: 10, to: 12,},
      "markbot-idle": {from: 13, to: 23, loop: true, pingpong: true,},
      "markbot-hurt": {from: 24, to: 31},
      "viking-idle": {from: 32, to: 33, loop: true, speed: 5},
      "viking-hurt": {from: 34, to: 36},
      "wizark-idle": {from: 37, to: 47, loop: true, speed: 8},
      "wizark-hurt": {from: 48, to: 51, speed: 6},
      "zomark-idle": {from: 52, to: 58, loop: true, speed: 5},
      "zomark-hurt": {from: 59, to: 61},
    }
  });
  loadSprite("bullets", "sprites/bullets.png", {
    sliceY: 5, 
    sliceX: 10, 
    anims: 
    {
      "markbot": {from: 0, to: 8, loop: true},
      "clown": {from: 9, to: 15, loop: true},
      "mark": {from: 16, to: 24, loop: true},
      "viking": {from: 25, to: 37, loop: true},
      "wizark": {from: 38, to: 46, loop: true},
      "zomark": 47,
    }
  });
  loadSprite("enemies", "sprites/enemies.png", {
    sliceY: 2, 
    sliceX: 5, 
    anims: 
    {
      "alien": {from: 0, to: 1, loop: true, speed: 5},
      "bot": {from: 2, to: 6, loop: true, speed: 10},
      "chief": {from: 7, to: 8, loop: true, speed: 5},
    }
  });
  loadSprite("e-bullet", "sprites/enemy_bullet.png", {
    sliceY: 1, 
    sliceX: 5,
    anims: 
    {
      bullet: {from: 0, to: 4, loop: true},
    } 
  });
  loadSprite("star", "sprites/star.png", {
    sliceY: 2, 
    sliceX: 5,
    anims: 
    {
      star: {from: 0, to: 5, loop: true, speed: 5},
    } 
  });
  loadSprite("buffs", "sprites/buffs.png", {
    sliceY: 2, 
    sliceX: 4,
  });
  loadSprite("shield", "sprites/shield.png", {
    sliceY: 2, 
    sliceX: 5,
    anims: 
    {
      shield: {from: 0, to: 9, loop: true, speed: 10}
    } 
  });
  loadSprite("boom", "sprites/boom.png", {
    sliceY: 2, 
    sliceX: 5,
    anims: 
    {
      explode: {from: 0, to: 7, speed: 15}
    } 
  });
  loadSprite("mecca", "sprites/mecca.png", {
    sliceY: 1, 
    sliceX: 3,
    anims: 
    {
      idle: {from: 0, to: 2, speed: 2, pingpong: true, loop: true},
    } 
  });
  loadSprite("hands", "sprites/mecca-hands.png", {
    sliceY: 1, 
    sliceX: 3,
    anims: 
    {
      right: 2,
      left: 0,
      atk: 1,
    } 
  });
  loadSprite("drone", "sprites/drone.png")
  loadSprite("beam", "sprites/beam.png");
  loadSprite("icons", "sprites/icons.png", {
    sliceY: 1,
    sliceX: 5,
  });

  loadSound("hit", "sounds/hurt.mp3");
  loadSound("shoot", "sounds/shoot.mp3");
  loadSound("choose", "sounds/choose.mp3");
  loadSound("boom", "sounds/boom.mp3");
  loadSound("boss", "sounds/boss-song.mp3");

  loadFont("dimanSquares", "misc/DimanSquaresMonospace.ttf");
  loadFont("lazy", "misc/lazyFont.ttf");
  loadBitmapFont("icons", "sprites/icons.png", 3, 1, {chars: "has"});
}

export default loadAll;
import {stats} from "./charStats.js"
import { CONSTANTS as CONSTANTS} from "./constants.js"

export default () => {
  const FRAMES = [5, 13, 32];
	const BUFF_FRAMES = [6, 5, 4];
	const PLAYERS_BUFF_NAMES = ["slippery", "robotic core", "war cry"];
	const PLAYERS_BUFF_DESC = {
		mark: "Speed Increases by 50%", 
		markbot: "Gain +2 HP", 
		viking: "Viking Mark shoots three bullets instead of one",
	}
  const NAMES = ["mark", "markbot", "viking"];
	const music = play("choose", {volume: 0.5, loop: true,});
  
  let i = 0;
	const charStats = {
		"hp": 3,
		"atk": 2,
		"speed": 150,
	}
  
  const preview = add([
  	sprite("chars", {anim: NAMES[i] + "-idle"}),
  	pos(width()/6, height()/1.7),
  	scale(CONSTANTS.SCALE*5),
  	anchor("center"),
  	opacity(0.5),
  	z(1),
  ])
  
  const animPreview = preview.add([
  	sprite("chars", {frame: FRAMES[i]}),
  	pos(-10, 10),
  	scale(0.5),
  	anchor("center"),
  	z(10),
  ])

	const textBox = add([
		rect(width()/2, height() - 50*CONSTANTS.SCALE, {radius: 15*CONSTANTS.SCALE}),
		pos(width()/2 - 50*CONSTANTS.SCALE, 20*CONSTANTS.SCALE),
		color(50, 50, 75),
		outline(5*CONSTANTS.SCALE, rgb(40, 40, 65)),
	])
	const name = textBox.add([
		text(stats[NAMES[i]].name, {size: 40*CONSTANTS.SCALE, font: "dimanSquares",}),
		pos(20*CONSTANTS.SCALE, 0*CONSTANTS.SCALE),
		color(255, 236, 96)
	])
	const description = textBox.add([
		text(`"${stats[NAMES[i]].bio}"`, {size: 20*CONSTANTS.SCALE, width: width()/2 - 50*CONSTANTS.SCALE,}),
		pos(20*CONSTANTS.SCALE, 50*CONSTANTS.SCALE)
	])
	const buffBox = textBox.add([
		rect(width()/2 - 100, height()/1.6, {radius: 5*CONSTANTS.SCALE}),
		pos(50, 100*CONSTANTS.SCALE),
		color(60, 60, 85),
		outline(5*CONSTANTS.SCALE, rgb(70, 75, 100)),
		z(10),
	])
	const playerBuff = buffBox.add([
		sprite("buffs", {frame: 6}),
		pos(85*CONSTANTS.SCALE, 50*CONSTANTS.SCALE),
		area(),
		scale(CONSTANTS.SCALE),
		anchor("center"),
		{
			mark: {target: "speed", type: "increment", buff: 50},
			markbot: {target: "health",  type: "increment", buff: 2},
			viking: {target: "attack", type: "modifier", buff: "three-way"},
			curBuffDesc: PLAYERS_BUFF_DESC[NAMES[i]],
			curBuffName: PLAYERS_BUFF_NAMES[i].toUpperCase(),
			buff: null,
			state: "equipped",
		}
	])
	const buffHelp = buffBox.add([
		text("Hover a buff to check its properties\nclick on a buff to equip.", {
			size: 20*CONSTANTS.SCALE, 
			width: width()/2 - 50*CONSTANTS.SCALE,
			styles: {
				"green": {
					color: rgb(107, 254, 174),
				},
				"red": {
					color: rgb(255, 106, 116)
				},
				"gold": {
					color: rgb(255, 213, 0)
				}
			},
		}),
		pos(20*CONSTANTS.SCALE, 200*CONSTANTS.SCALE)
	])

	for(let i=0; i<2; i++){
		buffBox.add([
			sprite("buffs", {frame: 3}),
			pos((85*CONSTANTS.SCALE)*(i+2), 50*CONSTANTS.SCALE),
			area(),
			scale(CONSTANTS.SCALE),
			anchor("center"),
			"buff holder",
			"empty",
			{
				curBuffDesc: "no buff equipped",
				info: null,
				occupied: false,
			}
		])
	}
	for(let i=0; i<3; i++){
		buffBox.add([
			sprite("buffs", {frame: i}),
			pos((85*CONSTANTS.SCALE)*(i+1), 125*CONSTANTS.SCALE),
			area(),
			scale(CONSTANTS.SCALE),
			anchor("center"),
			"buff",
			{
				name: CONSTANTS.BUFFS[i].name,
				description: CONSTANTS.BUFFS[i].description,
				buff: CONSTANTS.BUFFS[i].buff,
				debuff: CONSTANTS.BUFFS[i].debuff,
				equipped: false,
				index: i,
			}
		])
	}

	onClick("buff", (b) => {
		if(buffBox.get(["empty", "buff holder"]).length > 0 && !b.equipped){
			let buffHolder = buffBox.get(["empty", "buff holder"])[0];
			buffHolder.frame = b.frame;
			buffHolder.occupied = true;
			buffHolder.info = {buff: b.buff, debuff: b.debuff};
			buffHolder.curBuffDesc = b.description;
			buffHolder.unuse("empty");
			buffHolder.buffIdx = b.index;
			b.equipped = true;
		}
	})

	const buffs = [null, null, null];
  onUpdate(() => {
  	if(preview.curAnim() !== `${NAMES[i]}-idle`){
  		preview.play(NAMES[i] + "-idle");
  	}
  	animPreview.frame = FRAMES[i];
		name.text = stats[NAMES[i]].name;
		description.text = `"${stats[NAMES[i]].bio}"`;
		playerBuff.curBuffDesc = PLAYERS_BUFF_DESC[NAMES[i]];
		playerBuff.curBuffName = PLAYERS_BUFF_NAMES[i].toUpperCase();
		buffs[0] = playerBuff[NAMES[i]];
		buffs[1] = buffBox.get("buff holder")[0].info;
		buffs[2] = buffBox.get("buff holder")[1].info;
		if(playerBuff.isHovering()){
			buffHelp.text = `[gold] ${playerBuff.curBuffName}[/gold]\n[green] ${playerBuff.curBuffDesc}[/green]`;
		}
		// attr.text = `[green]  HP: ${stats[NAMES[i]].hp} [/green]\n[red]  ATK: ${stats[NAMES[i]].atk} [/red]\n[slate]  SPEED: ${stats[NAMES[i]].speed}[/slate]`;
  })

	onClick("buff holder", (b) => {
		if(b.occupied){
			b.occupied = "empty";
			b.frame = 3;
			b.use("empty");
			buffBox.get("buff")[b.buffIdx].equipped = false;
			b.idx = 4;
		}
	})

	onHover("buff", (b) => {
		buffHelp.text = `[green] ${b.description[0]}[/green]\n[red] ${b.description[1]}[/red]`;
	})
	onHover("buff holder", (b) => {
		if(!b.occupied){
			buffHelp.text = "Empty buff holder";
		} else {
			buffHelp.text = `[green] ${b.curBuffDesc[0]}[/green]\n[red] ${b.curBuffDesc[1]}[/red]`;
		}
	})
	playerBuff.onHover(() => {
		buffHelp.text = `[gold] ${playerBuff.curBuffName}[/gold]\n[green] ${playerBuff.curBuffDesc}[/green]`;
	}) 
	onHoverEnd("buff", (b) => {
		buffHelp.text = "Hover a buff to check its properties\nclick on a buff to equip.";
	})
	onHoverEnd("buff holder", (b) => {
		buffHelp.text = "Hover a buff to check its properties\nclick on a buff to equip.";
	})
	playerBuff.onHoverEnd(() => {
		buffHelp.text = "Hover a buff to check its properties\nclick on a buff to equip.";
	})

  
  onKeyPress("right", () => {
  	i = i == FRAMES.length - 1 ? 0 : i+=1;
		playerBuff.frame = playerBuff.frame == 4 ? 6 : playerBuff.frame-1;
  })
  onKeyPress("left", () => {
  	i = i == 0 ? FRAMES.length-1 : i-=1;
		playerBuff.frame = playerBuff.frame == 6 ? 4 : playerBuff.frame+1;
  })
  
  onKeyPress("enter", () => {
		music.paused = true;
  	go("play", NAMES[i], buffs);
  })
}
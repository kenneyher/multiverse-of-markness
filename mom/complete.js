import { CONSTANTS } from "./constants.js";

export default (boss) => {
  const msgs = add([]);

  msgs.add([
    text("BOSS DEFEATED!", {
      size: 40*CONSTANTS.SCALE,
      font: "dimanSquares",
    }),
    pos(width()/2, 50*CONSTANTS.SCALE),
    anchor("center"),
  ])

  msgs.add([
    text("One less threat will no longer torment the universe", {
      size: 20*CONSTANTS.SCALE,
    }),
    pos(width()/2, height()/2),
    anchor("center"),
  ])
  msgs.add([
    text("Thanks for playing the early access\nStay tuned to play the full version", {
      size: 15*CONSTANTS.SCALE,
    }),
    pos(width()/2, height()/2 + 50*CONSTANTS.SCALE),
    anchor("center"),
  ])

  msgs.add([
    text("press [gold]Enter[/gold] to return to the main screen", {
      size: 15*CONSTANTS.SCALE,
      font: "dimanSquares",
      styles: {
        "gold": {
          color: rgb(253, 255, 92),
        }
      }
    }), 
    pos(width() - 200*CONSTANTS.SCALE, height() - 25*CONSTANTS.SCALE),
    anchor('center'),
    opacity(0),
    state('hide', ["show", "hide"]),
    "blink"
  ])

  const press = msgs.get("blink")[0]
  press.onStateEnter("show", async () => {
    press.opacity = 1;
    await wait(0.75, () => press.enterState("hide"))
  })
  press.onStateEnter("hide", async () => {
    press.opacity = 0;
    await wait(0.25, () => press.enterState('show'))
  })

  onKeyPress("enter", () => {
    go("main");
  })
} 
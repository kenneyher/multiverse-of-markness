import { CONSTANTS } from "./constants.js";

export default () => {
  const LOGO = add([])

  LOGO.add([
    text("MARK", {
      size: 40*CONSTANTS.SCALE, 
      font: "dimanSquares",
    }),
    pos(width()/2, 20 * CONSTANTS.SCALE),
    anchor("center"),
    color(253, 255, 92),
  ])

  LOGO.add([
    text("in the", {
      size: 20*CONSTANTS.SCALE,
    }),
    pos(width()/2, 50*CONSTANTS.SCALE),
    anchor('center'),
    color(230, 240, 255),
  ])

  LOGO.add([
    text("MULTIVERSE OF MARKNESS", {
      font:"dimanSquares",
      size: 60*CONSTANTS.SCALE,
      width: 800*CONSTANTS.SCALE,
      align: "center"
    }),
    pos(width()/2, 120 * CONSTANTS.SCALE),
    anchor('center'),
    color(199, 0, 57),
  ])

  LOGO.add([
    text("early access", {
      size: 15*CONSTANTS.SCALE,
      font: 'dimanSquares'
    }),
    pos(width()/2, height() - 25*CONSTANTS.SCALE),
    anchor('center'),
    color(253, 255, 92),
  ])

  const ui = add([])

  ui.add([
    text("press [gold]Enter[/gold] to start", {
      size: 20*CONSTANTS.SCALE,
      font: "dimanSquares",
      styles: {
        "gold": {
          color: rgb(253, 255, 92),
        }
      }
    }), 
    pos(width()/2, height()/2),
    anchor('center'),
    opacity(0),
    state('hide', ["show", "hide"]),
    "blink"
  ])

  const press = ui.get("blink")[0]
  press.onStateEnter("show", async () => {
    press.opacity = 1;
    await wait(0.75, () => press.enterState("hide"))
  })
  press.onStateEnter("hide", async () => {
    press.opacity = 0;
    await wait(0.25, () => press.enterState('show'))
  })

  onKeyPress("enter", () => {
    go("choose");
  })

}
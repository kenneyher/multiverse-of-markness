export const CONSTANTS = {
  SCALE: window.innerWidth/800,
  BUFFS: [
    {
      name: "coffee beans",
      description: [
        "Increase SPD by 25%",
        "Decrease HP by 1",
      ],
      buff: {target: "speed", type: "increment", change: 25},
      debuff: {target: "hp", type: "decreasement", change: 1},
    },
    {
      name: "gain muscle",
      description: [
        "Increase ATK by 1",
        "Decrease SPD by 25%",
      ],
      buff: {target: "atk", type: "increment", change: 1},
      debuff: {target: "speed", type: "decreasement", change: 25},
    },
    {
      name: "markmor",
      description: [
        "Increase HP by 1",
        "Decrease ATK by 50%",
      ],
      buff: {target: "hp", type: "increment", change: 1},
      debuff: {target: "atk", type: "decreasement", change: 0.5},
    }
  ]
};
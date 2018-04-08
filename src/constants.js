const WIDTH = 80;

module.exports = {
  AREA: [{ x: 5, y: 5 }, { x: 90, y: 15 }, { x: 70, y: 60 }, { x: 25, y: 50 }],
  // AREA: [{ x: 5, y: 5 }, { x: 30, y: 15 }, { x: 40, y: 30 }, { x: 8, y: 23 }],
  INPUT_FORCE: [...new Array(WIDTH * 2)].map(() => ({
    strength: Math.random() * WIDTH,
    direction: { x: 0, y: 1 }
  }))
};

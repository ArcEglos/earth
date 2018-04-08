const SIDE_LENGTH = 10;

module.exports = {
  SIDE_LENGTH,
  CELL_SIZE: 1,
  INPUT_FORCE: [...new Array(SIDE_LENGTH)].map(() => ({
    strength: Math.random() * SIDE_LENGTH,
    direction: { x: 0, y: 1 },
  })),
};

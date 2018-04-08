const { CELL_SIZE, SIDE_LENGTH, INPUT_FORCE } = require('./constants');
const cellsPerRow = SIDE_LENGTH / CELL_SIZE;

const generatePoints = () => {
  let points = [...new Array(cellsPerRow ** 2)]
    .map((_, index) => {
      return {
        x: Math.random() * cellsPerRow,
        y: Math.random() * cellsPerRow,
        height: Math.random() / 100,
        links: [],
        forces: [],
      };
    })
    .sort((a, b) => a.y - b.y)
    .map((point, index) => ({
      ...point,
      forces: INPUT_FORCE[index] != null ? [INPUT_FORCE[index]] : [],
    }));

  return points;
};

module.exports = {
  generatePoints,
};

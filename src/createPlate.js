const { getConnectedPoints } = require('./getConnectedPoints');
const { generatePoints } = require('./generatePoints');

const createPlate = polygon => {
  const points = generatePoints(polygon);
  const connectedPoints = getConnectedPoints(points);

  return connectedPoints;
};

module.exports = {
  createPlate,
};

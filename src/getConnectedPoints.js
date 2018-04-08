const Delaunator = require('delaunator');

const getConnectedPoints = points => {
  const { triangles } = Delaunator.from(
    points,
    point => point.x,
    point => point.y
  );

  let connectedPoints = [...points];
  for (let i = 0; i + 2 < triangles.length; i += 3) {
    connectedPoints[triangles[i]].links.push(triangles[i + 1]);
    connectedPoints[triangles[i]].links.push(triangles[i + 2]);
    connectedPoints[triangles[i + 1]].links.push(triangles[i]);
    connectedPoints[triangles[i + 1]].links.push(triangles[i + 2]);
    connectedPoints[triangles[i + 2]].links.push(triangles[i]);
    connectedPoints[triangles[i + 2]].links.push(triangles[i + 1]);
  }

  connectedPoints.forEach(point => {
    point.links = [...new Set(point.links)];
  });

  return connectedPoints;
};

module.exports = {
  getConnectedPoints,
};

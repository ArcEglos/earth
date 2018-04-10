const { render } = require('./src/renderPlate');
const { squash } = require('./src/squash');
const { createPlate } = require('./src/createPlate');
const d3Voronoi = require('d3-voronoi');

const generatePlatePolygons = area => {
  const voronoiPoints = [...new Array(10)].map(() => [
    Math.random() * area.width,
    Math.random() * area.height,
  ]);
  const voronoi = d3Voronoi.voronoi();
  voronoi.extent([[0, 0], [area.width, area.height]]);
  return voronoi
    .polygons(voronoiPoints)
    .map(polygon => polygon.map(point => ({ x: point[0], y: point[1] })));
};

const { AREA } = require('./src/constants');
const plates = generatePlatePolygons(AREA).map(platePolygon => ({
  border: platePolygon,
  points: createPlate(platePolygon),
}));

plates.map((plate, index) => {
  render(plate, `plate_${index}`);
});

// const finishedMesh = squash(plate);

// render(finishedMesh, '0');

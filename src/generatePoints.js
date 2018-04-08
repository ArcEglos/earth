const { INPUT_FORCE, AREA } = require("./constants");
const { getLength, getUnit, crossProduct, aToB } = require("./vector");

const getBoundingBox = points => ({
  x1: Math.min(...points.map(corner => corner.x)),
  x2: Math.max(...points.map(corner => corner.x)),
  y1: Math.min(...points.map(corner => corner.y)),
  y2: Math.max(...points.map(corner => corner.y))
});

const getSurfaceArea = points =>
  points.reduce((memo, point, index) => {
    const nextPoint = points[index + 1] || points[0];

    return memo + crossProduct(point, nextPoint) / 2;
  }, 0);

const hasIntersection = (line1, line2) => {
  const areaUnderDirections = crossProduct(line1.line, line2.line);

  if (areaUnderDirections === 0) {
    return false;
  }

  const line1Factor =
    crossProduct(aToB(line1.root, line2.root), line2.line) /
    areaUnderDirections;
  const line2Factor =
    crossProduct(aToB(line1.root, line2.root), line1.line) /
    areaUnderDirections;
  // console.log(line1Factor, line2Factor);
  if (
    line1Factor >= 0 &&
    line1Factor <= 1 &&
    line2Factor >= 0 &&
    line2Factor <= 1
  ) {
    return true;
  }
  return false;
};

const generatePoints = () => {
  let sides = AREA.map((corner, index) => {
    const nextCorner = AREA[index + 1] || AREA[0];
    return aToB(corner, nextCorner);
  });

  let borderPoints = [].concat(
    ...sides.map((side, sideIndex) => {
      const sideLength = getLength(side);
      const sideDirection = getUnit(side);

      const numPoints = Math.floor(sideLength / 2);
      const distance = sideLength / numPoints;

      return [...new Array(numPoints)].map((_, index) => ({
        x: AREA[sideIndex].x + index * distance * sideDirection.x,
        y: AREA[sideIndex].y + index * distance * sideDirection.y,
        height: 0,
        links: [],
        forces:
          sideIndex !== 0
            ? []
            : [
                {
                  strength: Math.random() * sideLength,
                  direction: {
                    x: -sideDirection.y,
                    y: sideDirection.x
                  }
                }
              ],
        forceHistory: [],
        border: true
      }));
    })
  );

  const areaBoundingBox = getBoundingBox(AREA);

  let points = [];
  const wantedPoints = getSurfaceArea(AREA);
  const rayStart = {
    x: areaBoundingBox.x1 - 2,
    y: areaBoundingBox.y1 - 2
  };

  while (points.length < wantedPoints) {
    const candidate = {
      x:
        Math.random() * (areaBoundingBox.x2 - areaBoundingBox.x1) +
        areaBoundingBox.x1,
      y:
        Math.random() * (areaBoundingBox.y2 - areaBoundingBox.y1) +
        areaBoundingBox.y1,
      height: Math.random() / 100,
      links: [],
      forceHistory: [],
      forces: []
    };

    const ray = {
      root: rayStart,
      line: aToB(rayStart, candidate)
    };
    const numHits = sides.reduce((memo, side, sideIndex) => {
      // console.log(ray, {
      //   root: AREA[sideIndex],
      //   line: side
      // });
      if (
        hasIntersection(ray, {
          root: AREA[sideIndex],
          line: side
        })
      ) {
        return memo + 1;
      }
      return memo;
    }, 0);
    // console.log(numHits);
    if (numHits % 2 === 1) {
      points.push(candidate);
    }
  }

  return [...points, ...borderPoints];
};

module.exports = {
  getBoundingBox,
  generatePoints
};

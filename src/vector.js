const getLength = ({ x, y }) => Math.sqrt(x ** 2 + y ** 2);

const getUnit = v => {
  const length = getLength(v);
  return {
    x: v.x / length,
    y: v.y / length
  };
};

const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y;

const crossProduct = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

const aToB = (v1, v2) => ({
  x: v2.x - v1.x,
  y: v2.y - v1.y
});

module.exports = {
  getLength,
  getUnit,
  dotProduct,
  aToB,
  crossProduct
};

const { render } = require('./src/renderToSvg');
const { getConnectedPoints } = require('./src/getConnectedPoints');
const { generatePoints } = require('./src/generatePoints');

const points = generatePoints();

const connectedPoints = getConnectedPoints(points);

// render initial setup
render(connectedPoints, 'initiate');

const mesh = [...connectedPoints];
for (let meshIndex = 0; meshIndex < mesh.length; meshIndex++) {
  const point = mesh[meshIndex];

  if (point.forces.length !== 0) {
    const netForce = point.forces.reduce(
      (memo, { direction, strength }) => ({
        x: memo.x + direction.x * strength,
        y: memo.y + direction.y * strength,
      }),
      { x: 0, y: 0 }
    );
    const netStrength = Math.sqrt(netForce.x ** 2 + netForce.y ** 2);

    // calculate how much of the force is going in which direction
    const up = netStrength * (0.05 + Math.random() * 0.1);
    const forward = netStrength;

    const forwardForces = point.links
      .filter(pointIndex => mesh[pointIndex].y > point.y)
      .map(pointIndex => {
        const link = {
          x: mesh[pointIndex].x - point.x,
          y: mesh[pointIndex].y - point.y,
        };
        const length = Math.sqrt(link.x ** 2 + link.y ** 2);
        const direction = {
          x: link.x / length,
          y: link.y / length,
        };

        const netForwardStrength = point.forces.reduce(
          (memo, force) =>
            memo +
            Math.max(
              0,
              force.direction.x * force.strength * direction.x +
                force.direction.y * force.strength * direction.y
            ),
          0
        );

        console.log(netForwardStrength);

        mesh[pointIndex].forces.push({
          strength: netForwardStrength * 0.5,
          direction: direction,
        });
      });

    mesh[meshIndex] = {
      ...point,
      // TODO: This might result in "swapping" of two points
      // and reordering is actually quite hard in the current datastructure
      // x: point.x + netForce.x / 100,
      // y: point.x + netForce.y / 100,
      // TODO: we need this "reset" for running in multiple rounds
      // forces: [],
      height: point.height + up / 100,
    };
  }
}

render(mesh, '0');

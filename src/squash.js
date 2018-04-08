const { getLength, getUnit } = require("./vector");

const squash = mesh => {
  const newMesh = mesh.map(({ forceHistory, forces, ...point }) => ({
    ...point,
    forces: [],
    forceHistory: [...forceHistory, forces]
  }));

  console.log("FLOW", mesh.filter(point => point.forces.length > 0).length);
  mesh.forEach((point, meshIndex) => {
    if (point.forces.length === 0) {
      return;
    }

    const netForce = point.forces.reduce(
      (memo, { direction, strength }) => ({
        x: memo.x + direction.x * strength,
        y: memo.y + direction.y * strength
      }),
      { x: 0, y: 0 }
    );
    const netStrength = getLength(netForce);

    // // calculate how much of the force is going in which direction
    const up = Math.log(netStrength + 1); // * (0.05 + Math.random() * 0.1);

    // generate the forces the point exerts on its links
    const forwardForces = point.links
      .filter(pointIndex => mesh[pointIndex].border !== true)
      .map(pointIndex => {
        const link = {
          x: mesh[pointIndex].x - point.x,
          y: mesh[pointIndex].y - point.y
        };
        const direction = getUnit(link);

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

        if (netForwardStrength > 0.01) {
          newMesh[pointIndex].forces.push({
            strength: netForwardStrength * 0.5,
            direction: direction
          });
        }
      });

    newMesh[meshIndex].height += up;
  });

  if (newMesh.find(point => point.forces.length > 0) != null) {
    return squash(newMesh);
  }
  return newMesh;
};

module.exports = {
  squash
};

const { render } = require("./src/renderToSvg");
const { getConnectedPoints } = require("./src/getConnectedPoints");
const { generatePoints } = require("./src/generatePoints");
const { squash } = require("./src/squash");

const points = generatePoints();

const connectedPoints = getConnectedPoints(points);

// render initial setup
render(connectedPoints, "initiate");

const finishedMesh = squash(connectedPoints);

render(finishedMesh, "0");

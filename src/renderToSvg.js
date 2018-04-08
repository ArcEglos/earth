const ReactDOMServer = require("react-dom/server");
const { createElement: ce } = require("react");
const fs = require("fs");
const { AREA } = require("./constants");
const { getBoundingBox } = require("./generatePoints");

// Arithmetic operation needed to prevent hue-shift when blending colors
const lerp = (start, end, amount) => start + (end - start) * amount;
// Color blending (and weird hex formatting)
const blendColors = (startColor, addingColor, amount) => {
  const startChans = startColor.slice(1).match(/.{1,2}/g);
  const addingChans = addingColor.slice(1).match(/.{1,2}/g);
  return `#${startChans
    .map((startChan, i) =>
      Math.round(
        lerp(parseInt(startChan, 16), parseInt(addingChans[i], 16), amount)
      ).toString(16)
    )
    .map(rawColor => (rawColor.length === 1 ? `0${rawColor}` : rawColor))
    .join("")}`;
};

const SCALE = 10;

const render = (points, name) => {
  const boundingBox = getBoundingBox(AREA);

  const heights = points.map(point => point.height);
  const min = Math.min(...heights);
  const max = Math.max(...heights);

  const string = ReactDOMServer.renderToString(
    ce(
      "svg",
      {
        width: boundingBox.x2 * SCALE,
        height: boundingBox.y2 * SCALE,
        xmlns: "http://www.w3.org/2000/svg"
        // viewBox: `0 0 ${boundingBox.x2 - boundingBox.x} ${boundingBox.y2 -
        //   boundingBox.y1}`
      },
      points.filter(point => point.border !== true).map((point, index) =>
        ce("g", { key: index }, [
          ce("circle", {
            key: "c",
            cx: point.x * SCALE,
            cy: point.y * SCALE,
            r: 2 * SCALE / 10,
            fill: point.border
              ? "#ff00ff"
              : blendColors(
                  "#006600",
                  "#ff0000",
                  (point.height - min) / (max - min)
                )
          }),
          ...point.links
            .filter(target => target > index && points[target].border !== true)
            .map(link =>
              ce("line", {
                key: link,
                x1: point.x * SCALE,
                y1: point.y * SCALE,
                x2: points[link].x * SCALE,
                y2: points[link].y * SCALE,
                stroke: "#666",
                strokeWidth: 0.2
              })
            ),
          ce(
            "text",
            {
              x: point.x * SCALE,
              y: point.y * SCALE,
              style: {
                fontSize: "8px"
              }
            },
            // [].concat(...point.forceHistory).length
            point.height.toFixed(0)
          )
        ])
      )
    )
  );

  fs.writeFileSync(`./debug/${name}.svg`, string);
};

module.exports = {
  render
};

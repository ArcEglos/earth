const ReactDOMServer = require('react-dom/server');
const { createElement: ce } = require('react');
const fs = require('fs');
const { CELL_SIZE, SIDE_LENGTH } = require('./constants');

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
    .join('')}`;
};

const SCALE = 50;

const render = (points, name) => {
  const size = SIDE_LENGTH / CELL_SIZE * SCALE;

  const heights = points.map(point => point.height);
  const min = Math.min(...heights);
  const max = Math.max(...heights);

  const string = ReactDOMServer.renderToString(
    ce(
      'svg',
      {
        width: size,
        height: size,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${size} ${size}`,
      },
      points.map((point, index) =>
        ce('g', { key: index }, [
          ce('circle', {
            key: 'c',
            cx: point.x * SCALE,
            cy: point.y * SCALE,
            r: 1.5 * SCALE / 10,
            fill: blendColors(
              '#006600',
              '#ff0000',
              (point.height - min) / (max - min)
            ),
          }),
          ...point.links.filter(target => target > index).map(link =>
            ce('line', {
              key: link,
              x1: point.x * SCALE,
              y1: point.y * SCALE,
              x2: points[link].x * SCALE,
              y2: points[link].y * SCALE,
              stroke: '#ccc',
              strokeWidth: 0.2,
            })
          ),
          ...point.forces.map((force, forceIndex) =>
            ce('line', {
              key: forceIndex,
              x1: point.x * SCALE,
              y1: point.y * SCALE,
              x2: (point.x + force.direction.x * force.strength / 10) * SCALE,
              y2: (point.y + force.direction.y * force.strength / 10) * SCALE,
              stroke: '#00aaff',
              strokeWidth: 0.8,
            })
          ),
        ])
      )
    )
  );

  fs.writeFileSync(`./debug/${name}.svg`, string);
};

module.exports = {
  render,
};

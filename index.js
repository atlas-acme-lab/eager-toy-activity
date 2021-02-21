const Beholder = window['beholder-detection'];

const AXIS_STEPS = 10;

let topAnchor;
let bottomAnchor;
let columnData = [];

const dot = (x1, y1, x2, y2) => (x1 * x2) + (y1 * y2);
const magnitude = (x, y) => Math.sqrt(x * x + y * y);
const getColData = (marker, axisVector, axisLength) => {
  let x = marker.center.x - bottomAnchor.center.x;
  let y = marker.center.y - bottomAnchor.center.y;

  let convert = dot(x, y, axisVector.x, axisVector.y) / (axisLength * axisLength);
  x *= convert;
  y *= convert;
  return (magnitude(x, y) / axisLength);
}

function init() {
  Beholder.init('#beholder-div');

  bottomAnchor = Beholder.getMarker(0);
  topAnchor = Beholder.getMarker(1);

  // Do this for all the values you want
  columnData.push({
    marker: Beholder.getMarker(2),
    value: 0,
    rawValue: 0,
  });

  update();
}

let prevTime = Date.now();
function update() {
  let currentTime = Date.now();
  let dt = currentTime - prevTime;
  prevTime = currentTime;
  Beholder.update();

  const axisVec = topAnchor.center.clone().sub(bottomAnchor.center);
  const axisMag = axisVec.mag();

  // Update the column marker values
  columnData.forEach(cd => {
    // should be btw zero and 1
    cd.rawValue = getColData(cd.marker, axisVec, axisMag);
    cd.value = Math.round(cd.rawValue * AXIS_STEPS);
  });

  requestAnimationFrame(update);
}

window.onload = init;

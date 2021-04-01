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

// Class for updating the bars. Provide the color component of the id in html
class ChartBar {
  constructor(id) {
    this.input = document.querySelector(`#${id}-input`);
    this.expected = document.querySelector(`#${id}-expected`);
    this.set = document.querySelector(`#${id}-user-set`);

    this.input.addEventListener('change', (e) => {
      this.expected.style.height = `calc(${e.target.value * 10}% + ${window.innerHeight / 105}px)`;
    });
  }

  // Sets bar to match value passed in
  // TODO: add validation
  setUserVal(v) {
    this.set.style.height = `${v * 10}%`;
  }
}

const bars = [];
function initChart() {
  // This just controls the chart
  bars.push(new ChartBar('red'));
} 

function init() {
  initChart();
  Beholder.init('#beholder-div');

  // We still need anchors to track the bar chart
  bottomAnchor = Beholder.getMarker(0);
  topAnchor = Beholder.getMarker(1);

  // Do this for all the values you want
  columnData.push({
    marker: Beholder.getMarker(2), // Get that marker ref
    value: 0,
    rawValue: 0,
    chartID: 0, // This maps to the placement of the chart in the array
  });

  update();
}

// For tracking delta time
let prevTime = Date.now();
function update() {
  let currentTime = Date.now();
  let dt = currentTime - prevTime;
  prevTime = currentTime;

  Beholder.update();

  // These vectors are for mapping the marker values to ints between 0 and 10
  const axisVec = topAnchor.center.clone().sub(bottomAnchor.center);
  const axisMag = axisVec.mag();

  // Update the column marker values
  columnData.forEach(cd => {
    // raw value should be btw zero and 1
    cd.rawValue = getColData(cd.marker, axisVec, axisMag);
    cd.value = Math.round(cd.rawValue * AXIS_STEPS);
    bars[cd.chartID].set(cd.value);
  });


  requestAnimationFrame(update);
}

// This is for just messing with the charts without the marker stuffs
window.onload = initChart;

// This is the real one
// window.onload = init;

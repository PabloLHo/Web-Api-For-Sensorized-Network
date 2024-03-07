const margin = {
  top: 0,
  right: 0,
  bottom: 30,
  left: 1,
};

const width = 700 - (margin.left + margin.right);
const height = 200 - (margin.top + margin.bottom);

var n = 10;
constant = -0.1;
data = d3.range(n).map(function() {
    return constant;
});

let svg = d3
    .select('#graph')
    .append('svg')
    .attr('viewBox', `0 0 ${width + (margin.left + margin.right)} ${height + (margin.top + margin.bottom)}`);

var x = d3.scaleLinear()
    .domain([0, n - 1])
    .range([0, width + 80]);

var y = d3.scaleLinear()
    .domain([-1, 1])
    .range([ height, 0]);

var line = d3.line()
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); })
    .curve(d3.curveMonotoneX)

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y))
    .call(svg => svg.select(".domain").remove())

svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line purple")
    .attr("transform", "translate(0,0)")
  .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .on("start", tick);

function tick() {
  // Push a new data point onto the back.
  var randomValue = Math.random();

  var variable;
  if (randomValue < 0.5) {
      variable = 0.3;
  } else {
      variable = -0.5;
  }
  data.push( variable );
  // Redraw the line.
  d3.select(this)
      .attr("d", line)
      .attr("transform", null);
  // Slide it to the left.
  d3.active(this)
      .attr("transform", "translate(" + x(-1) + ",0)")
    .transition()
      .on("start", tick);
  // Pop the old data point off the front.
  data.shift();
}
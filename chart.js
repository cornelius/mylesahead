require('ipc').on('show', function(rawData) {
  var margin = {top: 20, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  d3.select(".the-chart").remove();
  var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "the-chart")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var data = rawData["data"]
  data.forEach(function(d) {
    d.date = new Date(d["date"])
    d.value = d["value"]
  })

  var maxDate = new Date(d3.max(data, function(d) { return d.date }))
  maxDate.setDate(maxDate.getDate() + 1)

  var minDate = new Date(d3.min(data, function(d) { return d.date }))
  minDate.setDate(minDate.getDate() - 1)

  var dateCount = d3.time.days(minDate, maxDate).length + 1
  var barWidth = width / dateCount

  x.domain([minDate, maxDate])

  y.domain([0, d3.max(data, function(d) { return Number(d.value); })])

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("steps");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date) - barWidth / 2; })
      .attr("width", barWidth )
      .attr("y", height)
      .attr("height", 0);

  svg.selectAll(".bar").transition()
    .attr("y", function(d) { return y(d.value); })
    .attr("height", function(d) { return height - y(d.value); })
});

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Create the SVG container for the scatter plot and append it 
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Shift everything over by the left and top margins 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Initial parameters 
var chosenXaxis = "age";
var chosenYaxis = "smokes";

// Create a function that will update the X-scale upon click 
function xScale(censusData, chosenXaxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenXaxis]) * 0.8,
        d3.max(censusData, d => d[chosenXaxis]) * 1.2
      ])
      .range([0, width]);
    return xLinearScale;
  
}

// Create a function that will update the Y-scale upon click 
function yScale(censusData, chosenYaxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(censusData, d => d[chosenYaxis]) * 0.8,
        d3.max(censusData, d => d[chosenYaxis]) * 1.2
      ])
      .range([height, 0]); 
    return yLinearScale;
  
}

// Create a function that will update the xAxis upon click of the axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
}

// Create a function that will update the yAxis upon click of the axis label
function renderAxes(newYScale, yAxis) {
    var bottomAxis = d3.axisBottom(newYScale); 
    yAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return yAxis;
}


// Create a function that will update the circles group with a transition 
function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXaxis]))
      .attr("cy", d => newYScale(d[chosenYaxis]));
    return circlesGroup;
}

// Create a function that will update the text within the circles 
function renderText(circletextGroup, newXScale, chosenYaxis, newYScale, chosenYaxis) {
    circletextGroup.transition()
        .attr("x", d => newXScale(d[chosenXaxis]))
        .attr("y", d => newYScale(d[chosenYaxis]));
    return circletextGroup;
}





// Load data from hours-of-tv-watched.csv
d3.csv("./assets/data/data.csv").then(function(censusData) {

    console.log(censusData);
  
}).catch(function(error) {
    console.log(error);
});
  

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

// Create function to update the circles group with new tooltip
function updateToolTip(chosenXaxis, chosenYaxis, circlesGroup) {
    var xlabel;
    var yLabel;

    if (chosenXaxis === "age") {
        xlabel = "Age";
    }
    else {
        xlabel = "In Poverty (%)";
    }

    if (chosenYaxis === "smokes") {
        ylabel = "Smoker (%)"
    }
    else {
        ylabel = "Lacks Healthcare (%)"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([100, -60])
        .html(function(d) {
        return (`${d.state}<br>
            ${xlabel} ${d[chosenXaxis]}<br>${yLabel} ${d[chosenYaxis]}`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    }).on("mouseout", function(d) {
        toolTip.hide(d);
    });

    return circlesGroup;
}


// Load data from the data.csv
d3.csv("./assets/data/data.csv").then(function(cenData, err) {
    if (err) throw err;

    // console.log(cenData);

    // Parse the relevant data 
    cenData.forEach(function(data) {
        data.age = +data.age;
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
    });

    // Call the xScale function and pass in cenData and chosenXaxis 
    var xLinearScale = xScale(cenData, chosenXaxis);

    // Call the yScale function and pass in cenData and chosenYaxis 
    var yLinearScale = yScale(cenData, chosenYaxis);

    // Create the initial axis functions 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append the x axis 
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // Append the y axis 
    chartGroup.append("g")
        .call(leftAxis);

    // Append the initial circles 
    var circlesGroup = chartGroup.selectAll("circle")
        .data(cenData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5")

    // Create group for two 

  
}).catch(function(error) {
    console.log(error);
});
  

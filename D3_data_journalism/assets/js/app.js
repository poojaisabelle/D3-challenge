// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 600;

// Define the chart's margins as an object
var chartMargin = {
  top: 20,
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
function xScale(cenData, chosenXaxis) {

    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(cenData, d => d[chosenXaxis]) * 0.8,
        d3.max(cenData, d => d[chosenXaxis]) * 1.2
      ]).range([0, chartWidth]);

    return xLinearScale;  
}

// Create a function that will update the Y-scale upon click 
function yScale(cenData, chosenYaxis) {

    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(cenData, d => d[chosenYaxis]) * 0.8,
        d3.max(cenData, d => d[chosenYaxis]) * 1.2
      ]).range([chartHeight, 0]);

    return yLinearScale;
  
}

// Create a function that will update the xAxis upon click of the axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
}

// Create a function that will update the yAxis upon click of the axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale); 
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
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
function renderText(circletextGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {
    circletextGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXaxis]))
        .attr("y", d => newYScale(d[chosenYaxis]));
    return circletextGroup;
}

// Create function to update the circles group with new tooltip
function updateToolTip(chosenXaxis, chosenYaxis, circletextGroup) {
    var xLabel;
    var yLabel;

    if (chosenXaxis === "age") {
        xLabel = "Age";
    }
    else {
        xLabel = "In Poverty (%)";
    }

    if (chosenYaxis === "smokes") {
        yLabel = "Smoker (%)"
    }
    else {
        yLabel = "Lacks Healthcare (%)"
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function (d) {
        return (`${d.state}<br>${xLabel} ${d[chosenXaxis]}<br>${yLabel} ${d[chosenYaxis]}`);
    });

    circletextGroup.call(toolTip);

    circletextGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
    }).on("mouseout", function(d) {
        toolTip.hide(d);
    });

    return circletextGroup;
}


// Load data from the data.csv
d3.csv("./assets/data/data.csv").then(function(cenData, err) {
    if (err) throw err;

    // console.log(cenData);

    // Parse the relevant data 
    cenData.forEach(function(data) {
        data.abbr = data.abbr;
        data.state = data.state;
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
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append the y axis 
    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    // Append the initial circles 
    var circlesGroup = chartGroup.selectAll()
        .data(cenData)
        .enter()
        .append("circle")
        .attr("class", "stateCircles")
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // Append the state abbreviations to the inside of the circle 
    var circletextGroup = chartGroup.selectAll()
        .data(cenData)
        .enter()
        .append("text")
        .text(d => (d.abbr))
        .attr("class", "stateAbbr")
        .attr("x", d => xLinearScale(d[chosenXaxis]))
        .attr("y", d => yLinearScale(d[chosenYaxis]))
        .attr("dy", 3);

    // Create a label group for two x-axis labels 
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
    
    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") 
        .classed("active", true)
        .text("Median Age");

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("In Poverty (%)");

    
    var healthcareLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (chartMargin.left) * 3)
        .attr("y", 0 - (chartHeight - 40))
        .attr("value", "healthcare") 
        .classed("inactive", true)
        .text("Lacks Healthcare (%)"); 
    
    var smokesLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", (chartMargin.left) * 3)
        .attr("y", 0 - (chartHeight - 20))
        .attr("value", "smokes") 
        .classed("active", true)
        .text("Smokes (%)");
    
        // Update ToolTip function 
        var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

    
        // Add the event listeners for the X-axis 
        labelsGroup.selectAll("text")
            .on("click", function() {

                // Obtain the value of selection
                var value = d3.select(this)
                    .attr("value");
                
                // Replaces the chosenXaxis with value chosen
                if (value !== chosenXaxis) {

                    chosenXaxis = value;
                    // console.log(chosenXaxis);

                    // Call the xScale function 
                    xLinearScale = xScale(cenData, chosenXaxis);

                    // Update the X-axis with transition 
                    xAxis = renderXAxes(xLinearScale, xAxis);

                    // Change classes to change bold text 
                    if (chosenXaxis === "age") {
                        ageLabel.classed("active", true)
                            .classed("inactive", false);
                        povertyLabel.classed("active", false)
                            .classed("inactive", true);
                    }
                    else {
                        ageLabel.classed("active", false)    
                            .classed("inactive", true);
                        povertyLabel.classed("active", true)
                            .classed("inactive", false);
                    }

                    // Update the circles with the new x values 
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis);

                    // Update the text with the new values 
                    circletextGroup = renderText(circletextGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis);

                    // Update the ToolTips with the new information 
                    circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);


                }

                else {

                    chosenYaxis = value;

                    // Call the xScale function 
                    yLinearScale = yScale(cenData, chosenYaxis);

                    // Update the X-axis with transition 
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // Change classes to change bold text 
                    if (chosenYaxis === "smokes") {
                        healthcareLabel.classed("inactive", true)
                            .classed("active", false);
                        smokesLabel.classed("active", true)
                            .classed("inactive", false);
                    }
                    else {
                        healthcareLabel.classed("inactive", false)
                            .classed("active", true);
                        smokesLabel.classed("active", false)
                            .classed("inactive", true);
                    } 

                    // Update the circles with the new x values 
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis);

                    // Update the text with the new values 
                    circletextGroup = renderText(circletextGroup, xLinearScale, chosenXaxis, yLinearScale, chosenYaxis);
                    
                    // Update the ToolTips with the new information 
                    circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);      
                }
        });
        
}).catch(function(error) {
    console.log(error);
});
  

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
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    // Append the y axis 
    chartGroup.append("g")
        .call(leftAxis);

    // Append the initial circles 
    var circlesGroup = chartGroup.selectAll()
        .data(cenData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXaxis]))
        .attr("cy", d => yLinearScale(d[chosenYaxis]))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

    // Append the state abbreviations to the inside of the circle 
    var innerCircleText = chartGroup.selectAll()
        .data(cenData)
        .enter()
        .append("text")
        .classed("stateAbbr", true)
        .text(d => (d.abbr))
        .attr("x", d => xLinearScale(d[chosenXaxis]))
        .attr("y", d => yLinearScale(d[chosenYaxis]))
        .attr("dy", 3);

    // Create a label group for two x-axis labels 
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight +20})`);
    
    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") 
        .classed("active", true)
        .text("Median Age");

    var povertyLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty")
        .classed("inactive", true)
        .text("In Poverty (%)")
    
    // Create a label group for two y-axis labels 
    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90");

    
    var smokesLabel = ylabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 20 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") 
        .classed("active", true)
        .text("Smokes (%)");

    var healthcareLabel = ylabelsGroup.append("text")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 40 - (chartHeight / 2))
        .attr("dy", "3em")
        .attr("value", "healthcare") 
        .classed("inactive", true)
        .text("Lacks Healthcare (%)"); 
    
        // Update ToolTip function 
        var circlesGroup = updateToolTip(chosenXaxis, chosenYaxis, circlesGroup);

        // Add the event listeners for the X-axis 
        xlabelsGroup.selectAll("text")
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

                    // Update the circles with the new x values 
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXaxis);

                    // Update the text with the new values 
                    circletextGroup = renderText(circletextGroup, xLinearScale, chosenXaxis);

                    // Update the ToolTips with the new information 
                    circletextGroup = updateToolTip(chosenXaxis, chosenYaxis, circletextGroup);

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
                }
            });
        
        ylabelsGroup.selectAll("text")
            .on("click", function() {

                // Obtain the value of selection
                var value = d3.select(this)
                    .attr("value");
                
                // Replaces the chosenXaxis with value chosen
                if (value !== chosenYaxis) {
                    chosenYaxis = value;
                    // console.log(chosenXaxis);

                    // Call the xScale function 
                    yLinearScale = yScale(cenData, chosenYaxis);

                    // Update the X-axis with transition 
                    yAxis = renderYAxes(yLinearScale, yAxis);

                    // Update the circles with the new x values 
                    circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYaxis);

                    // Update the text with the new values 
                    circletextGroup = renderText(circletextGroup, yLinearScale, chosenYaxis);

                    // Update the ToolTips with the new information 
                    circletextGroup = updateToolTip(chosenXaxis, chosenYaxis, circletextGroup);

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
                }
            });
}).catch(function(error) {
    console.log(error);
});
  

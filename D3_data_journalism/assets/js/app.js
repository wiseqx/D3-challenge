// @TODO: YOUR CODE HERE!
function init(){
    var svgArea = d3.select("body").select("svg");

    if (!svgArea.empty()) {
      svgArea.remove();
    }

var svgWidth = window.innerWidth * 0.8;
var svgHeight = svgWidth * 0.65;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


var svg = d3.select("#scatter")
            .append("svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);


var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);


var chosenXAxis = "poverty";

function xScale(govData, chosenXAxis){

    var xLinearScale = d3.scaleLinear()
                        .domain([d3.min(govData, d=>d[chosenXAxis]) * 0.8,
                                d3.max(govData, d => d[chosenXAxis]) * 1.2])
                        .range([0, width]);
    
    return xLinearScale;
}

var chosenYAxis = "healthcare";

function yScale(govData, chosenYAxis){

    var yLinearScale = d3.scaleLinear()
                        .domain([d3.min(govData, d => d[chosenYAxis]) * 0.8, 
                                 d3.max(govData, d => d[chosenYAxis]) * 1.2])
                        .range([height, 0]);

    return yLinearScale;
}


function renderXAxes(newXScale, xAxis){

    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis)

    return xAxis;

}

function renderYAxes(newYScale, yAxis){

    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
         .duration(1000)
         .call(leftAxis);

    return yAxis;

}


function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){

    circlesGroup.transition()
                .duration(1000)
                .attr("cx", d => newXScale(d[chosenXAxis]))
                .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesGroup;
}

//text for states
function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis){
   
    textGroup.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var toolTip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-4, 0])
                    .html(function(d){
                        return (`${d.state}<br>${chosenXAxis}: ${d[chosenXAxis]}<br>${chosenYAxis}: ${d[chosenYAxis]}`);
                    });


    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(d){
        toolTip.show(d, this);
    })
        .on("mouseout", function(d, i){
            toolTip.hide(d);
        });

    return circlesGroup;
}


d3.csv("assets/data/data.csv").then(function(govData, err){
    if (err) throw err;

    govData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;

    });

    var xLinearScale = xScale(govData, chosenXAxis);

    var yLinearScale = yScale(govData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);

    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
                            .classed("x-axis", true)
                            .attr("transform", `translate(0, ${height})`)
                            .call(bottomAxis);

    
    var yAxis = chartGroup.append("g")
                            .classed("y-axis", true)
                            .call(leftAxis);


    var circlesGroup = chartGroup.selectAll("circle")
                                .data(govData)
                                .enter()
                                .append("circle")
                                .attr("cx", d => xLinearScale(d[chosenXAxis]))
                                .attr("cy", d => yLinearScale(d[chosenYAxis]))
                                .attr("r", svgWidth * 0.012)
                                .attr("fill", "#99ccff");
    

    var textGroup = chartGroup.selectAll("text")
                                .exit()
                                .data(govData)
                                .enter()
                                .append("text")
                                .text(d => d.abbr)
                                .attr("x", d => xLinearScale(d[chosenXAxis]))
                                .attr("y", d => yLinearScale(d[chosenYAxis]))
                                .attr("font-size", parseInt(svgWidth * 0.01) + "px")
                                .attr("text-anchor", "middle")
                                .attr("class", "State-text")
                                .attr("fill", "white");

    

    var xLabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${width / 2}, ${height + 20})`)


    var povertyLabel = xLabelsGroup.append("text")
                                    .attr("x", 0)
                                    .attr("y", 20)
                                    .attr("class", "x-axis-text")
                                    .attr("value", "poverty")
                                    .classed("active", true)
                                    .text("In Poverty (%)");


    var ageLabel = xLabelsGroup.append("text")
                              .attr("x", 0)
                              .attr("y", 40)
                              .attr("class","x-axis-text")
                              .attr("value", "age")
                              .classed("inactive", true)
                              .text("Age (Median)");


    var incomeLabel = xLabelsGroup.append("text")
                                 .attr("x", 0)
                                 .attr("y", 60)
                                 .attr("class","x-axis-text")
                                 .attr("value", "income")
                                 .classed("inactive", true)
                                 .text("Household income (Median)");

    var yLabelsGroup = chartGroup.append("g");
                                 
 

    var obesityLabel = yLabelsGroup.append("text")
                                    .attr("transform", `translate(-80, ${height/2})rotate(-90)`)
                                    .attr("dy", "1em")
                                    .attr("class","y-axis-text")
                                    .attr("value", "obesity")
                                    .classed("inactive", true)
                                    .text("Obese (%)");
    
    var smokesLabel = yLabelsGroup.append("text")
                                    .attr("transform", `translate(-60, ${height/2})rotate(-90)`)
                                    .attr("dy", "1em")
                                    .attr("class","y-axis-text")
                                    .attr("value", "smokes")
                                    .classed("inactive", true)
                                    .text("Smokes (%)");


    var healthcareLabel = yLabelsGroup.append("text")
                                    .attr("transform", `translate(-40, ${height/2})rotate(-90)`)
                                    .attr("dy", "1em")
                                    .attr("class","y-axis-text")
                                    .attr("value", "healthcare")
                                    .classed("active", true)
                                    .text("Lacks Healthcare (%)");

            
    circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
    

    xLabelsGroup.selectAll(".x-axis-text")
                .on("click", function(){
                    var value = d3.select(this).attr("value");

                    if (value !== chosenXAxis) {
                        chosenXAxis = value;
                        console.log(chosenXAxis);
                        

                        xLinearScale = xScale(govData, chosenXAxis);

                        yLinearScale = yScale(govData, chosenYAxis);

                        xAxis = renderXAxes(xLinearScale, xAxis);

                        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                        
                        textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                        if (chosenXAxis === "poverty"){
                            povertyLabel.classed("active", true)
                                        .classed("inactive", false);

                            ageLabel.classed("active", false)
                                    .classed("inactive", true);

                            incomeLabel.classed("active", false)
                                        .classed("inactive", true);

                        }
                        else if (chosenXAxis === "age") {
                            povertyLabel.classed("active", false)
                                        .classed("inactive", true);

                            ageLabel.classed("active", true)
                                    .classed("inactive", false);

                            incomeLabel.classed("active", false)
                                        .classed("inactive", true);
                        }
                        else {
                            povertyLabel.classed("active", false)
                                        .classed("inactive", true);

                            ageLabel.classed("active", false)
                                    .classed("inactive", true);

                            incomeLabel.classed("active", true)
                                        .classed("inactive", false);
                        }

                    }
                });

    
    yLabelsGroup.selectAll(".y-axis-text")
                .on("click", function(){
                    var value = d3.select(this).attr("value");
                    console.log(value)

                    if (value !== chosenYAxis) {
                        chosenYAxis = value;
                        console.log(chosenYAxis);

                        xLinearScale = xScale(govData, chosenXAxis);
                        yLinearScale = yScale(govData, chosenYAxis);

                        yAxis = renderYAxes(yLinearScale, yAxis);

                        circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                        
                        textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                        
                        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                        if (chosenYAxis === "obesity"){
                            obesityLabel.classed("active", true)
                                        .classed("inactive", false);

                            smokesLabel.classed("active", false)
                                        .classed("inactive", true);
                            
                            healthcareLabel.classed("active", false)
                                            .classed("inactive", true);

                        }

                        else if (chosenYAxis === "smokes"){
                            obesityLabel.classed("active", false)
                                        .classed("inactive", true);

                            smokesLabel.classed("active", true)
                                        .classed("inactive", false);
                            
                            healthcareLabel.classed("active", false)
                                            .classed("inactive", true);
                        }

                        else {
                            obesityLabel.classed("active", false)
                                        .classed("inactive", true);

                            smokesLabel.classed("active", false)
                                        .classed("inactive", true);
                            
                            healthcareLabel.classed("active", true)
                                            .classed("inactive", false);
                        }
                    }

                });




}).catch(function(error){
    console.log(error);
});

}

init();
d3.select(window).on("resize", init());
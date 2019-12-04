var timeLineTime = 4500; // Duration of initial line chart transition
var lineCircleRMin = 6; // Radius min and max for line chart
var lineCircleRMax = 11;

// Line chart for history of cryptocurrencies
export default function performStep0(chart, rects, svg, timeline, market_data, 
    x, y, formatNum, tooltipright, tooltiptop, sizeX_with_margins, sizeY_with_margins) {

    console.log('step 0, line graph')

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll('path').remove()
    d3.selectAll('circle').remove()
    chart.style('opacity', 0)
    rects.style('opacity', 0)
    d3.selectAll('.tooltip').style('opacity', 0)
    svg.selectAll(".legendSequential").remove()
    d3.selectAll('.treemap-text').remove()


    // Bring to the front all we want to show
    timeline.transition().style('opacity', 1)
    timeline.raise()

    // Create the line for the viz
    var path = timeline.append("path")
        .datum(market_data)
        .attr("fill", "none")
        .attr("stroke", function(d) {
            return x(d.date < 400) ? 'darkgrey' : 'red';
        } )
        .attr("stroke-width", 1)
        .attr("d", d3.line()
            .x(function (d) { return x(+d.date) })
            .y(function (d) { return y(+d.value) })
        )

    // Variable to Hold Total Length
    var totalLength = path.node().getTotalLength();


    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Call Transition Method
        .duration(timeLineTime) // Set Duration timing (ms)
        .ease(d3.easeLinear) // Set Easing option
        .attr("stroke-dashoffset", 0); // Set final value of dash-offset for transition


    // Circles for tooltip information
    var selectCircle = timeline.selectAll("circle")
        .data(market_data)
        .enter().append('circle')

    // Draw the circles
    timeline.selectAll('circle')
        .attr('class', 'circle')
        .attr('fill', 'lightgrey')
        .attr('r', lineCircleRMin)
        .attr('cx', function (d) {
            return x(+d.date)
        })
        .attr('cy', function (d) { return y(+d.value) })
        .style('opacity', 0)


    setTimeout(function () {

        // Tooltip listeners and writing to DOM
        timeline.selectAll('circle')
            .on('mouseover', function (d, i) {

                d3.select(this).style('cursor', 'pointer')
                d3.select(this).attr('r', lineCircleRMax).style('fill', 'lightgrey').style('stroke', "black")
                d3.select(this).style('opacity', 1)
                let res = d3.selectAll('.tooltip')
                res.style('opacity', 1)
                res.html(dateFormat(d.date) + "</p>"
                    + formatNum(d.value / 1000) + ' billion');
                // res.style('right', tooltipright - 10 + "%");
                // res.style('top', tooltiptop + "%");

                var positionX = d3.select(this).nodes()[0].cx.animVal.value
                var positionY = d3.select(this).nodes()[0].cy.animVal.value
                var offset = d3.event.y - positionY
                res.style('right', function(){
                    if (positionX > sizeX_with_margins/2)
                        return 1.05*sizeX_with_margins - d3.event.pageX + "px"; // TOOLTIP TO THE LEFT
                    return 0.8*sizeX_with_margins - d3.event.pageX + "px";
                })
                res.style('top', d3.event.y-offset - sizeY_with_margins / 10 + "px");
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', lineCircleRMin).style('stroke', "transparent").style('opacity', 0)
                d3.selectAll('.tooltip').style('opacity', 0)
            })

    }, timeLineTime);

    return (chart, rects, svg, timeline)

    // Format date for first viz tooltip
    function dateFormat(s) {
        s = s.toString()
        let index = s.search('00:00:');
        return s.slice(4, 10) + ", " + s.slice(11, index - 1);
    }


}
export default function performStep0(chart, rects, svg, timeline, market_data, timeLineTime, 
    lineCircleRMin, lineCircleRMax, x, y, formatNum, dateFormat, tooltipright, tooltiptop) {

    console.log('step 0, line graph')

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll('path').remove()
    d3.selectAll('circle').remove()
    chart.style('opacity', 0)
    rects.style('opacity', 0)
    d3.selectAll('.tooltip').style('opacity', 0)
    svg.selectAll(".legendSequential").remove()


    // Bring to the front all we want to show
    timeline.transition().style('opacity', 1)
    timeline.raise()

    // Create the line for the viz
    var path = timeline.append("path")
        .datum(market_data)
        .attr("fill", "none")
        .attr("stroke", 'lightgrey')
        .attr("stroke-width", 4)
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
                res.html('<p><category>Total Market Cap:</category> ' + formatNum(d.value)
                    + ' million. <br><category>Date:</category> ' + dateFormat(d.date) + "</p>");
                res.style('right', tooltipright - 10 + "%");
                res.style('top', tooltiptop + "%");
            })
            .on('mouseout', function (d) {
                d3.select(this).attr('r', lineCircleRMin).style('stroke', "transparent").style('opacity', 0)
                d3.selectAll('.tooltip').style('opacity', 0)
            })

    }, timeLineTime);

    return [chart, rects, svg, timeline]


}
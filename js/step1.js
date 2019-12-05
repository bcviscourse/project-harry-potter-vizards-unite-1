// Big "balloon" stage
export default function performStep1(chart, svg, timeline, chartSize, 
    xAxis, sizeY_with_margins, newdata, translate, graphicVisEl, sizeY) {
    console.log('step  1, giant balloon');
    d3.selectAll('.pack').remove()

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll('path').remove()
    d3.selectAll(".y-axis").transition().duration(1000).style('opacity', 0)

    timeline.lower()
    svg.selectAll(".legendSequential").remove()


    // Hide old tooltip:
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)

    // Transition timeline viz out
    timeline.selectAll('path')
        .transition().duration(500)
        .style('opacity', 0)
    timeline.selectAll('circle')
        .transition().duration(500)
        .attr('cy', sizeY_with_margins + 1000)
        .transition().duration(500)
        .style('opacity', 0)

    timeline.transition().duration(500).style('opacity', 0)


    // Hide treemap (in case someone scrolls really fast):
    d3.selectAll('rect').style('opacity', 0);
    d3.selectAll('.treemap-text').remove()

    // Turn on circle elements
    d3.selectAll('circle').style('opacity', 1)

    // Bring "chart" visualization to front
    chart.style('opacity', 1)
    chart.lower()

    // Define a general transition:
    // NOTE: there are various "t" variables across the steps
    //       but have slightly different variations (duration, easing)
    var t = d3.transition()
        .duration(400)
        .ease(d3.easeCubicOut)


    d3.selectAll('.item').remove()

    // Insantiating first circle/balloon: 
    var item = chart.selectAll('.item')
        .data(newdata)
        .enter().append('g')
        .classed('item', true)
        .attr('transform', translate(chartSize / 2, chartSize / 2))

    item.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .style('opacity', 1)

    // Hide x-axis (on scrollup):
    var axis = graphicVisEl.selectAll('.x-axis')
    axis
        .transition(t)
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", "translate(" + 0 + "," + sizeY + ")")
        .style("opacity", 0)


    // Transition for the giant circle:
    var item = graphicVisEl.selectAll('.item')
    item.classed('balloon', true)
    item.transition(t)
        .attr('transform', function (d) {
            return translate(0, 0)
        })

    // Functions to center the first "balloon" under the text correctly
    var center_header_location = document.getElementsByClassName("firstvis")[0];
    var center_balloon_x = center_header_location.clientWidth / 2
    var center_balloon_Y = center_header_location.clientHeight / 2

    // Add the giant circle:
    item.select('circle')
        .style('fill', '#b5b5b5')
        .attr('cx', center_balloon_x)
        .attr('cy', center_balloon_Y)
        // .style("stroke-width", "");
        .transition(t)
        .attr('r', function () {
            return center_balloon_Y / 1.3
        }) // Set max r to some value based on svg size
        .style('opacity', 1)

    // Remove text from scrollup:
    d3.selectAll('.item text').remove()

    // Add new text containing just "Coins":
    var circleText = d3.selectAll(".item").append("text")
        .attr("class", "bigText")
        .style('fill', 'white')
        .html("crypto bubble")
        .style('opacity', 1)
        .attr("x", center_balloon_x)
        .attr("y", center_balloon_Y);

    return (chart, svg, timeline, chartSize, xAxis)
}

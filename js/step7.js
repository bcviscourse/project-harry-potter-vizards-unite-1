// The last step -- final words....
export default function performStep7(chart, svg, timeline, 
    sizeX_with_margins) {


    d3.selectAll('circle').transition().duration(1000)
    .style('opacity',0)
    // .transition().duration(50).style('opacity',0)
    // .style('opacity', 0);

    setTimeout(function () {
        d3.selectAll('.pack').remove()

    }, 1100);

    // Hide all components
    svg.selectAll(".legendSequential").remove()
    d3.selectAll('path').remove()
    

    var t = d3.transition()
        .ease(d3.easeLinear)
    // Hide treemap:
    d3.selectAll('rect')
        .on("mouseover", function () {
            // Do nothing such that tooltip is removed
        })
        .transition().duration(400)
        .attr("x", sizeX_with_margins * 1.2)
        .style("opacity", 0).remove()
    d3.selectAll('.treemap-text').remove()

    // Hide timeline:
    d3.selectAll('timeline').style('opacity', 0)
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)
    timeline.lower()
    // Hide old tooltip:

    // Remove symbol titles from circles:
    d3.selectAll('.circleText').remove();
    d3.selectAll('.tooltip').style('opacity', 0)


    return (svg, chart, timeline)

}

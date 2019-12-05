// The last step -- final words....
export default function performStep7(chart, svg, timeline, 
    sizeX_with_margins) {
        console.log('step  5.5');
        d3.selectAll('.pack').remove()
    
        // Remove all unneeded components
        d3.select(".tooltip").style("width", "35%").style("height", "10%")
            // .style("background-color", "lightgrey").style("color", "black")
            .transition().duration(300).style("opacity", 0)
        d3.selectAll('path').remove()
        d3.selectAll('circle').style('opacity', 1)
        svg.selectAll(".legendSequential").transition().style('opacity', 0).remove()
        d3.selectAll(".y-axis").transition().duration(1000).style('opacity', 1)

    // Hide timeline:
    d3.selectAll('timeline').style('opacity', 0)
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)
    timeline.lower()
    // Hide treemap:
    d3.selectAll('rect').remove();
    d3.selectAll('.treemap-text').remove()
    // Remove symbol titles from circles:
    d3.selectAll('.circleText').remove();
    // Raise chart element to make sure tooltip works.
    chart.raise()

    d3.selectAll('circle').style('opacity', 1)
    d3.selectAll('.x-axis').style('opacity', 1)
    d3.selectAll('item text').style('opacity', 1)


    return (svg, chart, timeline)

}

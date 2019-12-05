// Circles return to neutral colors:
export default function performStep5(chart, svg, timeline,
    formatNum, tooltipright, tooltiptop, graphicVisEl, marketScale, translate,
    scaleX, scaleY, xAxis, sizeX_with_margins, sizeY_with_margins, left_edge) {
    console.log('step  5');
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

    // Circles are colored back to neutral:
    var item = graphicVisEl.selectAll('.item').on("mouseover", function () { })
    item.selectAll('circle').transition().ease(d3.easeLinear)
        .style('fill', 'lightgrey')
        .style('opacity', 1)
        .attr('r', function (d) {
            return marketScale(d.marketcap)
        })
        .attr('cx', function (d) {
            return 0
        })
        .attr('cy', function (d, i) { return 0; })

    item
        .attr('transform', function (d, i) {
            return translate(scaleX(d.year), scaleY(i))
        })


    // Events for tooltip:
    d3.selectAll('.item')
        .on('mouseover', function (d) {
            var selected_item = d3.select(this)
            selected_item.select("circle").style('cursor', 'pointer')
                                            .attr('r', marketScale(d.marketcap) * 1.5)
            let res = d3.selectAll('.tooltip')
            res.style('opacity', 1)
            res.html('<strong>' + d.name + '</strong>' +
                '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
            var position = d3.select(this).attr("transform")
            console.log(res)
            var translate = position.substring(position.indexOf("(") + 1, position.indexOf(")")).split(",")
            var offset = d3.event.y - translate[1]
            res.style('left', function(){
                return d3.event.pageX-left_edge-40 + "px"; // TOOLTIP TO THE LEFT
            })
            res.style('top', d3.event.y-offset - 1.2*sizeY_with_margins/10 + "px");
        })
        .on('mouseout', function (d) {
            d3.select(this).select('circle').attr('r', marketScale(d.marketcap))
            let res = d3.selectAll('.tooltip').style('opacity', 0)
        })


    return (chart, svg, timeline, xAxis)

}

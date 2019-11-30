// Circles return to neutral colors:
export default function performStep5(chart, svg, timeline, 
    formatNum, tooltipright, tooltiptop, graphicVisEl, marketScale, translate,
    scaleX, scaleY, xAxis) {
    console.log('step  5');

    // Remove all unneeded components
    d3.select(".tooltip").style("background-color", "lightgrey").style("color", "black")
    d3.selectAll('path').remove()
    d3.selectAll('circle').style('opacity', 1)
    svg.selectAll(".legendSequential").remove()

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
    var item = graphicVisEl.selectAll('.item')
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
    let circles = item.selectAll('circle')
        .on('mouseover', function (d) {
            d3.select(this).style('cursor', 'pointer')
            d3.select(this).attr('r', marketScale(d.marketcap) * 1.5)
            let res = d3.selectAll('.tooltip')
            res.style('opacity', 1)
            res.html('<strong>' + d.name + '</strong>' +
                '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
            res.style('right', tooltipright + "%");
            res.style('top', tooltiptop + "%");
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('r', marketScale(d.marketcap))
            let res = d3.selectAll('.tooltip').style('opacity', 0)
        })


    return (chart, svg, timeline, xAxis)

}
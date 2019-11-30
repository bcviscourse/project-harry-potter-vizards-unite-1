// Colors the bubbles according to algo.
export default function step3(chart, svg, timeline, 
    formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis,
    x_axis_location, sizeY_with_margins, minR, side_margin, top_margin, colorScaleforLegend, newdata) {
    console.log('step  3');

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll('path').remove()
    d3.selectAll('circle').style('opacity', 1)

    // Hide timeline:
    d3.selectAll('timeline').transition(t).style('opacity', 0)
    timeline.lower()
    // Hide old tooltip:
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)


    // Hide treemap:
    d3.selectAll('rect').style('opacity', 0);
    d3.selectAll('.treemap-text').remove()

    svg.selectAll(".legendSequential").remove()

    chart.raise()

    // Setup location of legend
    var legend = svg.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(" + side_margin + "," + 3 * top_margin + ")")

    // Create and call legend for algorithms
    var legendSequential = d3.legendColor()
        .shapeWidth(20)
        // .cells(6)
        .orient("vertical")
        .scale(colorScaleforLegend)
        .title("Algorithms:")
        .shapeHeight(7 * (sizeY_with_margins - x_axis_location) / newdata.length)

    svg.select(".legendSequential")
        .call(legendSequential);

    // Add clickable feature to legend
    d3.selectAll(".cell")
        .on("mouseover", function () {
            d3.select(this).style('cursor', 'pointer')
        })
        .on("mouseout", function () {
            d3.select(this).style('cursor', 'default')
        })
        .on("click", function (d) {
            d3.selectAll(".item")
                .selectAll("circle")
                .attr("r", function (d_2) {
                    if (d_2.algo === d)
                        return minR * 1.5
                    return minR
                })
        })

    // Transition definition:
    var t = d3.transition()
        .duration(800)
        .ease(d3.easeQuadInOut)

    // circles are colored:
    var item = graphicVisEl.selectAll('.item')

    item.select('circle')
        .transition(t)
        .style('fill', function (d, i) {
            return colorScaleforLegend(d.algo);
        })


    // Define the circletext:
    d3.selectAll(".item text").remove()

    let circles = item.select('circle')
        .transition(t)
        .attr('r', function (d, i) {
            return minR;
        })

    // Events for tooltip:
    circles = item.selectAll('circle')
        .on('mouseover', function (d) {
            circles.attr('r', minR)
            d3.select(this).style('cursor', 'pointer')
            d3.select(this).attr('r', minR * 1.5)
            let res = d3.selectAll('.tooltip')
            res.style('opacity', 1)
            res.html('<strong>' + d.name + '</strong>' +
                '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
            res.style('right', tooltipright - 12 + "%");
            res.style('top', tooltiptop + "%");
            res.style('background-color', colorScaleforLegend(d.algo))
            if (!['#00FF00', '#ffe119', '#46f0f0', '#bcf60c', '#fabebe', '#e6beff'].includes(colorScaleforLegend(d.algo))) {
                res.style('color', 'white')
            }
        })
        .on('mouseout', function (d) {
            d3.select(this).attr('r', minR)
            let res = d3.selectAll('.tooltip').style('opacity', 0)
            res.style('color', 'black')
            res.style('background-color', 'lightgrey')
        })

        return (chart, svg, timeline, xAxis)
}
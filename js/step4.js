// Circle grow in size to represent market cap.
export default function performStep4(chart, svg, timeline,
    formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis,
    x_axis_location, sizeX_with_margins, sizeY_with_margins, side_margin, top_margin, colorScaleforLegend,
    marketScale, newdata, left_edge) {
    console.log('step  4');
    d3.selectAll('.pack').remove()

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll('path').remove()
    d3.selectAll('circle').style('opacity', 1)
    svg.selectAll(".legendSequential").remove()
    d3.select(".tooltip").style("width", "35%").style("height", "10%")

    // Hide timeline:
    d3.selectAll('timeline').transition(t).style('opacity', 0)
    timeline.lower()
    // Hide old tooltip:
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)

    // Hide treemap:
    d3.selectAll('rect').style('opacity', 0);
    d3.selectAll('.treemap-text').remove()

    // Remove symbol titles from circles:
    d3.selectAll('.circleText').remove();

    // Raise chart element to make sure tooltip works.
    chart.raise()


    var t = d3.transition()
        .ease(d3.easeLinear)

    // Circles are sized
    var item = graphicVisEl.selectAll('.item')
    item.select('circle')
        .transition(t)
        .delay(50)
        .attr('r', function (d, i) {
            if (i == 0)
                console.log(marketScale(d.marketcap))
            return marketScale(d.marketcap);
        })
        .style('fill', function (d, i) {
            return colorScaleforLegend(d.algo);
        })


    // Events for tooltip
    d3.selectAll('.item')
        .on('mouseover', function (d) {
            chart.selectAll('circle').attr('r', function(d_2)
            {
                return marketScale(d_2.marketcap)
            })
            var selected_item = d3.select(this)
            // d3.select(this).style('cursor', 'pointer')
            var newVal = marketScale(d.marketcap) * 1.5
            selected_item.select("circle").attr('r', newVal)
            let res = d3.selectAll('.tooltip')
            res.style('opacity', 1)
            res.html('<strong>' + d.name + '</strong>' +
                '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
            var position = d3.select(this).attr("transform")
            var translate = position.substring(position.indexOf("(") + 1, position.indexOf(")")).split(",")
            var offset = d3.event.y - translate[1]
            res.style('left', function(){
                return d3.event.pageX-left_edge-40 + "px"; // TOOLTIP TO THE LEFT
            })
            res.style('top', d3.event.y-offset - 1.2*sizeY_with_margins/10 + "px");
            // res.style('background-color', colorScaleforLegend(d.algo))
            // if (!['#00FF00', '#ffe119', '#46f0f0', '#bcf60c', '#fabebe', '#e6beff'].includes(colorScaleforLegend(d.algo))) {
            //     res.style('color', 'white')
            // }
            // res.style('background-color', colorScaleforLegend(d.algo))
            // if (!['#00FF00', '#ffe119', '#46f0f0', '#bcf60c', '#fabebe', '#e6beff'].includes(colorScaleforLegend(d.algo))) {
            //     res.style('color', 'white')
            // }
        })
        .on('mouseout', function (d) {
            d3.select(this).select("circle").attr('r', marketScale(d.marketcap))
            let res = d3.selectAll('.tooltip').style('opacity', 0)
            // res.style('color', 'black')
            // res.style('background-color', 'lightgrey')
        })

    // Recalling the legend
    var legend = svg.append("g")
        .attr("class", "legendSequential")
        .attr("transform", "translate(" + 2 * side_margin + "," + 3 * top_margin + ")")

    var legendSequential = d3.legendColor()
        .shapeWidth(20)
        // .cells(6)
        .orient("vertical")
        .scale(colorScaleforLegend)
        .title("Algorithms:")
        .shapeHeight(7 * (sizeY_with_margins - x_axis_location) / newdata.length)



    svg.select(".legendSequential")
        .call(legendSequential);

    // Adding the clickable legend again
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
                        return marketScale(d_2.marketcap) * 1.5
                    return marketScale(d_2.marketcap)
                })
        })

    return (chart, svg, timeline, xAxis)
}

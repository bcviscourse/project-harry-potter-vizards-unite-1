// Move grey circles to their correct positions
export default function performStep2(chart, svg, timeline, 
    formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis,
    x_axis_location, sizeY_with_margins, bottom_margin, translate, minR, scaleX, scaleY, sizeX_with_margins) {
    console.log('step  2');

    // Remove all unneeded components
    d3.selectAll('rect').remove();
    d3.selectAll(".circleText").remove();
    d3.selectAll(".bigText").transition().duration(1000).style('opacity', 0)
    svg.selectAll(".legendSequential").transition().style('opacity', 0).remove()

    // Hide old tooltip:
    timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)
    timeline.lower()

    // Remove balloon animation
    var item = graphicVisEl.selectAll('.item')
    item.classed('balloon', false)

    // Hide timeline:
    d3.selectAll('timeline').style('opacity', 0)

    // Hide treemap (in case someone scrolls really fast):
    d3.selectAll('rect').style('opacity', 0);
    d3.selectAll('.treemap-text').remove()

    // Turn on needed components
    d3.selectAll('circle').style('opacity', 1)
    d3.selectAll(".y-axis").transition().duration(1000).style('opacity', 1)

    // Raise chart element to make sure tooltip works.
    chart.raise()

    // Return circles center to 0,0:
    var item = graphicVisEl.selectAll('.item')

    setTimeout(function () {

        var item = graphicVisEl.selectAll('.item')
        // Define the circletext:
        item.append("text")
            .attr("class", "circleText")		
            .style('fill', 'white')
            .html(function (d) { return d.symbol; })
            .style('opacity', 1)

        // Move the circles to their correct positions
        item.selectAll("circle").attr("cx", 0).attr("cy", 0)
        graphicVisEl.selectAll('.item')
            .transition().duration(500).ease(d3.easeLinear)
            .attr('transform', function (d, i) {
                return translate(scaleX(d.year), scaleY(i))
            })

        // Change circle radius:
        var item = graphicVisEl.selectAll('.item')
        item.select('circle')
            .transition().duration(200)
            .attr('r', minR) // minR needs to be a more standardized scale....
        item.select('circle')
            .transition().duration(200)
            .style('fill', 'lightgrey')
            .attr('r', minR) // minR needs to be a more standardized scale....
            .style('opacity', 1)

    }, 550);

    // Define a general transition:
    var t = d3.transition()
        .duration(1000)
        .ease(d3.easeExpInOut)

    // Show the x-axis:
    var axis = graphicVisEl.selectAll('.x-axis')
    axis
        .transition(t)
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", "translate(" + 0 + "," + sizeY_with_margins + ")")
        .style("opacity", 1)

    // Define mouseover behavior for circles (tooltip):
    d3.selectAll('.item')
        .on('mouseover', function (d) {
            var selected_item = d3.select(this)
            // d3.select(this).style('cursor', 'pointer')
            selected_item.select("circle").attr('r', minR * 1.5)
            let res = d3.select('.tooltip');
            res.html('<strong>' + d.name + '</strong>' +
                '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
            // res.style('right', tooltipright + "%");
            // res.style('top', tooltiptop + "%");
            var position = d3.select(this).attr("transform")
            var translate = position.substring(position.indexOf("(")+1, position.indexOf(")")).split(",")
            var offset = d3.event.y - translate[1]
            res.style('right', function(){
                if (translate[0] > sizeX_with_margins/2)
                    return 1.05*sizeX_with_margins - d3.event.pageX + "px"; // TOOLTIP TO THE LEFT
                return 0.7*sizeX_with_margins - d3.event.pageX + "px";
            })
            res.style('top', d3.event.y-offset - sizeY_with_margins/10 + "px");
            res.style('opacity', 1)

            // var position = d3.select(this).nodes()[0].cy.animVal.value
            //     var offset = d3.event.y - position
            //     res.style('right', 0.87*sizeX_with_margins - d3.event.pageX + "px");
            //     res.style('top', d3.event.y-offset - sizeY_with_margins/10 + "px");
        })
        .on('mouseout', function () {
            d3.select(this).select('circle').attr('r', minR)
            d3.selectAll('.tooltip').style('opacity', 0)
        })



    // Position the x-axis:
    x_axis_location = sizeY_with_margins - bottom_margin
    axis
        .transition(t)
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", translate(0, x_axis_location))
        .style("opacity", 1)

    d3.selectAll('path').remove()

    return (chart, svg, timeline, xAxis, x_axis_location)

}
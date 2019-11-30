//next, discuss:
//treemap tooltip position
//dynamic data vis 
//text
//colors 


//graph description vs what we need to set opacity 
//the line graph: timeline and also tooltip
//the circle graph: 
// d3.selectAll('circle').transition(t).style('opacity',0)
// d3.selectAll('.x-axis').transition(t).style('opacity',0)
// d3.selectAll('item text').transition(t).style('opacity',0)
// d3.selectAll('.tooltip').transition(t).style('opacity',0)
// OR just chart?
//the treemap: rect and text.


window.createGraphic = function (graphicSelector, newdata, time_data, treedata2, treedata3, parent_height, parent_width) {
    var graphicEl = d3.select('.graphic') // For two below selectors
    var graphicVisEl = graphicEl.select('.graphic__vis') // Accessor for entire vis
    var graphicProseEl = graphicEl.select('.graphic__prose') // Accessor for setting up triggers
    var side_margin = 20  // Margin for svg, margin must match padding from graphic__vis
    var bottom_margin = 40 // Margin for svg
    var top_margin = 40 // Margin for svg
    var sizeX = parent_width // Allows the svg to scale to size of browser window
    var sizeY = parent_height // Allows the svg to scale to size of browser window
    var lineCircleRMin = 6 // Radius min and max for line chart
    var lineCircleRMax = 11
    var tooltipright = 60; // Percentage of window tooltip appears on screen
    var tooltiptop = 40;
    var timeLineTime = 4500; // Duration of initial line chart transition
    var minR = sizeX * 0.015 // radius for circles

    var sumforstep5 = 0; // Used for setting up treemap
    var sumforupdatetree1 = 0;
    var market_data = [];
    var treedata = { "children": [] };
    var algos = [];

    var rects = d3.selectAll('rect') // Selector for treemap
    var formatNum = d3.format('($,.2f'); // Formatting function

    // Various variables -- holds svg, sizes of svg, scales and various other things
    var sizeX_with_margins, sizeY_with_margins, scaleX, scaleY, chartSize, marketScale, xAxis
    var x_axis_location, svg, root, timeline, chart, legendSequential, x, y, bitcoinTotal;
    var colorScaleforLegend, colorScaleforTreeMap, root2, root3;

    // Format date for first viz tooltip
    function dateFormat(s) {
        s = s.toString()
        let index = s.search('00:00:');
        return s.slice(4, 10) + ", " + s.slice(11, index - 1);
    }

    // actions to take on each step of our scroll-driven story
    var steps = [
        // Line chart for history of cryptocurrencies
        function step0() {
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
                        let res = d3.selectAll('.tooltip').style('opacity', 0)
                    })

            }, timeLineTime);


        },



        // Big "balloon" stage
        function step1() {
            console.log('step  1, giant balloon');

            // Remove all unneeded components
            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity', 1)

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
                .style('fill', 'lightgrey')
                .attr('cx', center_balloon_x)
                .attr('cy', center_balloon_Y)
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
                .html("Coins")
                .style('opacity', 1)
                .attr("x", center_balloon_x)
                .attr("y", center_balloon_Y);
        },


        // Move grey circles to their correct positions
        function step2() {
            console.log('step  2');

            // Remove all unneeded components
            d3.selectAll('rect').remove();
            d3.selectAll(".circleText").remove();
            d3.selectAll('circle').style('opacity', 1)
            d3.selectAll(".bigText").transition().duration(1000).style('opacity', 0)
            svg.selectAll(".legendSequential").remove()

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
            d3.selectAll('circle')
                .on('mouseover', function (d) {
                    d3.select(this).style('cursor', 'pointer')
                    d3.select(this).attr('r', minR * 1.5)
                    let res = d3.select('.tooltip');
                    res.html('<strong>' + d.name + '</strong>' +
                        '<br><category>Algorithm:</category> ' + d.algo + '<br><category>Market Cap:</category> ' + formatNum(d.marketcap));
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop + "%");
                    res.style('opacity', 1)
                })
                .on('mouseout', function () {
                    d3.select(this).attr('r', minR)
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

        },



        // Colors the bubbles according to algo.
        function step3() {
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
            legend = svg.append("g")
                .attr("class", "legendSequential")
                .attr("transform", "translate(" + side_margin + "," + 3 * top_margin + ")")

            // Create and call legend for algorithms
            legendSequential = d3.legendColor()
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
        },

        // Circle grow in size to represent market cap.
        function step4() {
            console.log('step  4');

            // Remove all unneeded components
            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity', 1)
            svg.selectAll(".legendSequential").remove()

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
                    return marketScale(d.marketcap);
                })
                .style('fill', function (d, i) {
                    return colorScaleforLegend(d.algo);
                })


            // Events for tooltip
            item.selectAll('circle')
                .on('mouseover', function (d) {
                    d3.select(this).style('cursor', 'pointer')
                    d3.select(this).attr('r', marketScale(d.marketcap) * 1.5)
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
                    d3.select(this).attr('r', marketScale(d.marketcap))
                    let res = d3.selectAll('.tooltip').style('opacity', 0)
                    res.style('color', 'black')
                    res.style('background-color', 'lightgrey')
                })

            // Recalling the legend
            legend = svg.append("g")
                .attr("class", "legendSequential")
                .attr("transform", "translate(" + side_margin + "," + 3 * top_margin + ")")

            legendSequential = d3.legendColor()
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
                                return marketScale(d_2.marketcap) * 1.7
                            return marketScale(d_2.marketcap)
                        })
                })
        },

        // Circles return to neutral colors:
        function step5() {
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

        },

        // Show the treemap
        function step6() {
            console.log('step 6')

            // Remove all unneeded components
            svg.selectAll(".legendSequential").remove()
            d3.selectAll('path').remove()

            d3.selectAll('circle').transition().duration(500).ease(d3.easeLinear)
                .attr('cy', sizeY_with_margins + 10)
                .transition().duration(300)
                .style('fill', 'brown')
            timeline.lower()


            // Transition defn:
            var t = d3.transition()
                .ease(d3.easeLinear)
            let margin_treemap = { top: 10, left: 0, right: 0, bottom: 10 }


            setTimeout(function () {

                rects.transition(t).style('opacity', 1)

                // Continuing to get ride of unneeded components
                chart.lower()
                d3.selectAll('.x-axis').transition(t).style('opacity', 0)
                d3.selectAll('item text').transition(t).style('opacity', 0)
                d3.selectAll('.tooltip')
                    .style("color", "white")
                    .style("background-color", "grey").transition(t).style('opacity', 0)

                // Call the function to draw the treemap
                updateTree1(sizeX_with_margins, sizeY_with_margins, margin_treemap);

                // Hide old tooltip:
                timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)

            }, 1100);
        },

        // The last step -- final words....
        function step7() {

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
                .transition().duration(800)
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

        }

        // function step7()
        // {

        // }

    ]

    // Update our visualizations
    function update(step) {
        let k = steps[step];
        k.call();
    }

    // little helper for string concat if using es5
    function translate(x, y) {
        return 'translate(' + x + ',' + y + ')'
    }

    function setupCharts() {
        // Setting up size markers for svg
        sizeX_with_margins = sizeX - 2 * side_margin // 2*20 comes from the padding of div.graphic__vis
        sizeY_with_margins = sizeY - bottom_margin - top_margin // keeping consistent with above
        chartSize = sizeX_with_margins - (side_margin * 2) // due to padding from graphic__vis

        // Create svg
        svg = graphicVisEl.append('svg')
            .attr('width', sizeX_with_margins)
            .attr('height', sizeY_with_margins)
            .attr('class', 'firstvis')

        //Group element for our "circles" vis:
        chart = svg.append('g')
            .classed('chart', true)
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

        // Define the div for the tooltip
        tooltip = graphicVisEl.append("div")
            .attr("class", "tooltip")
            .style("opacity", 1)
            .style("width", 30 + "%")
            .style("height", 15 + "%")
            .style('top', 100 + "%");

        // Xscale for "circles" vis:
        scaleX = d3.scaleLinear()


        // Lowest and highest years:
        var lowestVal = d3.min(newdata, d => d.year)
        var highestVal = d3.max(newdata, d => d.year)
        var tickNumber = highestVal - lowestVal

        // Define scaleX for circles:
        scaleX
            .domain([lowestVal, highestVal])
            .range([3 * side_margin, sizeX_with_margins - 3 * side_margin]);

        // Define x-axis for circles:
        xAxis = d3.axisBottom().scale(scaleX).ticks(tickNumber).tickFormat(d3.format("d"))

        // Add x-axis to group xg:
        var xg = svg.append("g")
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .style("opacity", 0)

        // Define scaleY for "circles" viz
        scaleY = d3.scaleLinear()
            .domain([0, newdata.length])
            .range([top_margin, sizeY_with_margins - bottom_margin]);

        // Used for step where radius changes depending on market cap
        var lowestRadius = sizeY_with_margins * .02
        var highestRadius = sizeY_with_margins * .05
        marketScale = d3.scaleLinear()
            .domain(d3.extent(newdata, function (d) { return d.marketcap; }))
            .range([lowestRadius, highestRadius]);

        // Creating timeline element    
        timeline = svg.append('g')
            .classed('timeline', true)
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

        // Setup for timeline viz
        var parseTime = d3.timeParse("%m/%d/%y");

        for (let i = 0; i < time_data.length; i++) {
            market_data[i] = { value: ((+ (time_data[i]["MarketCap"]) / 1000000).toFixed(2)), date: parseTime(time_data[i]["Date"]) }
        }

        // Setting up X and Y scales for timeline Viz
        x = d3.scaleTime()
            .domain(d3.extent(market_data, function (d) {
                return +d.date;
            }))
            .range([4 * side_margin, sizeX_with_margins - 4 * side_margin]);

        y = d3.scaleLinear()
            .domain([0, d3.max(market_data, function (d) { return +d.value; })])
            .range([sizeY_with_margins - bottom_margin, bottom_margin]);

        // Define axes and groups and axes labels:
        var lineXAxis = d3.axisBottom().scale(x);
        var lineYAxis = d3.axisLeft().scale(y);

        // Draw and move axes
        timeline.append('g').call(lineXAxis)
            .attr('class', 'linex')
            .attr('transform', 'translate(0,' + (sizeY_with_margins - bottom_margin) + ')')
        timeline.append('g').call(lineYAxis)
            .attr('transform', 'translate(' + (4 * side_margin) + ',0)')
            .attr('class', 'liney')

        // Label the axes
        timeline.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -1 * sizeY_with_margins / 2)
            .attr("y", side_margin)
            // .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style('fill', 'lightgrey')
            .text("Millions of Dollars");

        // Setup for treemap
        for (let i = 0; i < newdata.length; i++) {
            if (!algos.includes(newdata[i].algo) && newdata[i].algo != undefined) algos.push(newdata[i].algo);
        }

        colorScaleforLegend = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#800000', 'black', '#00FF00'])
            .domain(algos)
        algos.push("Other")
        colorScaleforTreeMap = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#800000', 'black', '#00FF00', '#808000'])



        sumforstep5 = 0;
        for (let i = 0; i < algos.length; i++) {
            if (newdata[i].name != "Bitcoin" & newdata[i].name != "Ethereum") {
                sumforstep5 = sumforstep5 + newdata[i].marketcap;
            }
        }

        sumforupdatetree1 = 0;
        for (let i = 0; i < algos.length; i++) {
            if (newdata[i].name == "Lisk" | newdata[i].name == "DigiByte" | newdata[i].name == "Siacoin" | newdata[i] == "Verge" | newdata[i] == "MonaCoin") sumforupdatetree1 = sumforupdatetree1 + newdata[i].marketcap;
        }

        // Our treemap-strucutred data: 
        treedata = { "children": [] };
        for (let i = 0; i < algos.length; i++) {
            let children = [];
            for (let j = 0; j < newdata.length; j++) {
                if (newdata[j].algo == algos[i]) {
                    if (newdata[j].name == 'Bitcoin') {
                        children.push({ name: 'BTC', marketcap: newdata[j].marketcap });
                        bitcoinTotal = newdata[j].marketcap
                    }
                    else if (newdata[j].name == 'Ethereum') children.push({ name: 'ETH', marketcap: newdata[j].marketcap });
                    else children.push({ name: newdata[j].name, marketcap: newdata[j].marketcap });
                }
            }
            let j = { name: algos[i], children: children };
            treedata['children'].push(j);
        }

        root2 = d3.hierarchy(treedata2).sum(function (d) { return d.marketcap });

        root3 = d3.hierarchy(treedata3).sum(function (d) { return d.marketcap })
    }

    // Draws first treemap level
    function updateTree1(width, height, margin) {

        d3.selectAll('rect').remove()
        svg.selectAll(".legendSequential").remove()

        root = d3.hierarchy(treedata).sum(function (d) { return d.marketcap }) // Here the size of each leave is given in the 'value' field in input data
        // console.log('descendants',root.descendants());
        // console.log('links:', root.links());
        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width, height])
            .padding(1)
            // .tile(d3.treemapDice)
            (root)

        svg = d3.selectAll('svg')

        var rects = svg.selectAll('rect')

        svg
            .selectAll("rect")
            .attr('class', 'treemap')
            .data(root.leaves())
            .enter()
            .append("rect")
            .attr('x', 0)
            .attr('y', 0)
            .merge(rects)
            .transition().duration(200)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", function (d) {
                return colorScaleforTreeMap(d.parent.data.name);
            })

        rects.exit().remove()
        //             // use this information to add rectangles:
        // d3.selectAll('.treemap').remove()
        // rects = svg.append('g')
        //             .classed('treemap', true)
        //             .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
        // rects
        //     .selectAll("rect")
        //     .attr('class','treemap')
        //     .data(root.leaves())
        //     .enter()
        //     .append("rect")
        //     .style("stroke", "black")
        //     .style("fill", function(d){return colorScaleforTreeMap(d.parent.data.name);})

        //     .attr('x', function (d) { 
        //         return d.x0; })
        //     .attr('y', function (d) { return d.y0; })
        //     .attr('width', function (d) { return d.x1 - d.x0; })
        //     .attr('height', function (d) { return d.y1 - d.y0; })
        //     .style("opacity", 1)


        // and to add the text labels
        svg.selectAll('.treemap-text').remove();


        svg.selectAll(".treemap-text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 3 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) {
                if (d.data.name == 'BTC' | d.data.name == 'ETH')
                    return d.data.name
            })
            .attr("font-size", "80%")
            .attr("fill", "white")
            .attr('class', 'treemap-text')


        svg.selectAll('rect')
            .on("click", function (d) {
                let n = d.data.name;
                if (n != "ETH" & n != "BTC") {
                    // j.transition().duration(500)(root2);
                    updateTree2(width, height, margin);
                }
            })
            .on('mouseover', function (d) {
                let n = d.data.name;
                if (n != "ETH" & n != "BTC") {
                    d3.select(this).style('cursor', 'pointer')
                }
                d3.select(this).style("fill", "silver")
                let res = d3.select('.tooltip');
                res.html('<strong>' + d.data.name + '</strong>' +
                    '<br><category>Algorithm: </category>' + d.parent.data.name + '<br><category>Market Cap:</category> '
                    + formatNum(d.data.marketcap)
                    + "<br><category> " + ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
                res.style('right', tooltipright + "%");
                res.style('top', tooltiptop + "%");
                res.style('opacity', 1)
            })
            .on('mouseout', function (d) {
                d3.select(this).style("fill", colorScaleforTreeMap(d.parent.data.name))
                let n = d.data.name;
                if (n != "ETH" & n != "BTC") {
                    d3.select(this).style('cursor', 'pointer')
                }
            })

        svg.selectAll(".legendSequential").remove()

    }


    // Draws second treemap level
    function updateTree2(width, height, margin) {
        chart.selectAll('circle').style('opacity', 0)
        timeline.transition().style('opacity', 0)
        svg.selectAll(".legendSequential").remove()
        timeline.lower()



        d3.selectAll('rect').attr('class', function (d, i) {
            console.log('i:', i);
            if (i == 18 | i == 19 | i == 20) return 'remove';
            else return 'treemap';
        })

        // console.log('to remove:', d3.selectAll('rect.remove'))
        d3.selectAll('rect.remove').remove();


        // console.log('descendants',root.descendants());
        // console.log('links:', root.links());
        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width, height - 30])
            .padding(3)
            (root2)


        svg = d3.selectAll('svg')

        var rects = svg.selectAll('rect')

        svg
            .selectAll("rect")
            .attr('class', 'treemap')
            .data(root2.leaves())
            .enter()
            .append("rect")
            .attr('x', sizeX_with_margins)
            .attr('y', sizeY_with_margins)
            .merge(rects)
            .transition().duration(1000)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", function (d) {
                return colorScaleforTreeMap(d.parent.data.name);
            })

        rects.exit().remove()



        svg.append('rect')
            .attr('x', sizeX_with_margins * .025)
            .attr('y', sizeY_with_margins * .94)
            .attr('height', sizeY_with_margins * 0.05)
            .attr('width', sizeX_with_margins * .95)
            .attr('fill', 'red')
            .attr('class', 'treemap')
            .style("stroke", "black")



        svg.selectAll('.treemap-text').remove();

        //add text labels:
        var newtext = svg
            .selectAll(".treemap-text")
            .data(root2.leaves())
            .enter()
            .append("text")

        newtext.attr('x', sizeX_with_margins).attr('y', sizeY_with_margins);

        newtext.transition().duration(1000)
            .attr("x", function (d) { return d.x0 + 3 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) {
                if (!['DGB', 'XVG', 'MONA', 'SC', 'LISK'].includes(d.data.name)) return d.data.name
            })
            .attr("font-size", "75%")
            .attr("fill", "white")
            .attr('class', 'treemap-text')

        svg.append('text')
            .attr('x', sizeX_with_margins * .95 / 2)
            .attr('y', 9.7 * sizeY_with_margins / 10)
            .attr('class', 'treemap-text')
            .text('Return to Overview')
            .attr("font-size", "90%")
            .attr("fill", "white")

        svg.selectAll('rect')
            .on("click", function (d, i) {
                if (i == 18) {
                    updateTree1(width, height, margin);
                }
                else if (['LISK', 'XVG', 'DGB', 'SC', 'MONA'].includes(d.data.name)) {
                    updateTree3(width, height, margin);
                }
            })
            .on('mouseover', function (d, i) {
                d3.select(this).style("fill", "silver")
                if (i == 18) {
                    d3.select(this).style('cursor', 'pointer')
                }
                else if (['LISK', 'XVG', 'DGB', 'SC', 'MONA'].includes(d.data.name)) {
                    d3.select(this).style('cursor', 'pointer')
                }
                else d3.select(this).style('cursor', 'default')
                let res = d3.select('.tooltip');
                if (i != 18) {
                    res.html('<strong>' + d.data.name + '</strong>' +
                        '<br><category>Algorithm: </category>' + d.parent.data.name + '<br><category>Market Cap:</category> '
                        + formatNum(d.data.marketcap) + "<br><category> " +
                        ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop + "%");
                    res.style('opacity', 1)
                }
            })
            .on('mouseout', function (d, i) {
                console.log(i);
                if (i == 18) {
                    d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
                        return "red"
                    })
                }
                else {
                    d3.select(this).style("fill", function (d) {
                        return colorScaleforTreeMap(d.parent.data.name);
                    })
                }

            })


        svg.selectAll(".legendSequential").remove()
        //HERE ENDS TREE1
    }

    // Draws third treemap level
    function updateTree3(width, height, margin) {
        chart.selectAll('circle').style('opacity', 0)
        timeline.transition().style('opacity', 0)
        svg.selectAll(".legendSequential").remove()
        timeline.lower()
        // console.log('descendants',root.descendants());
        // console.log('links:', root.links());
        // Then d3.treemap computes the position of each element of the hierarchy
        d3.selectAll('rect').attr('class', function (d, i) {
            console.log('i:', i);
            if ((i > 4 & i != 18)) return 'remove';
            else return 'treemap';
        })

        // console.log('to remove:', d3.selectAll('rect.remove'))
        d3.selectAll('rect.remove').remove();


        d3.treemap()
            .size([width, height - 30])
            .padding(3)
            (root3)

        svg = d3.selectAll('svg')

        var rects = svg.selectAll('rect')

        svg
            .selectAll("rect")
            .attr('class', 'treemap')
            .data(root3.leaves())
            .enter()
            .append("rect")
            .attr('x', sizeX_with_margins)
            .attr('y', sizeY_with_margins)
            .merge(rects)
            .transition().duration(1000)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", function (d) {
                return colorScaleforTreeMap(d.parent.data.name);
            })

        rects.exit().remove()


        svg.append('rect')
            .attr('x', sizeX_with_margins * .025)
            .attr('y', sizeY_with_margins * .94)
            .attr('height', sizeY_with_margins * 0.05)
            .attr('width', sizeX_with_margins * .95)
            .attr('fill', 'red')
            .attr('class', 'treemap')
            .style("stroke", "black")

        svg.selectAll('rect')
            .on("click", function (d, i) {
                if (i == 6) {
                    updateTree1(width, height, margin);
                }
            })
            .on('mouseover', function (d, i) {
                if (i == 6) {
                    d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
                        return "silver"
                    })
                }
                else d3.select(this).style('cursor', 'default').style("fill", function (d) {
                    return "silver"
                })
                let res = d3.select('.tooltip');
                if (i != 6) {
                    res.html('<strong>' + d.data.name + '</strong>' +
                        '<br><category>Algorithm:</category> ' + d.parent.data.name + '<br><category>Market Cap:</category> ' + formatNum(d.data.marketcap)
                        + "<br><category> " + ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop + "%");
                    res.style('opacity', 1)
                }
            })
            .on('mouseout', function (d, i) {
                if (i == 6) {
                    d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
                        return "red"
                    })
                }
                else {
                    d3.select(this).style("fill", function (d) {
                        return colorScaleforTreeMap(d.parent.data.name)
                    })
                }
            })


        svg.selectAll('.treemap-text').remove();

        // and to add the text labels
        svg
            .selectAll(".treemap-text")
            .data(root3.leaves())
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x0 + 3 })    // +10 to adjust position (more right)
            .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
            .text(function (d) { return d.data.name })
            .attr("font-size", "75%")
            .attr("fill", "white")
            .attr('class', 'treemap-text')


        svg.append('text')
            .attr('x', sizeX_with_margins * .95 / 2)
            .attr('y', 9.7 * sizeY_with_margins / 10)
            .attr('class', 'treemap-text')
            .text('Return to Overview')
            .attr("font-size", "90%")
            .attr("fill", "white")

        svg.selectAll(".legendSequential").remove()
    }

    // Sets up the triggers for the steps
    function setupProse() {
        var height = window.innerHeight * 0.6
        graphicProseEl.selectAll('.trigger')
            .style('height', height + 'px')
    }

    // Sets up the svg, visualizations and starts on first step
    function init() {
        setupCharts()
        setupProse()
        update(0)
    }

    init()

    return {
        update: update,
    }

}
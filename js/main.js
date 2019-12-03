import performStep0 from "./step0.js";
import performStep1 from "./step1.js";
import performStep2 from "./step2.js";
import performStep3 from "./step3.js";
import performStep4 from "./step4.js";
import performStep5 from "./step5.js";
import performStep6 from "./step6.js";
import performStep7 from "./step7.js";

//next, discuss:
//treemap tooltip position
//dynamic data vis 
//text
//colors 

// BUGS:
//  - circles not moving back to their normal position sometimes after treemap
//  - treemap sometimes will continue to appear after scrolling up
//  - tooltip will sometimes stay in wrong spot after scrolling up


//graph description vs what we need to set opacity 
//the line graph: timeline and also tooltip
//the circle graph: 
// d3.selectAll('circle').transition(t).style('opacity',0)
// d3.selectAll('.x-axis').transition(t).style('opacity',0)
// d3.selectAll('item text').transition(t).style('opacity',0)
// d3.selectAll('.tooltip').transition(t).style('opacity',0)
// OR just chart?
//the treemap: rect and text.


export default function createGraphic(newdata, time_data, treedata1, treedata2, treedata3, parent_height, parent_width) {
    var graphicEl = d3.select('.graphic') // For two below selectors
    var graphicVisEl = graphicEl.select('.graphic__vis') // Accessor for entire vis
    var graphicProseEl = graphicEl.select('.graphic__prose') // Accessor for setting up triggers
    var side_margin = 20  // Margin for svg, margin must match padding from graphic__vis
    var bottom_margin = 40 // Margin for svg
    var top_margin = 40 // Margin for svg
    var sizeX = parent_width * .72 // Allows the svg to scale to size of browser window
    var sizeY = parent_height // Allows the svg to scale to size of browser window
    var tooltipright = 60; // Percentage of window tooltip appears on screen
    var tooltiptop = 40;
    var minR = sizeX * 0.015 // radius for circles

    var sumforstep5 = 0; // Used for setting up treemap
    var sumforupdatetree1 = 0;
    var market_data = [];
    var treedata = treedata1;
    var algos = [];

    var rects = d3.selectAll('rect') // Selector for treemap
    var formatNum = d3.format('($,.2f'); // Formatting function

    // Various variables -- holds svg, sizes of svg, scales and various other things
    var sizeX_with_margins, sizeY_with_margins, scaleX, scaleY, chartSize, marketScale, xAxis
    var x_axis_location, svg, root, timeline, chart, legendSequential, x, y, bitcoinTotal;
    var colorScaleforLegend, colorScaleforTreeMap, root2, root3;


    // actions to take on each step of our scroll-driven story
    var steps = [
        // Line chart for history of cryptocurrencies
        function s0() {
            chart, rects, svg, timeline = performStep0(chart, rects, svg, timeline, market_data,
                x, y, formatNum, tooltipright, tooltiptop, sizeX_with_margins, sizeY_with_margins)
        },

        // Big "balloon" stage
        function s1() {
            chart, svg, timeline, xAxis = performStep1(chart, svg, timeline, chartSize,
                xAxis, sizeY_with_margins, newdata, translate, graphicVisEl, sizeY)
        },

        // Move grey circles to their correct positions
        function s2() {
            chart, svg, timeline, xAxis, x_axis_location = performStep2(chart, svg, timeline,
                formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis, x_axis_location,
                sizeY_with_margins, bottom_margin, translate, minR, scaleX, scaleY, sizeX_with_margins)
        },

        // Colors the bubbles according to algo.
        function s3() {
            chart, svg, timeline, xAxis = performStep3(chart, svg, timeline,
                formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis,
                x_axis_location, sizeX_with_margins, sizeY_with_margins, minR, side_margin, top_margin, colorScaleforLegend, newdata)
        },

        // Circle grow in size to represent market cap
        function s4() {
            chart, svg, timeline, xAxis = performStep4(chart, svg, timeline,
                formatNum, tooltipright, tooltiptop, graphicVisEl, xAxis,
                x_axis_location, sizeX_with_margins,sizeY_with_margins, side_margin, top_margin, colorScaleforLegend,
                marketScale, newdata)
        },

        // Circles return to neutral colors:
        function s5() {
            chart, svg, timeline, xAxis = performStep5(chart, svg, timeline,
                formatNum, tooltipright, tooltiptop, graphicVisEl, marketScale, translate,
                scaleX, scaleY, xAxis, sizeX_with_margins, sizeY_with_margins)
        },

        // Show the treemap
        function s6() {
            chart, svg, timeline, rects = performStep6(chart, svg, timeline, rects, sizeY_with_margins,
                sizeX_with_margins, treedata, colorScaleforTreeMap, formatNum, bitcoinTotal,
                tooltipright, tooltiptop, root2, root3, side_margin, bottom_margin)
        },

        // The last step -- final words....
        function s7() {
            svg, chart, timeline = performStep7(chart, svg, timeline,
                sizeX_with_margins)
        }

    ]

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
        graphicVisEl.append("div")
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

        // Label of min and max market caps, also year label
        svg.append("text")
            .classed("y-axis", true)
            .attr("transform", "rotate(-90)")
            .attr("x", -1 * top_margin*1.5)
            .attr("y", side_margin)
            .style("text-anchor", "middle")
            .style('fill', 'lightgrey')
            .style("opacity", 0)
            .text("Highest M.C.");

        svg.append("text")
            .classed("y-axis", true)
            .attr("transform", "rotate(-90)")
            .attr("x", -1 * (sizeY_with_margins-bottom_margin*1.5))
            .attr("y", .8* side_margin)
            .style("text-anchor", "middle")
            .style('fill', 'lightgrey')
            .style("opacity", 0)
            .text("Lowest M.C.");

        svg.append("text")
            .classed("y-axis", true)
            .attr("transform", "rotate(0)")
            .attr("x", sizeX_with_margins/2)
            .attr("y", sizeY_with_margins)
            .style("text-anchor", "middle")
            .style('fill', 'lightgrey')
            .style("opacity", 0)
            .text("Year of Creation");


        // Define scaleY for "circles" viz
        scaleY = d3.scaleLinear()
            .domain([0, newdata.length])
            .range([top_margin, sizeY_with_margins - bottom_margin]);

        // Used for step where radius changes depending on market cap
        var lowestRadius = sizeY_with_margins * .02
        var highestRadius = sizeY_with_margins * .05
        var highestRadius = sizeY_with_margins * .5
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

        // Label the axes
        timeline.append("text")
            .attr("transform", "rotate(0)")
            .attr("x", sizeX_with_margins / 2)
            .attr("y", sizeY_with_margins)
            // .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style('fill', 'lightgrey')
            .text("Date");

        // Setup for treemap
        for (let i = 0; i < newdata.length; i++) {
            if (!algos.includes(newdata[i].algo) && newdata[i].algo != undefined) algos.push(newdata[i].algo);
        }

        //Custom colors go here
        // colorScaleforLegend = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#800000', 'black', '#00FF00'])
        //     .domain(algos)

        colorScaleforLegend = 
        d3.scaleOrdinal([   
                            //If we use 8, we cut every other color
                            '#62BEC1', //lapis lazuli
                            '#008DD5', //rich electric blue
                            '#125ACE', //denim
                            '#4B69ED', //ultramarine blue
                            '#677DE0', //united nations blue
                            '#A2BCE0', //pale cerulean
                            '#E55E84', //blush
                            '#EF8354', //light red ochre
                            '#EDAFB8', //Nadeshiko pink
                            '#9C3848', //smoky topaz
                            '#71720C', //bronze yellow
                            '#B75671', //china rose
                            '#C98986', //puce
                            '8B575C',  //rose taupe
                            '#A47FD8', //lavender
                            '#8253EF', //navy purple
                        ])
            .domain(algos)

        algos.push("Other")
        //colorScaleforTreeMap = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#800000', 'black', '#00FF00', '#808000'])

        colorScaleforTreeMap = 
        d3.scaleOrdinal([   
                            //If we use 8, we cut every other color
                            '#62BEC1', //lapis lazuli
                            '#008DD5', //rich electric blue
                            '#125ACE', //denim
                            '#4B69ED', //ultramarine blue
                            '#677DE0', //united nations blue
                            '#A2BCE0', //pale cerulean
                            '#E55E84', //blush
                            '#EF8354', //light red ochre
                            '#EDAFB8', //Nadeshiko pink
                            '#9C3848', //smoky topaz
                            '#71720C', //bronze yellow
                            '#B75671', //china rose
                            '#C98986', //puce
                            '8B575C',  //rose taupe
                            '#A47FD8', //lavender
                            '#8253EF', //navy purple
                        ])
            .domain(algos)


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
        var useless = { "children": [] };
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
            useless['children'].push(j);
        }

        root2 = d3.hierarchy(treedata2).sum(function (d) { return d.marketcap });

        root3 = d3.hierarchy(treedata3).sum(function (d) { return d.marketcap })
    }

    // Sets up the triggers for the steps
    function setupProse() {
        var height = window.innerHeight * 0.6
        graphicProseEl.selectAll('.trigger')
            .style('height', height + 'px')
    }


    // Update our visualizations
    function update(step) {
        let k = steps[step];
        k.call();
    }

    // Sets up the svg, visualizations and starts on first step
    function init() {
        setupCharts()
        setupProse()
        update(0)
    }

    // little helper for string concat if using es5
    function translate(x, y) {
        return 'translate(' + x + ',' + y + ')'
    }

    init()

    return {
        update: update,
    }

}
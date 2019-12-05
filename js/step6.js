//for packed circles:
// tooltip
// disappearing
// colors (after commit)


// Show the treemap
export default function performStep6(chart, svg, timeline, rects, sizeY_with_margins, 
    sizeX_with_margins, treedata, colorScaleforTreeMap, formatNum, bitcoinTotal,
    tooltipright, tooltiptop, root2, root3, side_margin, bottom_margin) {
    console.log('step 6')

    var algos =[];
    for (let i=0;i<treedata.length;i++){
        if (!algos.includes(treedata[i].algo) ){
            algos.push(treedata[i].algo);
        }
    }
    console.log(algos);
    var useless = { "children": [] };
    for (let i = 0; i < algos.length; i++) {
        let children = [];
        for (let j = 0; j < treedata.length; j++) {
            if (treedata[j].algo == algos[i]) {
                children.push({name: treedata[j].name, marketcap: +treedata[j].marketcap});
            }
        }
        let j = { name: algos[i], children: children };
        useless['children'].push(j);
    }

    var data = useless;



    // Remove all unneeded components
    svg.selectAll(".legendSequential").remove()
    d3.selectAll('path').remove()
    d3.selectAll(".y-axis").transition().duration(400).style('opacity', 0)
    d3.selectAll('.x-axis').transition().duration(400).style('opacity',0)

    d3.selectAll('circle').transition().duration(400).ease(d3.easeLinear)
        .attr('cy', sizeY_with_margins + 500)
        .transition().duration(200)
        .style('fill', 'brown')
    timeline.lower()


    // Transition defn:
    var t = d3.transition()
        .ease(d3.easeLinear)
    let margin_treemap = { top: 10, left: 60, right: 0, bottom: 10 }






    setTimeout(function () {

        d3.selectAll('firstvis').lower();

        var root = d3.hierarchy(data)    
        var packLayout = d3.pack();
        packLayout.size([sizeX_with_margins, sizeY_with_margins]);
        root.sum(function(d) {
        return d.marketcap;
        });
        packLayout(root);

        var svg = d3.selectAll('svg').append('svg')

        svg
            .selectAll('circle')
            .data(root.children)
            .enter()
            .append('circle')
            .attr('cx', function(d) { 
                return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('r', function(d) { return d.r; })
            .style('opacity',.5)
            .style('fill','whitesmoke')
            .style('stroke','grey')
            .attr('class','packedCircles')

       svg
            .selectAll('circle')
            .data(root.descendants())
            .enter()
            .append('circle')
            .attr('class','smallcircle')
            .attr('cx', function(d) { 
                return d.x; })
            .attr('cy', function(d) { return d.y; })
            .attr('r', function(d) { return d.r; })
            .style('opacity',1)
            .style('fill','blue')
            .on('mouseover',function(d){
                console.log('yo')
                d3.select(this).attr('r', d.r*1.2)
            })
            .on('mouseover',function(d){
                d3.select(this).attr('r', d.r)
            })

            d3.selectAll('.smallcircle').raise()
          
        //   var svg = d3.select("body").append("svg")
        //       .attr("width", width)
        //       .attr("height", height);
          
        //   svg.data([data]).selectAll(".node")
        //       .data(pack.nodes)
        //     .enter().append("circle")
        //       .attr("class", "node")
        //       .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
        //       .attr("r", function(d) { return d.r; });
        

        // rects.transition(t).style('opacity', 1)

        // // Continuing to get ride of unneeded components
        // chart.lower()
        // d3.selectAll('.x-axis').transition(t).style('opacity', 0)
        // d3.selectAll('item text').transition(t).style('opacity', 0)
        // d3.selectAll('.tooltip')
        //     .style("color", "white")
        //     .style("background-color", "grey").transition(t).style('opacity', 0)

        // // Call the function to draw the treemap
        // updateTree1(sizeX_with_margins, sizeY_with_margins, margin_treemap);

        // // Hide old tooltip:
        // timeline.selectAll('.circle').selectAll('.tooltip').style('opacity', 0)

    }, 1100);

    return (chart, svg, timeline, rects)

    // // Draws first treemap level
    // function updateTree1(width, height, margin) {

    //     d3.selectAll('rect').remove()
    //     svg.selectAll(".legendSequential").remove()

    //     var root = d3.hierarchy(treedata).sum(function (d) { return d.marketcap }) // Here the size of each leave is given in the 'value' field in input data
    //     // console.log('descendants',root.descendants());
    //     // console.log('links:', root.links());
    //     // Then d3.treemap computes the position of each element of the hierarchy
    //     d3.treemap()
    //         .size([width - 2 * side_margin, height-bottom_margin])
    //         .padding(1)
    //         // .tile(d3.treemapDice)
    //         (root)

    //     svg = d3.selectAll('svg')

    //     var rects = svg.selectAll('rect')

    //     svg
    //         .selectAll("rect")
    //         .attr('class', 'treemap')
    //         .data(root.leaves())
    //         .enter()
    //         .append("rect")
    //         .attr('x', 0)
    //         .attr('y', 0)
    //         .merge(rects)
    //         .attr('y', function (d) { return d.y0; })
    //         .attr('height', function (d) { return d.y1 - d.y0; })
    //         .transition().duration(800)
    //         .attr('x', function (d) { return d.x0 + side_margin; })
    //         .attr('width', function (d) { return d.x1 - d.x0; })
    //         //.style("stroke", "black")
    //         .style("fill", function (d) {
    //             return colorScaleforTreeMap(d.parent.data.name);
    //         })

    //     rects.exit().remove()

    //     // and to add the text labels
    //     svg.selectAll('.treemap-text').remove();


    //     svg.selectAll(".treemap-text")
    //         .data(root.leaves())
    //         .enter()
    //         .append("text")
    //         .transition().duration(800)
    //         .attr("x", function (d) { return d.x0 + side_margin + 3 })    // +10 to adjust position (more right)
    //         .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
    //         .text(function (d) {
    //                 return d.data.name
    //         })
    //         .attr("font-size", "80%")
    //         .attr("fill", "white")
    //         .attr('class', 'treemap-text')


    //     svg.selectAll('rect')
    //         .on("click", function (d) {
    //             let n = d.data.name;
    //             if (n != "ETH" & n != "BTC") {
    //                 // j.transition().duration(500)(root2);
    //                 updateTree2(width, height, margin);
    //             }
    //         })
    //         .on('mouseover', function (d) {
    //             let n = d.data.name;
    //             console.log(d.x0 + d.x1/2);
    //             if (n != "ETH" & n != "BTC") {
    //                 d3.select(this).style('cursor', 'pointer')
    //             }
    //             d3.select(this).style("fill", "silver")
    //             let res = d3.select('.tooltip');
    //             res.html(
    //                 '<br><category>Algorithm: </category>' + d.parent.data.name+
    //                 '<br><strong>Cryptocurrency:</strong> ' + d.data.name
    //                 + '<br><category>Market Cap:</category> '
    //                 + formatNum(d.data.marketcap)
    //                 + "<br><category> " + ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
    //             // res.attr('x', d.x0 + d.x1/2)
    //             // res.attr('y', d.y0 + d.y1/2)
    //             // res.attr('right', tooltipright+'%')
    //             // res.attr('top', tooltiptop + "%");
    //             // var position = res.attr("transform")
    //             // var translate = position.substring(position.indexOf("(")+1, position.indexOf(")")).split(",")
    //             // var offset = d3.event.y - translate[1]
    //             res.style('right', function(){
    //                 // if (translate[0] > sizeX_with_margins/2)
    //                 //     return 1.05*sizeX_with_margins - d3.event.pageX + "px"; // TOOLTIP TO THE LEFT
    //                 return 0.7*sizeX_with_margins - d3.event.pageX + 500+ "px";
    //             })
    //             res.style('top', d3.event.y - sizeY_with_margins/3 + "px");
    //             res.style('opacity', 1)
    //         })
    //         .on('mouseout', function (d) {
    //             d3.select(this).style("fill", colorScaleforTreeMap(d.parent.data.name))
    //             let n = d.data.name;
    //             if (n != "ETH" & n != "BTC") {
    //                 d3.select(this).style('cursor', 'pointer')
    //             }
    //         })

    //     svg.selectAll(".legendSequential").remove()

    // }

    // // Draws second treemap level
    // function updateTree2(width, height, margin) {
    //     chart.selectAll('circle').style('opacity', 0)
    //     timeline.transition().style('opacity', 0)
    //     svg.selectAll(".legendSequential").remove()
    //     timeline.lower()



    //     d3.selectAll('rect').attr('class', function (d, i) {
    //         console.log('i:', i);
    //         if (i>= 14) return 'remove';
    //         else return 'treemap';
    //     })

    //     // console.log('to remove:', d3.selectAll('rect.remove'))
    //     d3.selectAll('rect.remove').remove();


    //     // console.log('descendants',root.descendants());
    //     // console.log('links:', root.links());
    //     // Then d3.treemap computes the position of each element of the hierarchy
    //     d3.treemap()
    //         .size([width - 2 * side_margin, height - bottom_margin])
    //         .padding(3)
    //         (root2)


    //     svg = d3.selectAll('svg')

    //     var rects = svg.selectAll('rect')
    //     rects.remove()

    //     console.log('ROOT2:',root2);

    //     svg
    //         .selectAll("rect")
    //         .attr('class', 'treemap')
    //         .data(root2.leaves())
    //         .enter()
    //         .append("rect")
    //         .attr('x', sizeX_with_margins)
    //         .attr('y', sizeY_with_margins)
    //         .merge(rects)
    //         .transition().duration(500)
    //         .attr('x', function (d) { return d.x0 + side_margin; })
    //         .attr('y', function (d) { return d.y0; })
    //         .attr('width', function (d) { return d.x1 - d.x0; })
    //         .attr('height', function (d) { return d.y1 - d.y0; })
    //         //.style("stroke", "black")
    //         .style("fill", function (d) {
    //             return colorScaleforTreeMap(d.parent.data.name);
    //         })

    //     rects.exit().remove()



    //     svg.append('rect')
    //         .attr('x', sizeX_with_margins * .025)
    //         .attr('y', sizeY_with_margins * .92)
    //         .attr('height', sizeY_with_margins * 0.05)
    //         .attr('width', sizeX_with_margins * .95)
    //         .attr('fill', 'red')
    //         .attr('class', 'treemap')
    //         .style("stroke", "black")



    //     svg.selectAll('.treemap-text').remove();

    //     //add text labels:
    //     var newtext = svg
    //         .selectAll(".treemap-text")
    //         .data(root2.leaves())
    //         .enter()
    //         .append("text")

    //     newtext.attr('x', sizeX_with_margins).attr('y', sizeY_with_margins);

    //     newtext.transition().duration(500)
    //         .attr("x", function (d) { return d.x0 + side_margin + 3 })    // +10 to adjust position (more right)
    //         .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
    //         .text(function (d) {
    //             return d.data.name
    //         })
    //         .attr("font-size", "72%")
    //         .attr("fill", "white")
    //         .attr('class', 'treemap-text')

    //     svg.append('text')
    //         .attr('x', sizeX_with_margins * .95 / 2)
    //         .attr('y', 9.5 * sizeY_with_margins / 10)
    //         .attr('class', 'treemap-text')
    //         .text('Return to Overview')
    //         .attr("font-size", "90%")
    //         .attr("fill", "white")

    //     svg.selectAll('rect')
    //         .on("click", function (d, i) {
    //             if (i == 14) {
    //                 updateTree1(width, height, margin);
    //             }
    //             else if (['Others'].includes(d.data.name)) {
    //                 updateTree3(width, height, margin);
    //             }
    //         })
    //         .on('mouseover', function (d, i) {
    //             d3.select(this).style("fill", "silver")
    //             if (i == 14) {
    //                 d3.select(this).style('cursor', 'pointer')
    //             }
    //             else if (['Others'].includes(d.data.name)) {
    //                 d3.select(this).style('cursor', 'pointer')
    //             }
    //             else d3.select(this).style('cursor', 'default')
    //             let res = d3.select('.tooltip');
    //             if (i != 14) {
    //                 res.html(                    '<br><category>Algorithm: </category>' + d.parent.data.name+
    //                 '<br><strong>Cryptocurrency:</strong> ' + d.data.name
    //                 + '<br><category>Market Cap:</category> '
    //                 + formatNum(d.data.marketcap)
    //                 + "<br><category> " + ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
    //                 // res.style('right', tooltipright + "%");
    //                 // res.style('top', tooltiptop + "%");
    //                 res.style('right', function(){
    //                     // if (translate[0] > sizeX_with_margins/2)
    //                     //     return 1.05*sizeX_with_margins - d3.event.pageX + "px"; // TOOLTIP TO THE LEFT
    //                     return 0.7*sizeX_with_margins - d3.event.pageX + 500+ "px";
    //                 })
    //                 res.style('top', d3.event.y - sizeY_with_margins/3 + "px");
    //                 res.style('opacity', 1)
    //             }
    //         })
    //         .on('mouseout', function (d, i) {
    //             console.log(i);
    //             if (i == 14) {
    //                 d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
    //                     return "red"
    //                 })
    //             }
    //             else {
    //                 d3.select(this).style("fill", function (d) {
    //                     return colorScaleforTreeMap(d.parent.data.name);
    //                 })
    //             }

    //         })


    //     svg.selectAll(".legendSequential").remove()
    //     //HERE ENDS TREE1
    // }

//     // Draws third treemap level
//     function updateTree3(width, height, margin) {
//         chart.selectAll('circle').style('opacity', 0)
//         timeline.transition().style('opacity', 0)
//         svg.selectAll(".legendSequential").remove()
//         timeline.lower()
//         // console.log('descendants',root.descendants());
//         // console.log('links:', root.links());
//         // Then d3.treemap computes the position of each element of the hierarchy
//         d3.selectAll('rect').attr('class', function (d, i) {
//             console.log('i:', i);
//             if ((i >=5)) return 'remove';
//             else return 'treemap';
//         })

//         // console.log('to remove:', d3.selectAll('rect.remove'))
//         d3.selectAll('rect.remove').remove();


//         d3.treemap()
//             .size([width - 2 * side_margin, height-bottom_margin])
//             .padding(3)
//             (root3)

//         svg = d3.selectAll('svg')



//         var rects = svg.selectAll('rect')
//         rects.remove();

//         svg
//             .selectAll("rect")
//             .attr('class', 'treemap')
//             .data(root3.leaves())
//             .enter()
//             .append("rect")
//             .attr('x', sizeX_with_margins)
//             .attr('y', sizeY_with_margins)
//             .merge(rects)
//             .transition().duration(500)
//             .attr('x', function (d) { return d.x0 + side_margin; })
//             .attr('y', function (d) { return d.y0; })
//             .attr('width', function (d) { return d.x1 - d.x0; })
//             .attr('height', function (d) { return d.y1 - d.y0; })
//             .style("stroke", "black")
//             .style("fill", function (d) {
//                 return colorScaleforTreeMap(d.parent.data.name);
//             })

//         rects.exit().remove()


//         svg.append('rect')
//             .attr('x', sizeX_with_margins * .025)
//             .attr('y', sizeY_with_margins * .92)
//             .attr('height', sizeY_with_margins * 0.05)
//             .attr('width', sizeX_with_margins * .95)
//             .attr('fill', 'red')
//             .attr('class', 'treemap')
//             .style("stroke", "black")

//         svg.selectAll('rect')
//             .on("click", function (d, i) {
//                 if (i == 5) {
//                     updateTree1(width, height, margin);
//                 }
//             })
//             .on('mouseover', function (d, i) {
//                 console.log(i)
//                 if (i == 5) {
//                     d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
//                         return "silver"
//                     })
//                 }
//                 else d3.select(this).style('cursor', 'default').style("fill", function (d) {
//                     return "silver"
//                 })
//                 let res = d3.select('.tooltip');
//                 if (i != 5) {
//                     res.html(                    '<br><category>Algorithm: </category>' + d.parent.data.name+
//                     '<br><strong>Cryptocurrency:</strong> ' + d.data.name
//                     + '<br><category>Market Cap:</category> '
//                     + formatNum(d.data.marketcap)
//                     + "<br><category> " + ((d.data.marketcap / bitcoinTotal) * 100).toFixed(3) + "%</category> of Bitcoin's Market Cap");
//                     // res.style('right', tooltipright + "%");
//                     // res.style('top', tooltiptop + "%");
//                     res.style('right', function(){
//                         // if (translate[0] > sizeX_with_margins/2)
//                         //     return 1.05*sizeX_with_margins - d3.event.pageX + "px"; // TOOLTIP TO THE LEFT
//                         return 0.7*sizeX_with_margins - d3.event.pageX + 500+ "px";
//                     })
//                     res.style('top', d3.event.y - sizeY_with_margins/3 + "px");
//                     res.style('opacity', 1)
//                 }
//             })
//             .on('mouseout', function (d, i) {
//                 if (i == 5) {
//                     d3.select(this).style('cursor', 'pointer').style("fill", function (d) {
//                         return "red"
//                     })
//                 }
//                 else {
//                     d3.select(this).style("fill", function (d) {
//                         return colorScaleforTreeMap(d.parent.data.name)
//                     })
//                 }
//             })


//         svg.selectAll('.treemap-text').remove();



//         //add text labels:
//         var newtext = svg
//         .selectAll(".treemap-text")
//         .data(root3.leaves())
//         .enter()
//         .append("text")

//         newtext.attr('x', sizeX_with_margins).attr('y', sizeY_with_margins);

//         // and to add the text labels
//         newtext.transition().duration(500)
//             .attr("x", function (d) { return d.x0 + side_margin + 3 })    // +10 to adjust position (more right)
//             .attr("y", function (d) { return d.y0 + 20 })    // +20 to adjust position (lower)
//             .text(function (d) { return d.data.name })
//             .attr("font-size", "75%")
//             .attr("fill", "white")
//             .attr('class', 'treemap-text')


//         svg.append('text')
//             .attr('x', sizeX_with_margins * .95 / 2)
//             .attr('y', 9.5 * sizeY_with_margins / 10)
//             .attr('class', 'treemap-text')
//             .text('Return to Overview')
//             .attr("font-size", "90%")
//             .attr("fill", "white")

//         svg.selectAll(".legendSequential").remove()
//     }
}

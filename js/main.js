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


window.createGraphic = function(graphicSelector, newdata, time_data, parent_height, parent_width){
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
    var graphicProseEl = graphicEl.select('.graphic__prose')
    var side_margin = 20  // -- margin must match padding from graphic__vis
    var bottom_margin = 40 // arbitrary -- used for placing circles
    var top_margin = 40 // arbitrary -- used for placing circles
    var sizeX = parent_width
    var sizeY = parent_height
    var sizeX_with_margins, sizeY_with_margins;
	var chartSize = sizeX - (20 * 2) // due to padding from graphic__vis
    var scaleX = null
    var scaleY = null
    var marketScale
	var minR = sizeX * 0.015
    var xAxis = null
    var x_axis_location
    var svg
    var parseTime = d3.timeParse("%Y");
    var root
    var rects
    var tooltip
    var timeline
    var chart
    var rects = d3.selectAll('rect')
    var lineCircleRMin= 6
    var lineCircleRMax= 11
    var legend;
    var legendSequential;
    var tooltipright= 60;
    var tooltiptop= 40;
    var market_data =[];
    var x;
    var y;
    var timeLineTime= 5000;
    function dateFormat(s){
        s= s.toString()
        let index = s.search('00:00:');
        return s.slice(0,index);
    }
    var formatNum= d3.format('($,');


    var algos=[];
    for (let i=0;i<newdata.length;i++){
        if (!algos.includes(newdata[i].algo) && newdata[i].algo !=undefined) algos.push(newdata[i].algo);
    }

    // ['#C164C9', '#C2EF51', '#70E4EF', '#EFC170', '#6895FF', '#EF709D', 'lightgrey']
    // '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000',            '#ffd8b1', '#000075', '#808080', '#ffffff', '#000000'
    var colorScaleforLegend = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324' , '#800000', 'black', '#00FF00']) 
        .domain(algos)
    algos.push("Other")
    var colorScaleforTreeMap = d3.scaleOrdinal(['#000075', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#800000', 'black', '#00FF00', '#808000']) 



    var sumforstep5=0 ;
    for (let i=0;i<algos.length;i++){
        if (newdata[i].name !="Bitcoin" & newdata[i].name !="Ethereum"){
            sumforstep5= sumforstep5+ newdata[i].marketcap;
        }
    }

    var sumforupdatetree1 = 0;
    for (let i=0;i<algos.length;i++){
        if (newdata[i].name == "Lisk" | newdata[i].name== "DigiByte" | newdata[i].name=="Siacoin" | newdata[i] == "Verge" | newdata[i] == "MonaCoin") sumforupdatetree1= sumforupdatetree1+ newdata[i].marketcap;
    }

//our treemap-strucutred data: 
var treedata={"children":[]};
for (let i=0;i<algos.length;i++){
    let children=[];
    for (let j=0;j<newdata.length;j++){
        if (newdata[j].algo== algos[i]){
            if(newdata[j].name== 'Bitcoin') children.push({name: 'BTC', marketcap: newdata[j].marketcap});
            else if (newdata[j].name== 'Ethereum') children.push({name: 'ETH', marketcap: newdata[j].marketcap});
            else children.push({name: newdata[j].name, marketcap: newdata[j].marketcap});
        }
    }
    let j= {name: algos[i], children: children};
    treedata['children'].push(j);
}

var treedata1 = {"children": [
    {"name":"SHA-256","children":
        [{"name":"BTC","marketcap":157000000000}] },
    {"name":"Dagger-Hashimoto","children":
        [{"name":"ETH","marketcap":20256946583}] },
    {"name":"Other","children":
        [{"name":"Other", "marketcap": sumforstep5}] }
]}

var treedata2 = {"children":[
    {"name":"Scrypt","children":
        [{"name":"LTC","marketcap":3836414728},
            {"name":"DOGE","marketcap":328051591.5}]},
    {"name":"Transaction fee","children":
        [{"name":"XLM","marketcap":1459172668},
        {"name":"WAVES","marketcap":78217357.51},
        {"name":"BTS","marketcap":73893904.53},
        {"name":"MAID","marketcap":61514780.16}]},
    {"name":"CPU mining; CryptoNight","children":
        [{"name":"XMR","marketcap":1090476909}]},
    {"name":"X11","children":
        [{"name":"DASH","marketcap":631552497.2}]},
    {"name":"blockchain","children":
        [{"name":"XEM","marketcap":378860292.4}]},
    {"name":"Equihash","children":
        [{"name":"ZEC","marketcap":288109779.9}]},
    {"name":"Blake256","children":
        [{"name":"DCR","marketcap":251853300.9}]},
    {"name":"Smart contract","children":
        [{"name":"REP","marketcap":127941720.7}]},
    {"name":"Equilhash","children":
        [{"name":"KMD","marketcap":121105885.6}]},
    // {"name":"Other", "children":
    //     [{"name":"Other", "marketcap": sumforupdatetree1} ] }

    {"name":"Sidechain","children":
        [{"name":"LISK","marketcap":97313663.16}]},
    {"name":"SHA-256;Scrypt;Qubit;Skein;Groestl","children":
        [{"name":"DGB","marketcap":87731409.07}]},
    {"name":"blake2b","children":
        [{"name":"SC","marketcap":84616061.08}]},
    {"name":"Scrypt;X17;Groestl;Blake2s;Lyra2rev2","children":
        [{"name":"XVG","marketcap":74185162.88}]},
    {"name":"Lyra2RE","children":
        [{"name":"MONA","marketcap":69801518}]}
]};


// var sign = svg.selectAll('rect').enter().append('rect')
// .attr('x', 6)
// .attr('y', 450)
// .attr('width', sizeX_with_margins)
// .attr('height', 30)
// .style('stoke','black')
// .style('fill', 'orange')
// .style('opacity',1)
// .append('text').text('Return to overview')




var root2 = d3.hierarchy(treedata2).sum(function(d){ return d.marketcap});

var treedata3 = {"children":[
    {"name":"Sidechain","children":
        [{"name":"LISK","marketcap":97313663.16}]},
    {"name":"SHA-256;Scrypt;Qubit;Skein;Groestl","children":
        [{"name":"DGB","marketcap":87731409.07}]},
    {"name":"blake2b","children":
        [{"name":"SC","marketcap":84616061.08}]},
    {"name":"Scrypt;X17;Groestl;Blake2s;Lyra2rev2","children":
        [{"name":"XVG","marketcap":74185162.88}]},
    {"name":"Lyra2RE","children":
        [{"name":"MONA","marketcap":69801518}]}
]};
var root3 = d3.hierarchy(treedata3).sum(function(d){ return d.marketcap})

// console.log(JSON.stringify(treedata));
    
function updateTree1(width,height,margin){

    d3.selectAll('rect').remove()
    svg.selectAll(".legendSequential").remove()

    root = d3.hierarchy(treedata).sum(function(d){ return d.marketcap}) // Here the size of each leave is given in the 'value' field in input data
        // console.log('descendants',root.descendants());
        // console.log('links:', root.links());
        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([width, height])
            .padding(1)
            // .tile(d3.treemapDice)
            (root)

            svg  = d3.selectAll('svg')

            var rects= svg.selectAll('rect')
        
            svg
            .selectAll("rect")
            .attr('class','treemap')
            .data(root.leaves()) 
            .enter()
            .append("rect")
            .attr('x',0)
            .attr('y', 0)
            .merge(rects)
            .transition().duration(400)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("stroke", "black")
            .style("fill", function(d){
                return colorScaleforTreeMap(d.parent.data.name);})
        
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
            .attr("x", function(d){ return d.x0+3})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ 
                if (d.data.name == 'BTC' | d.data.name== 'ETH')
                return d.data.name })
            .attr("font-size", "14px")
            .attr("fill", "white")
            .attr('class','treemap-text')


        svg.selectAll('rect')
            .on("click",function(d){
                let n= d.data.name;
                if (n!= "ETH" &n!= "BTC"){
                    // j.transition().duration(500)(root2);
                    updateTree2(width,height,margin);
                }
            })
            .on('mouseover', function(d){
                let n= d.data.name;
                if (n!= "ETH" &n!= "BTC"){
                    d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                        return "lightgrey"})
                }
                let res = d3.select('.tooltip');
                res.html('<strong>'+d.data.name+'</strong>'+
                    '<br>Algorithm: '+d.parent.data.name+'<br>Market Cap: '+formatNum(d.data.marketcap));
                res.style('right', tooltipright + "%");
                res.style('top', tooltiptop+ "%");
                res.style('opacity',1)
            })
            .on('mouseout', function(d){
                let n= d.data.name;
                if (n!= "ETH" &n!= "BTC"){
                    d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                        return colorScaleforTreeMap(d.parent.data.name);})
                }
            })

    svg.selectAll(".legendSequential").remove()

}


function updateTree2(width,height,margin){
    chart.selectAll('circle').style('opacity',0)
    timeline.transition().style('opacity',0)
    svg.selectAll(".legendSequential").remove()
    timeline.lower()



    d3.selectAll('rect').attr('class',function(d,i){
        console.log('i:',i);
        if (i==18 | i== 19 | i== 20) return 'remove';
        else return 'treemap';
    })

    // console.log('to remove:', d3.selectAll('rect.remove'))
    d3.selectAll('rect.remove').remove();


    // console.log('descendants',root.descendants());
    // console.log('links:', root.links());
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height-30])
        .padding(3)
        (root2)


    svg  = d3.selectAll('svg')

    var rects= svg.selectAll('rect')

    svg
    .selectAll("rect")
    .attr('class','treemap')
    .data(root2.leaves())
    .enter()
    .append("rect")
    .attr('x',sizeX_with_margins)
    .attr('y', sizeY_with_margins)
    .merge(rects)
    .transition().duration(1000)
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", function(d){
        return colorScaleforTreeMap(d.parent.data.name);})

    rects.exit().remove()



    svg.append('rect')
        .attr('x', sizeX_with_margins*.025)
        .attr('y', sizeY_with_margins * .94 )
        .attr('height', sizeY_with_margins*0.05)
        .attr('width', sizeX_with_margins*.95)
        .attr('fill', 'red')
        .attr('class','treemap')
        .style("stroke", "black")



    svg.selectAll('.treemap-text').remove();

    //add text labels:
    var newtext = svg
            .selectAll(".treemap-text")
            .data(root2.leaves())
            .enter()
            .append("text")

    newtext.attr('x',sizeX_with_margins).attr('y', sizeY_with_margins);

    newtext.transition().duration(1000)
        .attr("x", function(d){ return d.x0+3})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ 
            if (!['DGB','XVG','MONA','SC', 'LISK'].includes(d.data.name)) return d.data.name })
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr('class','treemap-text')

    svg.append('text')
        .attr('x', sizeX_with_margins*.95 / 2)
        .attr('y', 9.7*sizeY_with_margins/10 )
        .attr('class', 'treemap-text')
        .text('Return to Overview')
        .attr("font-size", "16px")
        .attr("fill", "white")

    svg.selectAll('rect')
        .on("click",function(d,i ){
            if (i== 18){
                updateTree1(width, height, margin);
            }
            else if (['LISK', 'XVG', 'DGB', 'SC', 'MONA'].includes(d.data.name)){
                updateTree3(width,height,margin); 
            }
        })
        .on('mouseover', function(d,i ){
            console.log(i);
            if (i==18){
                d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                    return "lightgrey"})
            }
            else if (['LISK', 'XVG', 'DGB', 'SC', 'MONA'].includes(d.data.name)){
                d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                    return "lightgrey"})
            }
            else d3.select(this).style('cursor', 'default' )
            let res = d3.select('.tooltip');
            if (i!=18){
                res.html('<strong>'+d.data.name+'</strong>'+
                    '<br>Algorithm: '+d.parent.data.name+'<br>Market Cap: '+formatNum(d.data.marketcap));
                res.style('right', tooltipright + "%");
                res.style('top', tooltiptop+ "%");
                res.style('opacity',1)
            }
        })
        .on('mouseout', function(d,i ){
            console.log(i);
            if (i==18){
                d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                    return "red"})
            }
            else if (['LISK', 'XVG', 'DGB', 'SC', 'MONA'].includes(d.data.name)){
                d3.select(this).style("fill", function(d){
                    return colorScaleforTreeMap(d.parent.data.name);})
            }
            
        })


    svg.selectAll(".legendSequential").remove()
            //HERE ENDS TREE1
}


function updateTree3(width,height,margin){
    chart.selectAll('circle').style('opacity',0)
    timeline.transition().style('opacity',0)
    svg.selectAll(".legendSequential").remove()
    timeline.lower()
    // console.log('descendants',root.descendants());
    // console.log('links:', root.links());
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.selectAll('rect').attr('class',function(d,i){
        console.log('i:',i);
        if ((i>4 & i!=18)) return 'remove';
        else return 'treemap';
    })

    // console.log('to remove:', d3.selectAll('rect.remove'))
    d3.selectAll('rect.remove').remove();


    d3.treemap()
        .size([width, height-30])
        .padding(3)
        (root3)

        svg  = d3.selectAll('svg')

        var rects= svg.selectAll('rect')
    
        svg
        .selectAll("rect")
        .attr('class','treemap')
        .data(root3.leaves())
        .enter()
        .append("rect")
        .attr('x',sizeX_with_margins)
        .attr('y', sizeY_with_margins)
        .merge(rects)
        .transition().duration(1000)
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", function(d){
            return colorScaleforTreeMap(d.parent.data.name);})
    
        rects.exit().remove()


        svg.append('rect')
        .attr('x', sizeX_with_margins*.025)
        .attr('y', sizeY_with_margins * .94 )
        .attr('height', sizeY_with_margins*0.05)
        .attr('width', sizeX_with_margins*.95)
        .attr('fill', 'red')
        .attr('class','treemap')
        .style("stroke", "black")

    svg.selectAll('rect')
    .on("click",function(d,i ){
        if (i== 6){
            updateTree1(width, height, margin);
        }
    })
    .on('mouseover', function(d,i ){
        if (i==6){
            d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                return "lightgrey"})
        }
        else d3.select(this).style('cursor', 'default' )
        let res = d3.select('.tooltip');
        if (i!=6){
            res.html('<strong>'+d.data.name+'</strong>'+
                '<br>Algorithm: '+d.parent.data.name+'<br>Market Cap: '+formatNum(d.data.marketcap)); 
            res.style('right', tooltipright + "%");
            res.style('top', tooltiptop+ "%");
            res.style('opacity',1)
        }
    })
    .on('mouseout', function(d,i ){
        if (i==6){
            d3.select(this).style('cursor', 'pointer').style("fill", function(d){
                return "red"})
        }
    })


    svg.selectAll('.treemap-text').remove();

    // and to add the text labels
    svg
    .selectAll(".treemap-text")
    .data(root3.leaves())
    .enter()
    .append("text")
        .attr("x", function(d){ return d.x0+3})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name })
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr('class','treemap-text')


        svg.append('text')
        .attr('x', sizeX_with_margins*.95 / 2)
        .attr('y', 9.7*sizeY_with_margins/10 )
        .attr('class', 'treemap-text')
        .text('Return to Overview')
        .attr("font-size", "16px")
        .attr("fill", "white")

    svg.selectAll(".legendSequential").remove()
}

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };







	// actions to take on each step of our scroll-driven story
	var steps = [
        function step0()
        {
            console.log('step 0, line graph')
            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').remove()
            chart.style('opacity',0)
            rects.style('opacity',0)
            d3.selectAll('.tooltip').style('opacity',0)
            // chart.selectAll('circle').remove()
            svg.selectAll(".legendSequential").remove()

            timeline.transition().style('opacity',1)

            timeline.raise()


var path = timeline.append("path")
            .datum(market_data)
            .attr("fill", "none")
            .attr("stroke", 'lightgrey')
            .attr("stroke-width", 4)
            .attr("d", d3.line()
                .x(function(d) { return x(+d.date) })
                .y(function(d) { return y(+d.value) })
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



    var selectCircle = timeline.selectAll("circle")
        .data(market_data)
        .enter().append('circle')


        timeline.selectAll('circle')
                .attr('class','circle')
                .attr('fill','lightgrey')
                .attr('r', lineCircleRMin)
                .attr('cx', function(d){
                    return x(+d.date) } )
                .attr('cy', function(d){return y(+d.value)})
                .style('opacity',0)


        setTimeout(function(){ 

            timeline.selectAll('circle')
            .on('mouseover',function(d, i){
                
                d3.select(this).style('cursor', 'pointer')
                d3.select(this).attr('r', lineCircleRMax).style('fill','lightgrey').style('stroke',"black")
                d3.select(this).style('opacity',1)
                let res = d3.selectAll('.tooltip')
                res.style('opacity',1)
                res.html('<br>Total Market Cap: '+formatNum(d.value)+ ' million. <br>Date: '+dateFormat(d.date));
                res.style('right', tooltipright-10 + "%");
                res.style('top', tooltiptop + "%");
            })
            .on('mouseout',function(d){
                d3.select(this).attr('r', lineCircleRMin).style('stroke',"transparent").style('opacity',0)
                let res = d3.selectAll('.tooltip').style('opacity',0)
            }) 

                }, timeLineTime);

        
        },




		function step1() {
            console.log('step  1, giant balloon');

            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity',1)

            timeline.lower()
            svg.selectAll(".legendSequential").remove()
            

            //hide old tooltip:
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)

            //hide timeline:
            // timeline.style('opacity',0)

            chart.style('opacity',1)
            //hide treemap (in case someone scrolls really fast):
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            chart.lower()
            timeline.selectAll('path')
                .transition().duration(500)
                .style('opacity',0)
            timeline.selectAll('circle')
                .transition().duration(500)
                .attr('cy', sizeY_with_margins+1000)
                .transition().duration(500)
                .style('opacity',0)

            timeline.transition().duration(500).style('opacity',0)







            // define a general transition:
			var t = d3.transition()
                .duration(400)
                .ease(d3.easeCubicOut)


        d3.selectAll('.item').remove()
                    //adding first circle: 
		var item = chart.selectAll('.item')
        .data(newdata)
        .enter().append('g')
            .classed('item', true)
            .attr('transform', translate(chartSize / 2, chartSize / 2))
    
    item.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .style('opacity',1)
                
        
            //hide x-axis (on scrollup):
            var axis = graphicVisEl.selectAll('.x-axis')
            var scaleSize = (chartSize/2 + side_margin)
            axis
                .transition(t)
                .call(xAxis)
                .attr("class", "x-axis")
                .attr("transform", "translate(" + 0 + "," + sizeY + ")")
                .style("opacity", 0)


            //transition for the giant circle:
            var item = graphicVisEl.selectAll('.item')
            item.classed('balloon', true)
            // item.attr('class', 'balloon')
			item.transition(t)
                .attr('transform', function(d){
                        return translate(0,0)
                })
            
            // Functions to center the first "balloon" under the text correctly
            var center_header_location = document.getElementsByClassName("firstvis")[0];
            // var padding = window.getComputedStyle(center_header_location, null).getPropertyValue('padding')
            var center_balloon_x = center_header_location.clientWidth/2
            var center_balloon_Y = center_header_location.clientHeight/2
            
            //add the giant circle:
            item.select('circle')
                .style('fill','lightgrey')
                .attr('cx', center_balloon_x)
                .attr('cy',center_balloon_Y)
				.transition(t)
                .attr('r', function(){
                    return center_balloon_Y/1.3
                }) // Set max r to some value based on svg size
                .style('opacity', 1)
            

                // .on('mouseover', function(d){
                //     console.log("TEST")
                //     tooltip.html("TEST")
                //             .style("left", (d3.event.pageX) + "px")		
                //             .style("top", (d3.event.pageY - 100) + "px");	
                // }) // USE THIS DIFFERENT PLACES TO TRIGGER ON EVENT -- couldn't get this last night...
                

            //remove text from scrollup:
            d3.selectAll('.item text').remove()

            //add new text containing just "Coins":
            var circleText = d3.selectAll(".item").append("text")
            .attr("class", "bigText")		
            .style('fill','white')
            .html("Coins")
            .style('opacity',1)
            .attr("x", center_balloon_x)
            .attr("y", center_balloon_Y);
    },



		function step2() {
            console.log('step  2');

            d3.selectAll('rect').remove();
            d3.selectAll(".circleText").remove();
            d3.selectAll('circle').style('opacity',1)
            d3.selectAll(".bigText").transition().duration(1000).style('opacity',0)
            svg.selectAll(".legendSequential").remove()
            
            //hide old tooltip:
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)
            timeline.lower()

            // Remove balloon animation
            var item = graphicVisEl.selectAll('.item')
            item.classed('balloon', false)

            //hide timeline:
            d3.selectAll('timeline').style('opacity',0)

            //hide treemap (in case someone scrolls really fast):
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()
            

            //raise chart element to make sure tooltip works.
            chart.raise()

            //return circles center to 0,0:
            var item = graphicVisEl.selectAll('.item')



            // item.selectAll('circle')
            //     .transition().duration(300).ease(d3.easeCubicOut)
            //     .attr('cx', -200).attr('cy', -200)
            //     .transition()
            //     .attr('cx', 0).attr('cy',0)
            //     .attr('r',20)
            // item.transition().duration(500)
            //     .attr('transform', function(d,i){
            //         return translate(0,0)
            //     })

            
        setTimeout(function(){ 

            var item = graphicVisEl.selectAll('.item')
                        // Define the circletext:
            item.append("text")
                .attr("class", "circleText")
                // .transition(t)		
                .style('fill','white')
                .html(function(d){return d.symbol;})
                .style('opacity',1)

            item.selectAll("circle").attr("cx",0).attr("cy",0)
            graphicVisEl.selectAll('.item')
                        .transition().duration(500).ease(d3.easeLinear)
                        .attr('transform', function(d, i) {
                            return translate(scaleX(d.year), scaleY(i))
                        })
                                    //change circle radius:
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
                                    //transition each item to its position:
                    
            
            //define a general transition:
			var t = d3.transition()
				.duration(1000)
                .ease(d3.easeExpInOut)
                	
            //show the x-axis:
            var axis = graphicVisEl.selectAll('.x-axis')
            axis
            .transition(t)
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + sizeY_with_margins + ")")
            .style("opacity", 1)





                        

            //define mouseover behavior for circles (tooltip):
            d3.selectAll('circle')
                .on('mouseover', function(d){
                    d3.select(this).style('cursor', 'pointer')
                    // d3.select(this).moveToFront();
                    d3.select(this).attr('r', minR * 1.5 )
                    let res = d3.select('.tooltip');
                    res.html('<strong>'+d.name+'</strong>'+
                        '<br>Algorithm: '+d.algo+'<br>Market Cap: '+formatNum(d.marketcap));
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop+ "%");
                    res.style('opacity',1)
                })
                .on('mouseout', function(){
                    d3.select(this).attr('r', minR)
                    d3.selectAll('.tooltip').style('opacity',0)
                })

            

            //position the x-axis:
            x_axis_location = sizeY_with_margins - bottom_margin
            axis
                .transition(t)
                .call(xAxis)
                .attr("class", "x-axis")
                .attr("transform", translate(0, x_axis_location))
                .style("opacity", 1)

            d3.selectAll('path').remove()
            
		},




		function step3() {
            //this one colors the bubbles according to algo.
            console.log('step  3');

            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity',1)

            //hide timeline:
            d3.selectAll('timeline').transition(t).style('opacity',0)
            timeline.lower()
            //hide old tooltip:
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)


            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()
            // d3.selectAll()

            //raise chart element to make sure tooltip works.
            chart.raise()

svg.selectAll(".legendSequential").remove()

legend = svg.append("g")
    .attr("class", "legendSequential")
    .attr("transform", "translate(" + side_margin + "," + 3*top_margin + ")")
    // .attr("transform", "translate(20, 80)");

legendSequential = d3.legendColor()
    .shapeWidth(20)
    // .cells(6)
    .orient("vertical")
    .scale(colorScaleforLegend) 
    .title("Algorithms:")
    .shapeHeight(7 * (sizeY_with_margins - x_axis_location)/newdata.length)

svg.select(".legendSequential")
    .call(legendSequential);

            //transition definition:
			var t = d3.transition()
				.duration(800)
                .ease(d3.easeQuadInOut)
                

			// circles are colored:
			var item = graphicVisEl.selectAll('.item')
			
			item.select('circle')
				.transition(t)
				.style('fill', function(d, i) {
					return colorScaleforLegend(d.algo);
                })
                

            // Define the circletext:
            d3.selectAll(".item text").remove()

            // d3.selectAll('.item').append("text")
            // .attr("class", "circleText")				
            // .html(function(d){return d.algo;})
            // .style("opacity", 1)



            let circles = item.select('circle')
                .transition(t)
                .attr('r', function(d, i) {
                    return minR;
                })

            //tooltip:
            circles = item.selectAll('circle')
            .on('mouseover', function(d){
                d3.select(this).style('cursor', 'pointer')
                d3.select(this).attr('r', minR *1.5)
                let res = d3.selectAll('.tooltip')
                res.style('opacity',1)
                res.html('<strong>'+d.name+'</strong>'+
                '<br>Algorithm: '+d.algo+'<br>Market Cap: '+formatNum(d.marketcap));
                res.style('right', tooltipright-12 + "%"); // MATCH THIS TO NEXT STEP
                res.style('top', tooltiptop + "%");
                res.style('background-color', colorScaleforLegend(d.algo))
                console.log(colorScaleforLegend(d.algo))
                if (!['#00FF00', '#ffe119', '#46f0f0', '#bcf60c', '#fabebe', '#e6beff'].includes(colorScaleforLegend(d.algo))){
                    res.style('color', 'white')
                }
            })
            .on('mouseout', function(d){
                d3.select(this).attr('r', minR)
                let res = d3.selectAll('.tooltip').style('opacity',0)
                res.style('color', 'black')
                res.style('background-color', 'lightgrey')
            })
        },





        function step4() {
            //bubbles grow in size to represent market cap.
            console.log('step  4');

            d3.selectAll('rect').remove();
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity',1)
            svg.selectAll(".legendSequential").remove()

            //hide timeline:
            d3.selectAll('timeline').transition(t).style('opacity',0)
            timeline.lower()
            //hide old tooltip:
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)

            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            //remove symbol titles from circles:
            d3.selectAll('.circleText').remove();

            //raise chart element to make sure tooltip works.
            chart.raise()

        
            var t = d3.transition()
				.ease(d3.easeLinear)

			// circles are sized
			var item = graphicVisEl.selectAll('.item')
			item.select('circle')
				.transition(t)
				.delay(50)
				.attr('r', function(d, i) {
					return marketScale(d.marketcap);
                })
                .style('fill', function(d, i) {
					return colorScaleforLegend(d.algo);
                })
            


            item.selectAll('circle')
                .on('mouseover',function(d){
                    d3.select(this).style('cursor', 'pointer')
                    d3.select(this).attr('r', marketScale(d.marketcap) *1.5)
                    let res = d3.selectAll('.tooltip')
                    res.style('opacity',1)
                    res.html('<strong>'+d.name+'</strong>'+
                    '<br>Algorithm: '+d.algo+'<br>Market Cap: '+formatNum(d.marketcap));
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop + "%");
                    res.style('background-color', colorScaleforLegend(d.algo))
                    console.log(colorScaleforLegend(d.algo))
                    if (!['#00FF00', '#ffe119', '#46f0f0', '#bcf60c', '#fabebe', '#e6beff'].includes(colorScaleforLegend(d.algo))){
                        res.style('color', 'white')
                    }
                })
                .on('mouseout', function(d){
                    d3.select(this).attr('r', marketScale(d.marketcap))
                    let res = d3.selectAll('.tooltip').style('opacity',0)
                    res.style('color', 'black')
                    res.style('background-color', 'lightgrey')
                })


legend = svg.append("g")
    .attr("class", "legendSequential")
    .attr("transform", "translate(20, 80)");

legendSequential = d3.legendColor()
    .shapeWidth(20)
    // .cells(6)
    .orient("vertical")
    .scale(colorScaleforLegend) 
    .title("Algorithms:")
    .shapeHeight(20)

                svg.select(".legendSequential")
                .call(legendSequential);
        },




        function step5() {
            //bubbles return to neutral colors:
            console.log('step  5');
            d3.selectAll('path').remove()
            d3.selectAll('circle').style('opacity',1)
            svg.selectAll(".legendSequential").remove()
            //hide timeline:
            d3.selectAll('timeline').style('opacity',0)
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)
            timeline.lower()
            //hide treemap:
            d3.selectAll('rect').remove();
            d3.selectAll('.treemap-text').remove()
            //remove symbol titles from circles:
            d3.selectAll('.circleText').remove();
            //raise chart element to make sure tooltip works.
            chart.raise()

            d3.selectAll('circle').style('opacity',1)
            d3.selectAll('.x-axis').style('opacity',1)
            d3.selectAll('item text').style('opacity',1)
            // d3.selectAll('.tooltip').style('opacity',1)

                
            var t2 = d3.transition()
                .duration(500)
                .ease(d3.easeLinear)
                


                // item.selectAll('circle')
                // .transition().duration(400).ease(d3.easeCubicOut)
                // .attr('cx', -200).attr('cy', -200)
                // .transition()
                // .attr('cx', 0).attr('cy',0)





			// circles are colored back to neutral:
			var item = graphicVisEl.selectAll('.item')
			item.selectAll('circle').transition().ease(d3.easeLinear)
                .style('fill','lightgrey')
                .style('opacity',1)
                .attr('cx', function(d){
                    return 0})
                .attr('cy', function(d,i){return 0;})

            item
                .attr('transform', function(d, i) {
                    return translate(scaleX(d.year), scaleY(i))
                })


            //tooltips:
            let circles = item.selectAll('circle')
                .on('mouseover', function(d){
                    d3.select(this).style('cursor', 'pointer')
                    d3.select(this).attr('r', marketScale(d.marketcap) *2)
                    let res = d3.selectAll('.tooltip')
                    res.style('opacity',1)
                    res.html('<strong>'+d.name+'</strong>'+
                    '<br>Algorithm: '+d.algo+'<br>Market Cap: '+formatNum(d.marketcap));
                    res.style('right', tooltipright + "%");
                    res.style('top', tooltiptop + "%");
                })
                .on('mouseout', function(d){
                    d3.select(this).attr('r', marketScale(d.marketcap))
                    let res = d3.selectAll('.tooltip').style('opacity',0)
                })      


            d3.selectAll('.tooltip').style('opacity',0)
        },


        
        function step6() {
            console.log('step 6')

            svg.selectAll(".legendSequential").remove()
            d3.selectAll('path').remove()

            // d3.selectAll('timeline').transition(t).style('opacity',0)
            d3.selectAll('circle').transition().duration(600).ease(d3.easeLinear)
                .attr('cy', sizeY_with_margins+10)
                .transition().duration(300)
                .style('fill', 'brown')
            timeline.lower()


            //transition defn:
            var t = d3.transition()
                .ease(d3.easeLinear)
            let margin_treemap = {top: 10, left:0, right:0, bottom: 10}




            setTimeout(function(){ 

            //hide the first vis: 
            chart.lower()
            rects.transition(t).style('opacity',1)
            // d3.selectAll('circle').transition(t).style('opacity',0)
            d3.selectAll('.x-axis').transition(t).style('opacity',0)
            d3.selectAll('item text').transition(t).style('opacity',0)
            d3.selectAll('.tooltip').transition(t).style('opacity',0)


            updateTree1(sizeX_with_margins,sizeY_with_margins,margin_treemap);
            
            //hide old tooltip:
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)
    
                    }, 1100);



        },


        function step7()
        {

            svg.selectAll(".legendSequential").remove()
            d3.selectAll('path').remove()
            d3.selectAll('.tooltip').style('opacity',0)


            var t = d3.transition()
				.ease(d3.easeLinear)
            //hide treemap:
            d3.selectAll('rect').remove()
            d3.selectAll('.treemap-text').remove()
            
            //hide timeline:
            d3.selectAll('timeline').style('opacity',0)
            timeline.selectAll('.circle').selectAll('.tooltip').style('opacity',0)
            timeline.lower()
            //hide old tooltip:
            
            //remove symbol titles from circles:
            d3.selectAll('.circleText').remove();

        }

        // function step7()
        // {
            
        // }

	]

	// update our chart
	function update(step) {
        let k= steps[step];
        k.call();
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}




	function setupCharts() {
        //append svg for our first vis:
        sizeX_with_margins = sizeX-2*side_margin // 2*20 comes from the padding of div.graphic__vis
        sizeY_with_margins = sizeY - bottom_margin - top_margin // keeping consistent with above

		svg = graphicVisEl.append('svg')
			.attr('width', sizeX_with_margins)
            .attr('height', sizeY_with_margins)
            .attr('class','firstvis')
            // .attr('transform', 'translate(0,0)')

        
        //group element for our first vis:
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

        //xscale:
		scaleX = d3.scaleLinear()


        //testing input data:
        var lowestVal = d3.min(newdata, d=>d.year)
        var highestVal = d3.max(newdata, d=>d.year)
        var tickNumber = highestVal-lowestVal
        // d3.min(data,d=>d.Income)

        //define scaleX:
		scaleX
			.domain([lowestVal, highestVal])
            .range([3*side_margin, sizeX_with_margins-3*side_margin]);

        var scaleSize = chartSize/2 + side_margin

        
        //define x-axis:
        xAxis = d3.axisBottom().scale(scaleX).ticks(tickNumber).tickFormat(d3.format("d"))
        //add x-axis to group xg:
        var xg = svg.append("g")
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
        .style("opacity", 0)

        scaleY = d3.scaleLinear()
            .domain([0, newdata.length])
            .range([top_margin, sizeY_with_margins- bottom_margin]);

        var lowestRadius = sizeY_with_margins * .02
        var highestRadius = sizeY_with_margins * .05
        marketScale = d3.scaleLinear()
            .domain(d3.extent(newdata,function(d){return d.marketcap;}) )
            .range([lowestRadius,highestRadius]);


        // //adding first circle: 
		// var item = chart.selectAll('.item')
		// 	.data(newdata)
		// 	.enter().append('g')
		// 		.classed('item', true)
		// 		.attr('transform', translate(chartSize / 2, chartSize / 2))
		
		// item.append('circle')
		// 	.attr('cx', 0)
        //     .attr('cy', 0)
            
        
        
        
        timeline = svg.append('g')
			.classed('timeline', true)
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')')

        var parseTime = d3.timeParse("%m/%d/%y");

        for (let i=0;i<time_data.length;i++){
            market_data[i]={value: ((+ (time_data[i]["MarketCap"])/1000000).toFixed(2)), date: parseTime(time_data[i]["Date"])}
        }

        x = d3.scaleTime()
                .domain(d3.extent(market_data, function(d) { 
                    return +d.date; 
                }))
                .range([4*side_margin, sizeX_with_margins-4*side_margin]);
        
        y = d3.scaleLinear()
                .domain([0, d3.max(market_data, function(d) { return +d.value; })])
                .range([ sizeY_with_margins- bottom_margin, bottom_margin ]);
        
        //define aces and groups and axes labels:
        var lineXAxis = d3.axisBottom().scale(x);
        var lineYAxis = d3.axisLeft().scale(y);

        timeline.append('g').call(lineXAxis)
            .attr('class','linex')
            .attr('transform', 'translate(0,'+ (sizeY_with_margins - bottom_margin)+')')
        timeline.append('g').call(lineYAxis)
            .attr('transform','translate('+(4*side_margin) +',0)')
            .attr('class','liney')
        
        timeline.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -1*sizeY_with_margins/2)
            .attr("y",side_margin)
            // .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style('fill','lightgrey')
            .text("Millions of Dollars");

        // var path = timeline.append("path")
        //     .datum(market_data)
        //     .attr("fill", "none")
        //     .attr("stroke", "pink")
        //     .attr("stroke-width", 4)
        //     .attr("d", d3.line()
        //         .x(function(d) { return x(+d.date) })
        //         .y(function(d) { return y(+d.value) })
        //         )

        // var selectCircle = timeline.selectAll(".circle")
        //     .data(market_data)

        // selectCircle
        //         .enter().append('circle')
        //         .attr('class','circle')
        //         .attr('fill','pink')
        //         .attr('r', lineCircleRMin)
        //         .attr('cx', function(d){
        //             return x(+d.date) } )
        //         .attr('cy', function(d){return y(+d.value)})
        //         .style('opacity',1)
	}


	function setupProse() {
		var height = window.innerHeight * 0.6
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
	}
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
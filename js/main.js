//next:
//tooltips: treemap and fix vis1 tooltip on upscroll. 
//dynamic data vis?


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

window.createGraphic = function(graphicSelector, newdata, parent_height, parent_width){
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
    var graphicProseEl = graphicEl.select('.graphic__prose')

    var marketScale = d3.scaleLinear()
        .domain(d3.extent(newdata,function(d){return d.marketcap;}) )
        .range([15,35]);
    var algos=[];
    for (let i=0;i<newdata.length;i++){
        if (!algos.includes(newdata[i].algo) && newdata[i].algo !=undefined) algos.push(newdata[i].algo);
    }
    algos.push("Other")
    console.log('algos:', algos);
    var colorScale = d3.scaleOrdinal(["sienna","maroon", "olive",'green','teal','lime','fuchsia','silver', 'hotpink',"orange","tan","green","brown","grey","purple","blue","aqua"]) 
        .domain(algos)
    for (let i=0;i<17;i++){
        this.console.log(colorScale(algos[i]));
    }

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

    var side_margin = 20  // -- margin must match padding from graphic__vis
    var bottom_margin = 40 // arbitrary -- used for placing circles
    var top_margin = 40 // arbitrary -- used for placing circles
    var sizeX = parent_width
    var sizeY = parent_height
    var sizeX_with_margins, sizeY_with_margins;
	var chartSize = sizeX - (20 * 2) // due to padding from graphic__vis
    var scaleX = null
    var scaleY = null
	var minR = 25
    var maxR = 200
    var xAxis = null
    var x_axis_location
    var svg
    var parseTime = d3.timeParse("%Y");
    var root
    var rects

//our treemap-strucutred data: 
// var treedata={"children":[]};
// for (let i=0;i<algos.length;i++){
//     let children=[];
//     for (let j=0;j<newdata.length;j++){
//         if (newdata[j].algo== algos[i]){
//             children.push({name: newdata[j].name, marketcap: newdata[j].marketcap});
//         }
//     }
//     let j= {name: algos[i], children: children};
//     treedata['children'].push(j);
// }
var treedata1 = {"children": [
    {"name":"SHA-256","children":
        [{"name":"Bitcoin","marketcap":157000000000}] },
    {"name":"Dagger-Hashimoto","children":
        [{"name":"Ethereum","marketcap":20256946583}] },
    {"name":"Other","children":
        [{"name":"Other", "marketcap": sumforstep5}] }
]}

var treedata2 = {"children":[
    {"name":"Scrypt","children":
        [{"name":"Litecoin","marketcap":3836414728},
            {"name":"Dogecoin","marketcap":328051591.5}]},
    {"name":"Transaction fee","children":
        [{"name":"Stellar","marketcap":1459172668},
        {"name":"Waves","marketcap":78217357.51},
        {"name":"BitShares","marketcap":73893904.53},
        {"name":"MaidSafeCoin","marketcap":61514780.16}]},
    {"name":"CPU mining; CryptoNight","children":
        [{"name":"Monero","marketcap":1090476909}]},
    {"name":"X11","children":
        [{"name":"Dash","marketcap":631552497.2}]},
    {"name":"blockchain","children":
        [{"name":"NEM","marketcap":378860292.4}]},
    {"name":"Equihash","children":
        [{"name":"Zcash","marketcap":288109779.9}]},
    {"name":"Blake256","children":
        [{"name":"Decred","marketcap":251853300.9}]},
    {"name":"Smart contract","children":
        [{"name":"Augur","marketcap":127941720.7}]},
    {"name":"Equilhash","children":
        [{"name":"Komodo","marketcap":121105885.6}]},
    {"name":"Other", "children":
        [{"name":"Other", "marketcap": sumforupdatetree1} ] }

    // {"name":"Sidechain","children":
    //     [{"name":"Lisk","marketcap":97313663.16}]},
    // {"name":"SHA-256;Scrypt;Qubit;Skein;Groestl","children":
    //     [{"name":"DigiByte","marketcap":87731409.07}]},
    // {"name":"blake2b","children":
    //     [{"name":"Siacoin","marketcap":84616061.08}]},
    // {"name":"Scrypt;X17;Groestl;Blake2s;Lyra2rev2","children":
    //     [{"name":"Verge","marketcap":74185162.88}]},
    // {"name":"Lyra2RE","children":
    //     [{"name":"MonaCoin","marketcap":69801518}]}
]};
var root2 = d3.hierarchy(treedata2).sum(function(d){ return d.marketcap});

var treedata3 = {"children":[
    {"name":"Sidechain","children":
        [{"name":"Lisk","marketcap":97313663.16}]},
    {"name":"SHA-256;Scrypt;Qubit;Skein;Groestl","children":
        [{"name":"DigiByte","marketcap":87731409.07}]},
    {"name":"blake2b","children":
        [{"name":"Siacoin","marketcap":84616061.08}]},
    {"name":"Scrypt;X17;Groestl;Blake2s;Lyra2rev2","children":
        [{"name":"Verge","marketcap":74185162.88}]},
    {"name":"Lyra2RE","children":
        [{"name":"MonaCoin","marketcap":69801518}]}
]};
var root3 = d3.hierarchy(treedata3).sum(function(d){ return d.marketcap})

// console.log(JSON.stringify(treedata));
    


function updateTree1(width,height,margin){
    // console.log('descendants',root.descendants());
    // console.log('links:', root.links());
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .padding(2)
        (root2)

    d3.selectAll('rect').remove();

    svg  = d3.selectAll('svg').append('svg')
    svg
    .selectAll("rect")
    .attr('class','treemap')
    .data(root2.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", function(d){return colorScale(d.parent.data.name);})
    .on("click",function(d){
        let n= d.data.name;
        if (n!= "Ethereum" &n!= "Bitcoin"){
            updateTree2(width,height,margin); 
        }
    })

    svg.selectAll('text').remove();

    //add text labels:
    svg
    .selectAll("text")
    .data(root2.leaves())
    .enter()
    .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", "white")
        .attr('class','treemap-text')



            //HERE ENDS TREE1
}


function updateTree2(width,height,margin){
    // console.log('descendants',root.descendants());
    // console.log('links:', root.links());
    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .padding(2)
        (root3)

    d3.selectAll('rect').remove();

    svg  = d3.selectAll('svg').append('svg')
    svg
    .selectAll("rect")
    .attr('class','treemap')
    .data(root3.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", function(d){return colorScale(d.parent.data.name);})
    .on("click",function(d){
    })

    svg.selectAll('text').remove();

    // and to add the text labels
    svg
    .selectAll("text")
    .data(root3.leaves())
    .enter()
    .append("text")
        .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
        .text(function(d){ return d.data.name })
        .attr("font-size", "15px")
        .attr("fill", "white")
        .attr('class','treemap-text')
}







	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
            console.log('step  0');

            //hide treemap (in case someone scrolls really fast):
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            // define a general transition:
			var t = d3.transition()
                .duration(400)
				.ease(d3.easeQuadInOut)
			
            
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
                .style('fill','pink')
                // .attr('class','balloon')
                .attr('cx', center_balloon_x)
                .attr('cy',center_balloon_Y)
				.transition(t)
                .attr('r', function(){
                    return center_balloon_Y/1.3
                }) // Set max r to some value based on svg size
                .style('opacity', 1)

            //remove text from scrollup:
            d3.selectAll('.item text').remove()

            //add new text containing just "Coins":
            var circleText = d3.selectAll(".item").append("text")
            .attr("class", "circleText")	
            .style('opacity',0)		
            .style('fill','white')
            .html("Coins")
            .style('opacity',1)
            .attr("x", center_balloon_x)
            .attr("y", center_balloon_Y);
    },



		function step1() {
            console.log('step  1');
            
            // Remove balloon animation
            var item = graphicVisEl.selectAll('.item')
            item.classed('balloon', false)

            //hide treemap (in case someone scrolls really fast):
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            //return circles center to 0,0:
            var item = graphicVisEl.selectAll('.item')
            item.select('circle').attr('cx',0).attr('cy',0);


            //for the tooltip. best to just fix a position since 
            //varying based on mouseover location is clumsy: 
            let res = d3.select('.tooltip');
            res.style('opacity',0);

            //define a general transition:
			var t = d3.transition()
				.duration(400)
                .ease(d3.easeQuadInOut)
                	
            //show the x-axis:
            var axis = graphicVisEl.selectAll('.x-axis')
            axis
            .transition(t)
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + 0 + "," + sizeY_with_margins + ")")
            .style("opacity", 1)


            //transition each item to its position:
			item.transition(t)
				.attr('transform', function(d, i) {
					return translate(scaleX(d.year), scaleY(i))
				})


            //change circle radius:
            var item = graphicVisEl.selectAll('.item')
            item.select('circle')
                .attr('class','')
                .style('fill', 'pink')
				.transition(t)
                .attr('r', minR) // minR needs to be a more standardized scale....
                .style('opacity', 1)


            // Define the circletext:
            var circleText = d3.selectAll(".item").append("text")
                .attr("class", "circleText")		
                .style('fill','white')
                .html(function(d){return d.symbol;})
                .style('opacity',1)

            circleText.exit()
                        

            //define mouseover behavior for circles (tooltip):
            let circles = item.select('circle')
                .on('mouseover', function(d){
                    d3.select(this).style('fill','red');
                    let res = d3.select('.tooltip');
                    res.transition().duration(50)
                        .style('opacity',1)
                    res.html('<strong>'+d.name+'</strong>'+
                        '<br>Algorithm: '+d.algo+'<br>Market Cap: '+d.marketcap);
                    res.style('right', 50 + "px");
                    res.style('top', 500 + "px");
                })
                .on('mouseout', function(){
                    d3.select(this).style('fill','pink');
                    let res = d3.select('.tooltip');
                    res.style('opacity',0);
                })

			item.select('text')
				.transition(t)
                .style('opacity', 0)
            

            //position the x-axis:
            x_axis_location = sizeY_with_margins - bottom_margin
            axis
                .transition(t)
                .call(xAxis)
                .attr("class", "x-axis")
                .attr("transform", translate(0, x_axis_location))
                .style("opacity", 1)
		},




		function step2() {
            //this one colors the bubbles according to algo.
            console.log('step  2');

            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            //transition definition:
			var t = d3.transition()
				.duration(800)
                .ease(d3.easeQuadInOut)
                

			// circles are colored:
			var item = graphicVisEl.selectAll('.item')
			
			item.select('circle')
				.transition(t)
				.style('fill', function(d, i) {
					return colorScale(d.algo);
                })
                

            // Define the circletext:
            d3.selectAll(".item text").remove()

            d3.selectAll('.item').append("text")
            .attr("class", "circleText")				
            .html(function(d){return d.algo;})
            .style("opacity", 1)
            



            let circles = item.select('circle')
                .transition(t)
                .attr('r', function(d, i) {
                    return minR;
                })

            //tooltip:
            circles = item.selectAll('circle')
            .on('mouseover', function(d){
                d3.select(this).style('fill','red')
                let res = d3.selectAll('.tooltip')
                res.transition().duration(50)
                    .style('opacity',1)
                res.html('<strong>'+d.name+'</strong>'+
                '<br>Algorithm: '+d.algo+'<br>Market Cap: '+d.marketcap);
                // console.log((d3.event.pageX), d3.event.pageY-1400);
                res.style('right', 50 + "px");
                res.style('top', 500 + "px");
                // div.style('left', (d3.event.pageX) + "px")
                // div.style('top', (d3.event.pageY) + "px");
                // console.log(d.name)
            })
            .on('mouseout', function(d){
                d3.select(this).style('fill', colorScale(d.algo))
                let res = d3.select('.tooltip');
                res.style('opacity',0);
            })
        },





        function step3() {
            //bubbles grow in size to represent market cap.
            console.log('step  3');

            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            //remove symbol titles from circles:
            d3.selectAll('.circleText').remove();

        
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
					return colorScale(d.algo);
                })
        },




        function step4() {
            //bubbles return to neutral colors:
            console.log('step  4');

            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
            d3.selectAll('.treemap-text').remove()

            //transition defn:
            var t = d3.transition()
                .ease(d3.easeLinear)
                
            var t2 = d3.transition()
                .duration(500)
				.ease(d3.easeLinear)

            //show the first vis:
            d3.selectAll('circle').transition(t2).style('opacity',function() {
                return 1})
            d3.selectAll('.x-axis').transition(t2).style('opacity',1)
            d3.selectAll('item text').transition(t2).style('opacity',1)

			// circles are colored back to neutral:
			var item = graphicVisEl.selectAll('.item')
			item.select('circle')
				.transition(t2)
                .style('fill','pink')


            //tooltips:
            let circles = item.selectAll('circle')
                .on('mouseover', function(d){
                    d3.select(this).attr('r',marketScale(d.marketcap)*1.5);
                    let res = d3.selectAll('.tooltip')
                    res.transition().duration(50)
                        .style('opacity',1)
                    res.html('<strong>'+d.name+'</strong>'+
                    '<br>Algorithm: '+d.algo+'<br>Market Cap: '+d.marketcap);
                    // console.log((d3.event.pageX), d3.event.pageY-1400);
                    res.style('right', 50 + "px");
                    res.style('top', 500 + "px");
                    // div.style('left', (d3.event.pageX) + "px")
                    // div.style('top', (d3.event.pageY) + "px");
                    // console.log(d.name)
                })
                .on('mouseout', function(d){
                    d3.select(this).attr('r',marketScale(d.marketcap))
                    let res = d3.select('.tooltip');
                    res.style('opacity',0);
                })      
        },


        
        function step5() {
            console.log('step 5')

            //transition defn:
            var t = d3.transition()
                .ease(d3.easeLinear)
                
            
            let margin_treemap = {top: 10, left:0, right:0, bottom: 10}

            //hide the first vis: 
            // sleep(2000);
            d3.selectAll('circle').transition(t).style('opacity',0)
            d3.selectAll('.x-axis').transition(t).style('opacity',0)
            d3.selectAll('item text').transition(t).style('opacity',0)
            d3.selectAll('.tooltip').transition(t).style('opacity',0)

            //this automatically calculates x and y coordinates based on our 
            // treemap data: 

            
            // var root = d3.hierarchy(treedata1).sum(function(d){ return d.marketcap}) // Here the size of each leave is given in the 'value' field in input data
            // // console.log('descendants',root.descendants());
            // // console.log('links:', root.links());
            // // Then d3.treemap computes the position of each element of the hierarchy
            // d3.treemap()
            //     .size([sizeX_with_margins, sizeY_with_margins])
            //     .padding(2)
            //     (root)
            
            //add a new svg: 
            // svg  = d3.selectAll('svg').append('svg')
            // svg
            //     .append('svg')
            //     .attr('width', size + 2*margin.left)
            //     .attr('height', size + 2*margin.left)
            //     .attr('left', '100px')
            //     .attr('top','300px')
            //     .attr('margin-left', '50px')
            //     .attr('class','treemap')


            
            // // use this information to add rectangles:
            // let rects = svg
            //     .selectAll("rect")
            //     .attr('class','treemap')
            //     .data(root.leaves())
            //     .enter()
            //     .append("rect")
            //     .style("stroke", "black")
            //     .style("fill", function(d){return colorScale(d.parent.data.name);})

            //     .attr('x', function (d) { 
            //         return d.x0; })
            //     .attr('y', function (d) { return d.y0; })
            //     .attr('width', function (d) { return d.x1 - d.x0; })
            //     .attr('height', function (d) { return d.y1 - d.y0; })
            //     .style("opacity", 1)
                
            svg.selectAll("rect").transition(t).style("opacity",1)

            svg.selectAll('rect').on("click",function(d){
                    let n= d.data.name;
                    // console.log(d.parent.data.name);
                    // console.log(colorScale(d.parent.data.name))
                    if (n!= "Ethereum" &n!= "Bitcoin"){
                        updateTree1(sizeX_with_margins,sizeY_with_margins,margin_treemap);
                    }
                })

            // and to add the text labels
            rects
                .select("text")
                .data(root.leaves())
                .enter()
                .append("text")
                .attr("x", function(d){ 
                    return d.x0+5})    // +10 to adjust position (more right)
                .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
                .text(function(d){ return d.data.name })
                .attr("font-size", "15px")
                .attr("fill", "white")
                .attr('class','treemap-text')

        },


        function step6()
        {

            var t = d3.transition()
				.ease(d3.easeLinear)
            //hide treemap:
            d3.selectAll('rect').transition(t).style('opacity',0);
            d3.selectAll('.treemap-text').remove()
            // d3.selectAll('circle').style('opacity',0)
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
		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + 0 + ',' + 0 + ')')

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


        //adding first circle: 
		var item = chart.selectAll('.item')
			.data(newdata)
			.enter().append('g')
				.classed('item', true)
				.attr('transform', translate(chartSize / 2, chartSize / 2))
		
		item.append('circle')
			.attr('cx', 0)
            .attr('cy', 0)
            
        
        root = d3.hierarchy(treedata1).sum(function(d){ return d.marketcap}) // Here the size of each leave is given in the 'value' field in input data
        // console.log('descendants',root.descendants());
        // console.log('links:', root.links());
        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap()
            .size([sizeX_with_margins, sizeY_with_margins])
            .padding(2)
            (root)

                    // use this information to add rectangles:
        rects = svg
            .selectAll("rect")
            .attr('class','treemap')
            .data(root.leaves())
            .enter()
            .append("rect")
            .style("stroke", "black")
            .style("fill", function(d){return colorScale(d.parent.data.name);})

            .attr('x', function (d) { 
                return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .style("opacity", 1)
        
        rects
            .select("text")
            .data(root.leaves())
            .enter()
            .append("text")
            .attr("x", function(d){ 
                return d.x0+5})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ return d.data.name })
            .attr("font-size", "15px")
            .attr("fill", "white")
            .attr('class','treemap-text')

	}


	function setupProse() {
		var height = window.innerHeight * 0.7
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
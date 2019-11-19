//next:
//scrollstory runtime optimization?
//tooltips: treemap and fix vis1 tooltip on upscroll. 
//dynamic data vis?


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

window.createGraphic = function(graphicSelector, newdata){
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

	var margin = 20
	var size = 1200
	var chartSize = size - margin * 2
	var scaleX = null
	var minR = 25
    var maxR = 200
    var xAxis = null
    var svg
    var parseTime = d3.timeParse("%Y");

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
            var scaleSize = (chartSize/2 + margin)
            axis
                .transition(t)
                .call(xAxis)
                .attr("class", "x-axis")
                .attr("transform", "translate(" + margin + "," + scaleSize + ")")
                .style("opacity", 0)


            //transition for the giant circle:
            var item = graphicVisEl.selectAll('.item')
			item.transition(t)
                .attr('transform', function(d){
                        return translate(chartSize / 2, chartSize / 2)
                })
            
            //add the giant circle:
            item.select('circle')
                .style('fill','pink')
                .attr('class','balloon')
                .attr('cx', size/6)
                .attr('cy',-350)
				.transition(t)
                .attr('r', maxR)
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
		},



		function step1() {
            console.log('step  1');

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
            .attr("transform", "translate(" + size/6 + "," + scaleSize + ")")
            .style("opacity", 1)


            //transition each item to its position:
			item.transition(t)
				.attr('transform', function(d, i) {
					return translate(scaleX(parseTime(d.year)), chartSize / 2 -margin - 25*i)
				})


            //change circle radius:
            var item = graphicVisEl.selectAll('.item')
            item.select('circle')
                .attr('class','')
                .style('fill', 'pink')
				.transition(t)
                .attr('r', minR)
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
            var scaleSize = (chartSize/2 + margin)
            axis
                .transition(t)
                .call(xAxis)
                .attr("class", "x-axis")
                .attr("transform", "translate(" + margin + "," + scaleSize + ")")
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

            //show the first vis:
            d3.selectAll('circle').style('opacity',1)
            d3.selectAll('.x-axis').style('opacity',1)
            d3.selectAll('item text').style('opacity',1)
            
            //transition defn:
            var t = d3.transition()
				.ease(d3.easeLinear)

			// circles are colored back to neutral:
			var item = graphicVisEl.selectAll('.item')
			item.select('circle')
				.transition(t)
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


            //hide the first vis: 
            // sleep(2000);
            d3.selectAll('circle').style('opacity',0)
            d3.selectAll('.x-axis').style('opacity',0)
            d3.selectAll('item text').style('opacity',0)
            d3.selectAll('.tooltip').style('opacity',0)

            

            //now define stuff for treemap:
            var margin = {top: 10, right: 10, bottom: 10, left: 10}
            let size= 1000;

            var width = 1300 - margin.left - margin.right;
            var height = 700 - margin.top - margin.bottom;
            //this automatically calculates x and y coordinates based on our 
            // treemap data: 

            
            var root = d3.hierarchy(treedata1).sum(function(d){ return d.marketcap}) // Here the size of each leave is given in the 'value' field in input data
            // console.log('descendants',root.descendants());
            // console.log('links:', root.links());
            // Then d3.treemap computes the position of each element of the hierarchy
            d3.treemap()
                .size([width, height])
                .padding(2)
                (root)
            
            //add a new svg: 
            svg  = d3.selectAll('svg').append('svg')
            svg
                .append('svg')
                .attr('width', size + 2*margin.left)
                .attr('height', size + 2*margin.left)
                .attr('left', '100px')
                .attr('top','300px')
                .attr('margin-left', '50px')
                .attr('class','treemap')


            
            // console.log('root', root);
            // use this information to add rectangles:
            svg
                .selectAll("rect")
                .attr('class','treemap')
                .data(root.leaves())
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
                    // console.log(d.parent.data.name);
                    // console.log(colorScale(d.parent.data.name))
                    if (n!= "Ethereum" &n!= "Bitcoin"){
                        updateTree1(width,height,margin);
                    }
                })

            // and to add the text labels
            svg
                .selectAll("text")
                .data(root.leaves())
                .enter()
                .append("text")
                    .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
                    .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
                    .text(function(d){ return d.data.name })
                    .attr("font-size", "15px")
                    .attr("fill", "white")
                    .attr('class','treemap-text')
        },


        function step6()
        {
            //hide treemap:
            d3.selectAll('rect').style('opacity',0);
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
		svg = graphicVisEl.append('svg')
			.attr('width', size + 2*margin)
            .attr('height', size + 2*margin)
            .attr('class','firstvis')
        
        //group element for our first vis:
		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + margin + ',' + margin + ')')

        //xscale:
		scaleX = d3.scaleLinear()


        //testing input data:
		// console.log('newdata:',newdata)
        var lowestVal = d3.min(newdata, d=>d.year)
        var highestVal = d3.max(newdata, d=>d.year)
        // console.log(lowestVal)
        // d3.min(data,d=>d.Income)

        //define scaleX:
		scaleX
			.domain([parseTime(lowestVal), parseTime(highestVal)])
            .range([margin, size-margin]);

        var scaleSize = chartSize/2 + margin

        
        //define x-axis:
        xAxis = d3.axisBottom().scale(scaleX).tickFormat(d3.timeFormat("%Y"));
        //add x-axis to group xg:
        var xg = svg.append("g")
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin + "," + scaleSize + ")")


        //adding first circle: 
		var item = chart.selectAll('.item')
			.data(newdata)
			.enter().append('g')
				.classed('item', true)
				.attr('transform', translate(chartSize / 2, chartSize / 2))
		
		item.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)

	}


	function setupProse() {
		var height = window.innerHeight * 0.5
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
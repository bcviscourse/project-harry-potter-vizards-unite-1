//next:
//next vis (almost done, depends on if we want zooming)
//add transition to next vis.
//dynamic data vis?

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
    console.log('algos:', algos);
    var colorScale = d3.scaleOrdinal(d3.schemeAccent) 
        .domain(algos)

	var margin = 20
	var size = 1200
	var chartSize = size - margin * 2
	var scaleX = null
	var minR = 25
    var maxR = 200
    var xAxis = null
    var svg
    
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
            console.log('step  0');

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
                .attr('cx', -100)
                .attr('cy',-100)
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
            .attr("transform", "translate(" + margin + "," + scaleSize + ")")
            .style("opacity", 1)
            
            //define format to use for ticks: 
            var parseTime = d3.timeParse("%Y");

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
                    res.style('top', 100 + "px");
                    console.log(d.name)
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
                res.style('top', 100 + "px");
                // div.style('left', (d3.event.pageX) + "px")
                // div.style('top', (d3.event.pageY) + "px");
                console.log(d.name)
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

			// circles are sized
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
                res.style('top', 100 + "px");
                // div.style('left', (d3.event.pageX) + "px")
                // div.style('top', (d3.event.pageY) + "px");
                console.log(d.name)
            })
            .on('mouseout', function(d){
                d3.select(this).attr('r',marketScale(d.marketcap))
                let res = d3.select('.tooltip');
                res.style('opacity',0);
            })

            
        },




        
        function step5() {
            console.log('step 5')
            //appends new svg to another html element. 
            d3.selectAll('circle').style('opacity',0)
            d3.selectAll('.x-axis').style('opacity',0)
            d3.selectAll('item text').style('opacity',0)
            d3.selectAll('.tooltip').style('opacity',0)

            var margin = {top: 10, right: 10, bottom: 10, left: 10},
            width = 1000 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;
            let size= 1000;

            // // append the svg object to the body of the page
            // var svg = d3.select("#my_dataviz")
            // .append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            // .append("g")
            // .attr("transform",
            //     "translate(" + margin.left + "," + margin.top + ")")
            //graphicVisEl
            
            svg  = d3.selectAll('svg').append('svg')
            svg
            .append('svg')
			.attr('width', size + 2*margin.left)
            .attr('height', size + 2*margin.left)
            .attr('left', '100px')
            .attr('top','300px')
            .attr('margin-left', '50px')
            .attr('class','treemap')

            //edit the data in order to make it compatible with making treemap:
            let sample={"children":
            [{"name":"boss1",
            "children":[{"name":"mister_a","group":"A","value":28,"colname":"level3"},
            {"name":"mister_b","group":"A","value":19,"colname":"level3"},
            {"name":"mister_c","group":"C","value":18,"colname":"level3"},
            {"name":"mister_d","group":"C","value":19,"colname":"level3"}],
            "colname":"level2"},
            {"name":"boss2",
            "children":[{"name":"mister_e","group":"C","value":14,"colname":"level3"},
            {"name":"mister_f","group":"A","value":11,"colname":"level3"},
            {"name":"mister_g","group":"B","value":15,"colname":"level3"},
            {"name":"mister_h","group":"B","value":16,"colname":"level3"}],
            "colname":"level2"},
            {"name":"boss3",
            "children":[{"name":"mister_i","group":"B","value":10,"colname":"level3"},
            {"name":"mister_j","group":"A","value":13,"colname":"level3"},
            {"name":"mister_k","group":"A","value":13,"colname":"level3"},
            {"name":"mister_l","group":"D","value":25,"colname":"level3"},
            {"name":"mister_m","group":"D","value":16,"colname":"level3"},
            {"name":"mister_n","group":"D","value":28,"colname":"level3"}],
            "colname":"level2"}],"name":"CEO"};
            var treedata={"children":[]};
            for (let i=0;i<algos.length;i++){
                let children=[];
                for (let j=0;j<newdata.length;j++){
                    if (newdata[j].algo== algos[i]){
                        children.push({name: newdata[j].name, marketcap: newdata[j].marketcap});
                    }
                }
                let j= {name: algos[i], children: children};
                treedata['children'].push(j);
            }
            console.log('sample:',sample);
            console.log('treedata:',treedata);

            var root = d3.hierarchy(treedata).sum(function(d){ return d.marketcap}) // Here the size of each leave is given in the 'value' field in input data
            console.log('descendants',root.descendants());
            console.log(root.links());
            // Then d3.treemap computes the position of each element of the hierarchy
            d3.treemap()
                .size([width, height])
                .padding(2)
                (root)
            
            console.log('root', root);
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
                .style("fill", "slateblue")

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
            // d3.selectAll('rect').exit().remove()
            d3.selectAll('rect').style('opacity',0);
        },

        function step7()
        {
            
            // d3.selectAll('svg').exit().remove()
        }

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

		svg = graphicVisEl.append('svg')
			.attr('width', size + 2*margin)
            .attr('height', size + 2*margin)
            .attr('class','firstvis')
		
		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + margin + ',' + margin + ')')

		scaleX = d3.scaleLinear()


		console.log('newdata:',newdata)
        var lowestVal = d3.min(newdata, d=>d.year)
        var highestVal = d3.max(newdata, d=>d.year)
        console.log(lowestVal)
        // d3.min(data,d=>d.Income)

        var parseTime = d3.timeParse("%Y");
        console.log(chartSize)
		scaleX
			.domain([parseTime(lowestVal), parseTime(highestVal)])
            .range([margin, size-margin]);

        var scaleSize = chartSize/2 + margin

        
        
        console.log(scaleX)
        xAxis = d3.axisBottom().scale(scaleX).tickFormat(d3.timeFormat("%Y"));
        //add x-axis to group xg:
        var xg = svg.append("g")
        .call(xAxis)
        .attr("class", "x-axis")
        .attr("transform", "translate(" + margin + "," + scaleSize + ")")

        console.log(scaleX(2012))

		var item = chart.selectAll('.item')
			.data(newdata)
			.enter().append('g')
				.classed('item', true)
				.attr('transform', translate(chartSize / 2, chartSize / 2))
		
		item.append('circle')
			.attr('cx', 0)
			.attr('cy', 0)

		item.append('text')
			.text(function(d) { 
                if (d == "Coins")
                    return d
                return d.Abbreviation })
			.attr('y', 1)
			.style('opacity', 0)
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
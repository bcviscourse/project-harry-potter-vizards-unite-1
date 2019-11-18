//next:
//next vis (almost done, depends on if we want zooming)
//add transition to next vis.
//dynamic data vis?

window.createGraphic = function(graphicSelector, newdata){
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

	var margin = 20
	var size = 1200
	var chartSize = size - margin * 2
	var scaleX = null
	var scaleR = null
    newdata = newdata.concat( ["Coins"] );
    var numberData = [8, 6, 7, 5, 3, 0, 9, 4, 5, 6, 7, 8, 5, 4]
    console.log(newdata)
    // console.log(withCoins)
	// var extent = d3.extent(data) // WE WILL HAVE TO COME BACK TO THIS
	var minR = 25
    var maxR = 200
    var xAxis = null
    var svg
    var marketScale = d3.scaleLinear()
    .domain(d3.extent(newdata,function(d){return d.marketcap;}) )
    .range([15,35]);
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
            console.log('step  0');
            // circles are centered and small
			var t = d3.transition()
                .duration(400)
				.ease(d3.easeQuadInOut)
			
            var item = graphicVisEl.selectAll('.item')
            
            var axis = graphicVisEl.selectAll('.x-axis')
            
            var scaleSize = (chartSize/2 + margin)

            axis
            .transition(t)
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + margin + "," + scaleSize + ")")
            .style("opacity", 0)

			item.transition(t)
                .attr('transform', function(d){
                        return translate(chartSize / 2, chartSize / 2)
                })
            

            item.select('circle')
                .style('fill','pink')
                .attr('class','balloon')
				.transition(t)
                .attr('r', function(d)
                {
                    if (d=="Coins")
                        return maxR
                    return minR
                })
                .style('opacity', function(d)
                {
                    if (d == "Coins")
                        return 1;
                    return 0;
                })

			item.select('text')
				.transition(t)
                .style('opacity', function(d)
                {
                    if (d == "Coins")
                        return 1;
                    return 0;
                })

            d3.selectAll('.item text').remove()
            var circleText = d3.selectAll(".item").append("text")
                .attr("class", "circleText")	
                .style('opacity',0)		
                .style('fill','white')
                .html("Coins")
                .style('opacity',1)
		},



		function step1() {
            console.log('step  1');

            let res = d3.select('.tooltip');
            res.style('opacity',0);

			var t = d3.transition()
				.duration(600)
                .ease(d3.easeQuadInOut)
                	
			// circles are positioned
            var item = graphicVisEl.selectAll('.item')
            
            var axis = graphicVisEl.selectAll('.x-axis')
            axis
            .transition(t)
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + margin + "," + scaleSize + ")")
            .style("opacity", 1)
            
            var parseTime = d3.timeParse("%Y");
			item.transition(t)
				.attr('transform', function(d, i) {
                    if (d == "Coins")
                    {
                        return translate(chartSize/2, chartSize/2 - margin)
                    }
					return translate(scaleX(parseTime(d.year)), chartSize / 2 -margin - 10*i)
				})

            item.select('circle')
                .attr('class','')
                .style('fill', 'pink')
				.transition(t)
                .attr('r', function(d)
                {
                    if (d!="Coins")
                    {
                        return minR
                    }
                    return 0
                })
                .style('opacity', function(d)
                {
                    if (d == "Coins")
                        return 0;
                    return 1;
                });


                // Define the circletext:

            
            var circleText = d3.selectAll(".item").append("text")
                .attr("class", "circleText")	
                .style('opacity',0)		
                .style('fill','white')
                .html(function(d){return d.symbol;})
                .style('opacity',1)

            circleText.exit()
                        

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

            var algos=[];
            for (let i=0;i<newdata.length;i++){
                if (!algos.includes(newdata[i].algo)) algos.push(newdata[i].algo);
            }
            console.log(algos);
            var colorScale = d3.scaleOrdinal(d3.schemeAccent) 
                .domain(algos)
            console.log('testing color scale:', colorScale('Scrypt'))
                // .range();
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
            // .delay(50)
            .attr('r', function(d, i) {
                return minR;
            })
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


            var algos=[];
            for (let i=0;i<newdata.length;i++){
                if (!algos.includes(newdata[i].algo)) algos.push(newdata[i].algo);
            }
            console.log(algos);
            var colorScale = d3.scaleOrdinal(d3.schemeAccent) 
                .domain(algos)

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

            d3.selectAll('rect').style('opacity',0);

            d3.selectAll('circle').style('opacity',1)
            d3.selectAll('.x-axis').style('opacity',1)
            d3.selectAll('item text').style('opacity',1)
            // d3.selectAll('.tooltip').style('opacity',1)
            
            svg  = d3.selectAll('svg')
        
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
            var algos=[];
            for (let i=0;i<newdata.length;i++){
                if (!algos.includes(newdata[i].algo)) algos.push(newdata[i].algo);
            }
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

		scaleR = d3.scaleLinear()
		scaleX = d3.scaleLinear()


		console.log(d3.max(numberData))
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
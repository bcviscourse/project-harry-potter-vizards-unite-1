//next:
//add transition to next vis.
//next vis.

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
                // d3.selectAll('.tooltip').remove();
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
            .on('mouseout', function(){
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
            d3.selectAll('.circleText').style('opacity',0);

            var marketScale = d3.scaleLinear()
                .domain(d3.extent(newdata,function(d){return d.marketcap;}) )
                .range([10,30]);
        
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
        
            var t = d3.transition()
				.ease(d3.easeLinear)

			// circles are sized
			var item = graphicVisEl.selectAll('.item')
			
			item.select('circle')
				.transition(t)
                .style('fill','pink')
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
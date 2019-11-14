// Promise.all([ 
//     d3.csv('data/mining_algorithms.csv')   
// ]).then(data=>{ 
//     let miningData = data
//     window.miningData = min
//     console.log(miningData);
// })


// function getData()
// {
//     let dataset = []
//     d3.csv('data/mining_algorithms.csv', function(data){
//         console.log(data)
//         dataset.push(data)
//         console.log(dataset.size)
//     })
//     console.log(dataset)
//     return dataset

// }

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
		},

		function step1() {
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
			
			item.transition(t)
				.attr('transform', function(d, i) {
                    if (d == "Coins")
                    {
                        return translate(chartSize/2, chartSize/2 - margin)
                    }
					return translate(scaleX(d.Year), chartSize / 2 -margin - 10*i)
				})

			item.select('circle')
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
			var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)

			// circles are sized
			var item = graphicVisEl.selectAll('.item')
			
			item.select('circle')
				.transition(t)
				.delay(function(d, i) { return i * 200 })
				.attr('r', function(d, i) {
					return minR
				})

			item.select('text')
				.transition(t)
				.delay(function(d, i) { return i * 100 })
                .style('opacity', function(d)
                {
                    if (d=="Coins")
                        return 0
                    return 1
                })
            
                
            var scaleSize = (chartSize/2 + margin)

            var axis = graphicVisEl.selectAll('.x-axis')
            axis
            .transition(t)
            .call(xAxis)
            .attr("class", "x-axis")
            .attr("transform", "translate(" + margin + "," + scaleSize + ")")
            .style("opacity", 1)
		},
	]

	// update our chart
	function update(step) {
		steps[step].call()
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
		console.log(newdata)
        var lowestVal = d3.min(newdata, d=>d.Year)
        var highestVal = d3.max(newdata, d=>d.Year)
        console.log(lowestVal)
        // d3.min(data,d=>d.Income)

        console.log(chartSize)
		scaleX
			.domain([lowestVal, highestVal])
            .range([margin, size-margin]);
			// .padding(1)

		// scaleR
		// 	.domain(extent)
        //     .range([minR, maxR])

        var scaleSize = chartSize/2 + margin
        
        console.log(scaleX)
        xAxis = d3.axisBottom().scale(scaleX);
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


// fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
// // method: "GET",   
// headers: {
//       'Content-Type': 'application/json',
//      'X-CMC_PRO_API_KEY': '8156fd5c-1e27-4c73-8393-fef3b616fe8d', // put API key
//    },
//    // initialize parameters
//    qs: {
//     'start': '1',
//     'limit': '500',
//     'convert': 'USD'
//   },
//   json: true
   
// })
// .then(resp=>resp.json())
// .then(d=>{
//   num = d.data.total_cryptocurrencies
//   console.log(num);
//   // document.write(num);
//   return d.data.total_cryptocurrencies;
// })

var start_val = 0,
    duration = 1000,
    end_val = [4500];

var qSVG = d3.select("dynamic__text").append("svg").attr("width", 200).attr("height", 200);

qSVG.selectAll(".text")
    .data(end_val)
    .enter()
    .append("text")
      .text(start_val)
      .attr("class", "txt")
      .attr("x", 10)
      .attr("y", function(d, i) {
          return 50 + i * 30
      })
    .transition()
    .duration(3000)
    .tween("text", function(d) {
        var i = d3.interpolate(this.textContent, d),
            prec = (d + "").split("."),
            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

        return function(t) {
            this.textContent = Math.round(i(t) * round) / round;
        };
    });
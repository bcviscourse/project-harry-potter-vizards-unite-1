export default function moveText() {
    fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
        // method: "GET",   
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': '8156fd5c-1e27-4c73-8393-fef3b616fe8d', // put API key
        },
        // initialize parameters
        qs: {
            'start': '1',
            'limit': '500',
            'convert': 'USD'
        },
        json: true

    })
        .then(resp => resp.json())
        .then(d => {
            var num_cryptos = d.data.total_cryptocurrencies;
            var start_val = 0;
            var duration = 1000;
            console.log(num_cryptos)
            var end_val = [num_cryptos];

            var qSVG = d3.select(".moving_text").append("svg").attr("width", 150).attr("height", 100);
            console.log(d3.selectAll(".moving_text"))
            qSVG.selectAll(".text")
                .data(end_val)
                .enter()
                .append("text")
                .text(start_val)
                .classed("fast", true)
                .attr("x", 30)
                .attr("y", function (d, i) {
                    return 50 + i * 30
                })
                .transition()
                .duration(3000)
                .tween("text", function (d) {
                    var i = d3.interpolate(this.textContent, d),
                        prec = (d + "").split("."),
                        round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;

                    return function (t) {
                        this.textContent = Math.round(i(t) * round) / round;
                    };
                })
        })
}
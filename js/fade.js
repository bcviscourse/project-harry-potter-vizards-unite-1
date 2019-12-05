

$(window).on("scroll", function () {
    //How far you've scrolled
    //aka # of pixels down the doc. the top of the browser is
    //Starts at 0
    var pageTop = $(document).scrollTop()

    //# of pixels down that the bottom of the browser is at
    var pageBottom = pageTop + $(window).height()

    //Threshold for sections coming into view.
    var visibleThreshold = pageBottom - $(window).height() * 0.1

    var tags = $("intro_section")
    //Independently check each section
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]

        var sectionHeight = $(tag.getBoundingClientRect().height)[0];
        var sectionBottom = $(tag).position().top + sectionHeight;
        // console.log("Top tag position")
        // console.log($(tag).position().top)

        //Checks to see whether the text has entered the frame of view
        //From the bottom
        var topOnPage =
            //Above bottom
            ($(tag).position().top < visibleThreshold)
            //Below top
            && ($(tag).position().top > pageTop + 50)

        //Checks to see whether the text is still in view
        //From the top
        var bottomOnPage = false
        //Above bottom
        // (sectionBottom < visibleThreshold)
        // //Below top
        // && (sectionBottom > pageTop + 50)

        var textInView = topOnPage || bottomOnPage;
        if (textInView) {
            if (tag.id == "scrolling-text" && !tag.classList.contains("visible")) {
                moveText()
                // console.log("HEYYYY" + tag.classList)
            }
            // console.log("HEYYYY" + tag.classList)
            $(tag).addClass("visible")
            // console.log("Top tag position")
            // console.log($(tag).position().top)
            // console.log("Section height")
            // console.log(sectionHeight)
            // console.log("Section bottom")
            // console.log(sectionBottom)
            // console.log("Page Top")
            // console.log(pageTop)
        } else {
            $(tag).removeClass("visible")
        }

        // //If the top of the text peeks over the bottom of the screen
        // Oh dear this is a disaster
        // if (
        //     ($(tag).position().top < visibleThreshold)
        // //OR the bottom of the text is still on the screen
        //     || ($(tag).position().top + $(tag).clientHeight < visibleThreshold - 100)
        //     && 
        // //AND 
        //     ($(tag).position().top > pageTop + 100)
        // ) {
        //     $(tag).addClass("visible")
        // } else {
        //     $(tag).removeClass("visible")
        // }
    }

    function moveText() {
        var num_cryptos = 4290
        fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
            // method: "GET",   
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': 'dfa9b33b-6834-4d0b-8993-020e1bf5a26b', // put API key
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
                if (d3.selectAll(".moving_text").selectAll("svg").nodes().length>0)
                {
                    d3.selectAll(".moving_text").selectAll("svg").remove()
                }
                var qSVG = d3.select(".moving_text").append("svg").attr("width", 150).attr("height", 60);
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
                    .duration(5000)
                    .tween("text", function (d) {
                        var i = d3.interpolate(this.textContent, d),
                            prec = (d + "").split("."),
                            round = (prec.length > 1) ? Math.pow(10, prec[1].length) : 1;
    
                        return function (t) {
                            this.textContent = Math.round(i(t) * round) / round;
                        };
                    })
            })
            .catch(function(){
                console.log("FUNCTION FAILED")
                var num_cryptos = 4890; // EXCEPTION AT TIME OF CREATING PROJECT
                var start_val = 0;
                var duration = 1000;
                console.log(num_cryptos)
                var end_val = [num_cryptos];
                if (d3.selectAll(".moving_text").selectAll("svg").nodes().length>0)
                {
                    d3.selectAll(".moving_text").selectAll("svg").remove()
                }
                var qSVG = d3.select(".moving_text").append("svg").attr("width", 150).attr("height", 60);
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
                    .duration(5000)
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
}

)

// $(document).ready(function() {
//     $(window).scroll(function(event) {
//         let scroll = $(this).scrollTop();
//         let opacity = 1 - (scroll / 200);
//         if (opacity >= 0) {
//             $('.trigger').css('opacity', opacity);
//         }
//         else {
//             $('.trigger').css('opacity', 0);

//         }
//     });
// });
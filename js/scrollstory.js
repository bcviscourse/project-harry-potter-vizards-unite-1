import createGraphic from './main.js';
// import moveText from './dynamic_num.js'

function scrollstory() {
    var num_cryptos = 0
    // fetch('https://cors-anywhere.herokuapp.com/https://pro-api.coinmarketcap.com/v1/global-metrics/quotes/latest', {
    //     // method: "GET",   
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'X-CMC_PRO_API_KEY': '8156fd5c-1e27-4c73-8393-fef3b616fe8d', // put API key
    //     },
    //     // initialize parameters
    //     qs: {
    //         'start': '1',
    //         'limit': '500',
    //         'convert': 'USD'
    //     },
    //     json: true

    // })
    //     .then(resp => resp.json())
    //     .then(d => {
    //         num_cryptos = d.data.total_cryptocurrencies;
    //         console.log(num_cryptos)
    //     })

    Promise.all([
        d3.csv('data/final.csv'),
        d3.csv('data/total-market-cap.csv'),
        d3.json('data/treedata_first-level.json'),
        d3.json('data/treedata_second-level.json'),
        d3.json('data/treedata_third-level.json')
    ]).then(data => {
        let miningData = data[0]
        let market_cap_time_data = data[1]
        let treemap_first_level = data[2]
        let treemap_second_level = data[3]
        let treemap_third_level = data[4]
        // console.log(market_cap_time_data);
        var TOTDATA = [];
        let i = 0;
        //formatting the data:
        let count = 0;
        for (i = 0; i < 25; i++) {
                TOTDATA[count] = {
                    name: miningData[i].name,
                    symbol: miningData[i].symbol,
                    algo: miningData[i].algo,
                    year: +miningData[i].year,
                    marketcap: +miningData[i].marketcap,
                    // circulatingsupply: + miningData[i].circulatingsupply,
                    // price: +miningData[i].price
                };
                // alert(TOTDATA[count])
                count++;
        }
        // miningData.filter(entry => entry.year != 0 && entry.year != "");
        // let smallMine = miningData.slice(1, 20)
        setScrollStory(TOTDATA, market_cap_time_data, treemap_first_level, treemap_second_level, treemap_third_level)
        // moveText()
    })

    function setScrollStory(data, time_data, tm_firstlevel, tm_secondlevel, tm_thirdlevel) {
        // select elements using jQuery since it is a dependency
        var $graphicEl = $('.graphic')
        var $graphicVisEl = $graphicEl.find('.graphic__vis')
        // console.log($graphicVisEl)
        // console.log(window.innerHeight)

        // viewport height
        var viewportHeight = window.innerHeight
        var halfViewportHeight = Math.floor(viewportHeight / 2)
        var svgHeight = 9 * Math.floor(viewportHeight / 10)
        // console.log(viewportHeight)

        // a global function creates and handles all the vis + updates
        // console.log(data)
        var graphic = createGraphic(data, time_data, tm_firstlevel, tm_secondlevel, tm_thirdlevel, svgHeight, window.innerWidth)

        // handle the fixed/static position of grahpic
        var toggle = function (fixed, bottom) {
            if (fixed) $graphicVisEl.addClass('is-fixed')
            else $graphicVisEl.removeClass('is-fixed')

            if (bottom) $graphicVisEl.addClass('is-bottom')
            else $graphicVisEl.removeClass('is-bottom')
        }

        // callback function when scrollStory detects item to trigger
        var handleItemFocus = function (event, item) {
            var step = item.data.step
            graphic.update(step)
            console.log('STEP:', step)
        }

        // callback on scrollStory scroll event
        // toggle fixed position
        var handleContainerScroll = function (event) {
            var bottom = false
            var fixed = false

            var bb = $graphicEl[0].getBoundingClientRect()
            var bottomFromTop = bb.bottom - viewportHeight

            if (bb.top < 0 && bottomFromTop > 0) {
                bottom = false
                fixed = true
            } else if (bb.top < 0 && bottomFromTop < 0) {
                bottom = true
                fixed = false
            }

            toggle(fixed, bottom)
        }

        // instantiate scrollStory
        $graphicEl.scrollStory({
            contentSelector: '.trigger',
            triggerOffset: halfViewportHeight,
            // scrollOffset: 200,
            // speed: 100,
            scrollSensitivity: 1,
            throttleType: 'throttle',
            itemfocus: handleItemFocus,
            containerscroll: handleContainerScroll,
            autoActivateFirstItem: false
        })
    }
}

console.log("RUN")
scrollstory()

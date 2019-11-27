function scrollstory() {
    Promise.all([
        d3.csv('data/out.csv'),
        d3.csv('data/total-market-cap.csv')
    ]).then(data => {
        let miningData = data[0]
        let market_cap_time_data = data[1]
        console.log(market_cap_time_data);
        var TOTDATA =[];
        let i=0;
        //formatting the data:
        let count=0;
        for (i=0;i<miningData.length;i++){
            if (miningData[i].name2 !='' ){
                TOTDATA[count] = {name: miningData[i].name,
                                symbol: miningData[i].symbol,
                                algo: miningData[i].algo,
                                year: +miningData[i].year,
                                marketcap: +miningData[i].marketcap,
                                circulatingsupply: + miningData[i].circulatingsupply,
                                price: +miningData[i].price};
                count++;
            }
        }
        // miningData.filter(entry => entry.year != 0 && entry.year != "");
        // let smallMine = miningData.slice(1, 20)
        setScrollStory(TOTDATA, market_cap_time_data)
    })

    function setScrollStory(data, time_data) {
        // select elements using jQuery since it is a dependency
        var $graphicEl = $('.graphic')
        var $graphicVisEl = $graphicEl.find('.graphic__vis')
        console.log($graphicVisEl)
        console.log(window.innerHeight)

        // viewport height
        var viewportHeight = window.innerHeight
        var halfViewportHeight = Math.floor(viewportHeight / 2)
        var svgHeight = 9*Math.floor(viewportHeight / 10)
        console.log(viewportHeight)

        // a global function creates and handles all the vis + updates
        console.log(data)
        var graphic = createGraphic('.graphic', data, time_data, svgHeight, window.innerWidth)

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
            console.log('STEP:',step)
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
            scrollSensitivity: 10,
            throttleType: 'throttle',
            itemfocus: handleItemFocus,
            containerscroll: handleContainerScroll,
            autoActivateFirstItem: true
        })
    }
}

scrollstory()
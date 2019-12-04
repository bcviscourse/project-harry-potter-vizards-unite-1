

$(window).on("scroll", function () {
    //How far you've scrolled
    //aka # of pixels down the doc. the top of the browser is
    //Starts at 0
    var pageTop = $(document).scrollTop()

    //# of pixels down that the bottom of the browser is at
    var pageBottom = pageTop + $(window).height()

    //Threshold for sections coming into view.
    var visibleThreshold = pageBottom - $(window).height() * 0.1
    
    var tags = $("section")
    //Independently check each section
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]

        var sectionHeight = $(tag.getBoundingClientRect().height)[0];
        var sectionBottom = $(tag).position().top + sectionHeight;
        console.log("Top tag position")
        console.log($(tag).position().top)

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
            $(tag).addClass("visible")
            console.log("Top tag position")
            console.log($(tag).position().top)
            console.log("Section height")
            console.log(sectionHeight)
            console.log("Section bottom")
            console.log(sectionBottom)
            console.log("Page Top")
            console.log(pageTop)
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
})

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
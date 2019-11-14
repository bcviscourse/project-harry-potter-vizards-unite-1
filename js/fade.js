

$(window).on("scroll", function () {
    //How far you've scrolled
    //aka # of pixels down the doc. the top of the browser is
    //Starts at 0
    var pageTop = $(document).scrollTop()

    //# of pixels down that the bottom of the browser is at
    var pageBottom = pageTop + $(window).height()

    //Threshold for sections coming into view.
    var visibleThreshold = pageBottom - $(window).height() * 1.25
    
    var tags = $("section")
    //Independently check each section
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]
    
        if ($(tag).position().top < visibleThreshold
            && $(tag).position().top > visibleThreshold - 400
        ) {
            $(tag).addClass("visible")
        } else {
            $(tag).removeClass("visible")
        }
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
$(document).ready(function() {
    const showrealSlider = $('.showreal__slider').lightSlider({
        item:3,
        slideMargin:20,
        loop:false,
        pager: false,
        enableDrag: false,
        onSliderLoad: function(el) {
            el.removeClass('cS-hidden');
            const arrows = el.parents('.lSSlideWrapper').find('.lSAction').detach();
            el.parents('.lSSlideOuter').append(arrows)
        },
        responsive : [
            {
                breakpoint:800,
                settings: {
                    item:2,
                  }
            },
            {
                breakpoint:480,
                settings: {
                    item:1,
                    slideMargin:0,
                    enableDrag: true,
                  }
            }
        ]
    });
});
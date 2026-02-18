$(function (){
    if($('[data-swiper-slider]').length){
        $('[data-swiper-slider]').each(function (index){
            let slider = $(this),
                sliderOptions = slider.data('swiper-slider') ?? {},
                sliderParams = slider.data('swiper-slider-params') ?? {};
            if(slider.hasClass('is-init')) return false;
            const sliderClass = 'swiper-slider-'+(index+1);
            slider.addClass(sliderClass);
            console.log('sliderParams', sliderParams);

            let defaultOptions = {
                slidesPerView: 1,
                spaceBetween: 0,
                direction: 'horizontal',
                loop: false,
                simulateTouch: false
            };

            if(
                (sliderParams?.is_mobile == 'N' && sliderParams?.is_show_navigation == 'Y')
                    ||
                (sliderParams?.is_mobile == 'Y' && sliderParams?.is_show_navigation_mobile == 'Y')
            ){
                defaultOptions.navigation = {
                    nextEl: "[data-swiper-slider-next]",
                    prevEl: "[data-swiper-slider-prev]",
                    disabledClass: 'disabled_swiper_button'
                };
            }

            if(
                (sliderParams?.is_mobile == 'N' && sliderParams?.is_show_pager == 'Y')
                ||
                (sliderParams?.is_mobile == 'Y' && sliderParams?.is_show_pager_mobile == 'Y')
            ){
                defaultOptions.pagination = {
                    el: '[data-swiper-slider-pagination]',
                    clickable: true,
                };
            }

            if(
                (sliderParams?.is_mobile == 'N' && sliderParams?.is_show_scrollbar == 'Y')
                ||
                (sliderParams?.is_mobile == 'Y' && sliderParams?.is_show_scrollbar_mobile == 'Y')
            ){
                defaultOptions.scrollbar = {
                    el: '[data-swiper-slider-scrollbar]',
                };
            }

            let params = $.extend(true, defaultOptions, sliderOptions);

            slider.data('swiper', new Swiper('.'+sliderClass, params));
        });
    }
});
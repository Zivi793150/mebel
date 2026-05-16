$(function (){
    if($('[data-slider]').length){
        $('[data-slider]').each(function (){
            let slider = $(this);
            if(slider.hasClass('is-init')) return false;

            let sliderWrapper = slider.parents('[data-slider-wrapper]'),
                prevSliderArrow = sliderWrapper.find('[data-slider-prev]'),
                nextSliderArrow = sliderWrapper.find('[data-slider-next]');

            let params = $.extend(true, {
                enableTouch: false,
                enableDrag: false,
                pager: false,
                loop:false,
                slideMargin: 0,
                isResizeRefresh: false,
            }, slider.data('slider'));

            let isInfinitySliding = !!params.loop;

            params.onSliderLoad = function (el)
            {
                checkSliderArrowVisibility(el, sliderWrapper, prevSliderArrow, nextSliderArrow, isInfinitySliding);

                if(prevSliderArrow.length){
                    prevSliderArrow.on('click', function (e) {
                        e.preventDefault();

                        if($(this).hasClass('is-control-sliding')) return false;

                        $(this).addClass('is-control-sliding');

                        el.goToPrevSlide();
                    });
                }

                if(nextSliderArrow.length) {
                    nextSliderArrow.on('click', function (e) {
                        e.preventDefault();

                        if($(this).hasClass('is-control-sliding')) return false;

                        $(this).addClass('is-control-sliding');

                        el.goToNextSlide();
                    })
                }

                sliderWrapper.removeClass('is-not-init').addClass('is-init');
            };
            params.onAfterSlide = function (el, scene)
            {
                if(!params.loop){
                    checkSliderArrowVisibility(el, sliderWrapper, prevSliderArrow, nextSliderArrow, isInfinitySliding, scene);
                }
                prevSliderArrow.removeClass('is-control-sliding');
                nextSliderArrow.removeClass('is-control-sliding');
            };

            /*if(!params.loop){
                params.onBeforePrevSlide = function (el, scene){
                    console.log('onBeforePrevSlide scene', scene);
                    console.log('getTotalSlideCount', el.getTotalSlideCount());
                    if(scene > 0){
                        el.removeClass('sliderLeftEnd');
                    }else{
                        el.addClass('sliderLeftEnd');
                    }

                }
                params.onBeforeNextSlide = function (el, scene){
                    console.log('onBeforeNextSlide scene', scene);
                    console.log('getTotalSlideCount', el.getTotalSlideCount());
                    if(scene > 0){
                        el.removeClass('sliderRightEnd');
                    }else{
                        el.addClass('sliderRightEnd');
                    }
                }
            }*/

            slider.lightSlider(params);
        });
    }

    function checkSliderArrowVisibility(sliderObj, sliderWrapper, prevSliderArrow, nextSliderArrow, isInfinitySliding, scene = 0){
        let countSlides = sliderObj.getTotalSlideCount();

        if(countSlides == 1){
            prevSliderArrow.addClass('is-disabled');
            sliderWrapper.addClass('is-prev-arrow-disabled');
            nextSliderArrow.addClass('is-disabled');
            sliderWrapper.addClass('is-next-arrow-disabled');
        }

        if(!!isInfinitySliding) return false;

        // console.log(sliderObj.attr('class'), 'countSlides', countSlides, scene, prevSliderArrow, nextSliderArrow);

        if(!!prevSliderArrow && prevSliderArrow.length){
            if(scene == 0){
                prevSliderArrow.addClass('is-disabled');
                sliderWrapper.addClass('is-prev-arrow-disabled');
            }else{
                prevSliderArrow.removeClass('is-disabled');
                sliderWrapper.removeClass('is-prev-arrow-disabled');
            }
        }
        if(!!nextSliderArrow && nextSliderArrow.length){
            if(scene == (countSlides - 1)){
                nextSliderArrow.addClass('is-disabled');
                sliderWrapper.addClass('is-next-arrow-disabled');
            }else{
                nextSliderArrow.removeClass('is-disabled');
                sliderWrapper.removeClass('is-next-arrow-disabled');
            }
        }
    }
});
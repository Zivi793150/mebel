function InitHoverPreviewSliderCard(elements){
    console.log('Pre InitHoverPreviewSliderCard');
    for (element of elements) {
		element.images = element?.images && Array.isArray(element.images) ? element.images.filter(image => !!image?.SRC) : [];
		console.log('iter InitHoverPreviewSliderCard');
        if (!element?.images.length) {
            console.log('Null InitHoverPreviewSliderCard');
            continue;
        }
        let elementBlock = $('#' + element.strMainID);
        let imageWrapper = $(".image_wrapper_block", elementBlock);
        let sliderBlock = $(".image_slider_block", elementBlock);
        let existImages = 1;
        let loaded = false;
        $('img', sliderBlock).wrap('<div class="image-list__link"><div class="section-gallery-wrapper"><span class="section-gallery-wrapper__item active"></span></div></div>');
        $('.section-gallery-wrapper .section-gallery-wrapper__item.active', sliderBlock).prepend('<span class="section-gallery-wrapper__item-nav"></span>');
        $('.section-gallery-wrapper', sliderBlock).append(element.images.map(image => {
            return `<span class="section-gallery-wrapper__item"><span class="section-gallery-wrapper__item-nav"></span><img src="${image.SRC}" /></span>`;
        }));
        imageWrapper.after('<div class="section-gallery-nav"><div class="section-gallery-nav__wrapper"><span class="section-gallery-nav__item bg-theme-hover active"></span></div></div>');
        $('.section-gallery-nav__wrapper', elementBlock).append(element.images.map((image, index) => {
            //let activeClass = index === 0 ? ' active' : '';
            let activeClass = '';
           return `<span class="section-gallery-nav__item bg-theme-hover${activeClass}"></span>`;
        }));
	}

    console.log('InitHoverPreviewSliderCard');

    $(document).on("mouseenter", ".section-gallery-wrapper .section-gallery-wrapper__item", function() {
        const _this = $(this)
          , index = _this.index()
          , $nav_items = _this.closest(".inner_wrap").find(".section-gallery-nav .section-gallery-nav__item");
        _this.siblings().removeClass("active"),
        _this.addClass("active"),
        $nav_items.removeClass("active"),
        $nav_items.filter(":eq(" + index + ")").addClass("active")
    });
    $(document).on("mouseleave", ".section-gallery-wrapper", function() {
        const _this = $(this)
          , $elements = $(this).find(".section-gallery-wrapper__item")
          , $nav_items = _this.closest(".inner_wrap").find(".section-gallery-nav .section-gallery-nav__item");
        $elements.length && ($elements.removeClass("active"),
        $($elements[0]).addClass("active"),
        $nav_items.removeClass("active"),
        $($nav_items[0]).addClass("active"))
    });

    $(document).on("click", ".section-gallery-nav .section-gallery-nav__item", function() {
        const _this = $(this)
          , index = _this.index()
          , items = _this.closest(".inner_wrap").find(".section-gallery-wrapper .section-gallery-wrapper__item");
        _this.siblings().removeClass("active"),
        _this.addClass("active"),
        items.removeClass("active"),
        items.filter(":eq(" + index + ")").addClass("active")
    });
}
function initCatalogSectionSliders(elements) {
	for (element of elements) {
		initCatalogSectionElementSlider(element);
	}
}
function initCatalogSectionElementSlider(element) {
	element.images = element?.images && Array.isArray(element.images) ? element.images.filter(image => !!image?.SRC) : []
	if (!element?.images.length) {
		return false;
	}
	var $elementBlock = $('#' + element.strMainID);
	var $sliderBlock = $(".image_slider_block", $elementBlock);
	var existImages = 1;
	var loaded = false;
	$('img', $sliderBlock).wrap('<ul><li></li></ul>');
	$('ul', $sliderBlock).append(element.images.map(image => {
		return `<li><img data-src="${image.SRC}" /></li>`;
	}));
	$('ul', $sliderBlock).lightSlider({
		item: 1,
		slideMove: 1,
		slideMargin: 0,
		enableTouch: true,
		enableDrag: true,
		controls: false,
		onMove: function($el) {
			var $slide = $('li', $el).eq(($el.getCurrentSlideCount()));
			var $img = $('img', $slide);
			if(!$img.attr('src')){
			    $img.attr('src', $img.attr('data-src'));
			}
		},
		onAfterSlide: function($el) {},
		onBeforeSlide: function ($el) {
			var $slide = $('li', $el).eq(($el.getCurrentSlideCount() - 1));
			var $img = $('img', $slide);
			if(!$img.attr('src')){
			    console.log('data-src', $img.attr('data-src'));
                $img.attr('src', $img.attr('data-src'));
            }
		},
	});
}
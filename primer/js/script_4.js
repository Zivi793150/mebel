$(function() {
	// $('body').on('change', '.b-web-form input[type="text"], .js--form_ajax textarea', function (event){
	// 	console.log($(this));
	// 	if(!$(this).val()){
	// 		$(this).removeClass('is-filled');
	// 	}else{
	// 		$(this).addClass('is-filled');
	// 	}
	// });

	$('body').on('click', '[data-big-menu-switcher]', function (event){
		console.log($(this));
		if(!$(this).parents('.header').find('[data-big-menu]').hasClass('is-active')){
			$('body').addClass('is-open-big-menu');
			$(this).addClass('is-active');
			$(this).parents('.header').find('[data-big-menu]').addClass('is-active');
		}else{
			$('body').removeClass('is-open-big-menu');
			$(this).removeClass('is-active');
			$(this).parents('.header').find('[data-big-menu]').removeClass('is-active');
		}

		const $html = $('html');
		if ($html.is('.overflow')) {
			$html.removeClass('overflow');
			$html.css('--scrollbar-width', '');
		} else {
			$html.addClass('overflow');
			$html.css('--scrollbar-width', `${getScrollbarWidth()}px`);
		}
	});

	$('body').on('click', '[data-mobile-menu-switcher]', function (event){
		if(!$(this).parents('.mobile-header').find('[data-mobile-menu]').hasClass('is-active')){
			$('body').addClass('is-open-mobile-menu');
			$(this).addClass('is-active');
			$(this).parents('.mobile-header').find('[data-mobile-menu]').addClass('is-active');
		}else{
			$('body').removeClass('is-open-mobile-menu');
			$(this).removeClass('is-active');
			$(this).parents('.mobile-header').find('[data-mobile-menu]').removeClass('is-active');
		}
	});
});



function checkVisibleScrollOnObject(ob, customParams = {}){
	let params = $.extend({
		minHeightForStick: 50,
		startOffset: 0,
		endOffset: 0,
	}, customParams);
	let obHeight = 0
	setObHeight();
	checkVisibleScroll();
	
	

	$(window).scroll(function() {
		checkVisibleScroll($(this));
	});

	$(window).resize(function() {
		setObHeight();
	});

	function setObHeight(){
		obHeight = ob.height();
	}

	function checkVisibleScroll(_window = null){
		if(!_window) _window = $(window);
		let startOffsetTop = ob.offset().top + params.startOffset;
		//console.log('startOffsetTop', startOffsetTop);
		let endOffsetTop = startOffsetTop + obHeight + params.endOffset;
		if(params && params?.hasOwnProperty('offsetObject') && params.offsetObject.length){
			let offsetObjectHeight = params.offsetObject.height();
			let delta = obHeight - offsetObjectHeight;
			
			console.log('obHeight', obHeight);
			console.log('offsetObjectHeight', offsetObjectHeight);
			console.log('delta', delta);
			console.log('params.minHeightForStick', params.minHeightForStick);
			
			if(delta < params.minHeightForStick){
				return false;
			}
			endOffsetTop -= offsetObjectHeight;
		}
		// console.log({scrollTop: _window.scrollTop(), obHeight, startOffsetTop, endOffsetTop, offsetObjectHeight: params.offsetObject.height()});
		if(_window.scrollTop() > startOffsetTop && _window.scrollTop() < endOffsetTop) {
			ob.addClass('is-sticked');
			ob.removeClass('is-sticked_end');
		} else {
			ob.removeClass('is-sticked');

			if(_window.scrollTop() > endOffsetTop) {
				ob.addClass('is-sticked_end');
			}else {
				ob.removeClass('is-sticked_end');
			}
		}
		
		
	}
}

/*
function checkVisibleScrollOnObject(ob, customParams = {}) {
    let params = $.extend({
        minHeightForStick: 50,
        startOffset: 0,
        endOffset: 0,
    }, customParams);

    let obHeight = 0;
    setObHeight();
    checkVisibleScroll();

    $(window).scroll(function() {
        checkVisibleScroll($(this));
    });

    $(window).resize(function() {
        setObHeight();
    });

    function setObHeight() {
        obHeight = ob.height();
    }

    function checkVisibleScroll(_window = null) {
        if (!_window) _window = $(window);
        let startOffsetTop = ob.offset().top + params.startOffset;
        let endOffsetTop = startOffsetTop + obHeight + params.endOffset;

        if (params.hasOwnProperty('offsetObject') && params.offsetObject.length) {
            let offsetObjectHeight = params.offsetObject.height();
            let delta = obHeight - offsetObjectHeight;
            if (delta < params.minHeightForStick) {
                return false;
            }
            endOffsetTop -= offsetObjectHeight;
        }

        if (_window.scrollTop() > startOffsetTop && _window.scrollTop() < endOffsetTop) {
            ob.addClass('is-sticked');
            ob.removeClass('is-sticked_end');
        } else {
            ob.removeClass('is-sticked');
            if (_window.scrollTop() > endOffsetTop) {
                ob.addClass('is-sticked_end');
            } else {
                ob.removeClass('is-sticked_end');
            }
        }
    }
}
*/

function getScrollbarWidth() {
	const $scrollDiv = document.createElement('div');
	$scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
	document.body.appendChild($scrollDiv);
	const scrollBarWidth = $scrollDiv.offsetWidth - $scrollDiv.clientWidth;
	document.body.removeChild($scrollDiv);
	return scrollBarWidth;
}
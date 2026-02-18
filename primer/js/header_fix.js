$(function() {
	let headerHeight = 0;
	createPseudoHeader();
	setHeaderHeight();
	checkHeaderFix();

	$(window).scroll(function() {
		if(!isHeaderFixedAllow()) return false;
		checkHeaderFix($(this));
	});

	$(window).resize(function() {
		if(!isHeaderFixedAllow()) return false;
		setHeaderHeight();
	});

	function isHeaderFixedAllow(){
		return $('.header').length && $(window).width() >= 1000;
	}

	function setHeaderHeight(){
		headerHeight = $('.header').outerHeight();
	}
	function createPseudoHeader(){
		$('<div class="pseudo-header-on-fix"/>').insertBefore($('.header'));
	}

	function checkHeaderFix(_window = null){
		if(!_window) _window = $(window);
		// console.log('headerHeight', headerHeight);
		if(_window.scrollTop() > headerHeight) {
			$('body').addClass('is-header-fixed');
			$('.pseudo-header-on-fix').height(headerHeight);
		} else {
			$('body').removeClass('is-header-fixed');
		}
	}
});



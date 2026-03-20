$(function () {
    $('.main-menu__list[data-level="1"] > .main-menu__item_has-children').hover(
        function () {
            $('body').addClass('is-hover-main-menu-item');
        },
        function () {
            $('body').removeClass('is-hover-main-menu-item');
        }
    );

    $('.main-menu__list_sub .main-menu__item').hover(
        function () {
            let self = $(this), src =  self.data('src')
            if(!!src){
                // self.parents('.main-menu__dropdown').find('.main-menu__dropdown-image-box img').fadeOut(function () {
                //     $(this).attr('src', src).fadeIn();
                // });
                self.parents('.main-menu__dropdown').find('.main-menu__dropdown-image-box img').attr('src', src);
            }
        }
    );
});
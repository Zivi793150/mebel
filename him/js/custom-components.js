$(function (){

    /*  ======================================================================
            CUSTOM SCRIPTS: AMOUNT
    ========================================================================== */
    $('.amount__button--minus').click(function () {
        var input = $(this).next(),
            count = parseInt(input.val()) - 1;
        count = count < 1 ? 1 : count;
        input.attr('value', count);
    });
    $('.amount__button--plus').click(function () {
        var input = $(this).prev(),
            count = parseInt(input.val()) + 1
        input.attr('value', count);
    });

    $('.amount__button').on('mousedown', function(e){
        e.preventDefault();
    });

    $('.amount__button').on('selectstart', function(e){
        e.preventDefault();
    });
    /*  ======================================================================
            CUSTOM SCRIPTS: MODAL WINDOW
    ========================================================================== */
    var trigger = $('.md-trigger'),
        close = $('.md-close'),
        overlay = $('.md-overlay'),
        modal = $('.md-modal');

    trigger.on('click', function(e){
        e.preventDefault();
        var modal = $('[id="'+ $(this).data('modal') +'"]'),
            modalContent = modal.find('.md-content'),
            overlay = modal.next('.md-overlay');

        modalContent.scrollTop(0);
        modal.addClass('md-show');
        overlay.addClass('md-show');
    });

    overlay.on('click', function(){
        removeClass();
    });

    close.on('click', function(){
        removeClass();
    });

    function removeClass(){
        modal.removeClass('md-show');
        overlay.removeClass('md-show');
    }
    /*  ======================================================================
            SELECT
    ========================================================================== */
    $('.select').find('.select__title').on('click', function(e){
        var title  = $(this),
            list   = title.next('.select__list');

        if( title.hasClass('active') ){
            title.removeClass('active');
            list.removeClass('active');
            return false;
        }
        else {
            $('.select__title').removeClass('active');
            $('.select__list').removeClass('active');
            title.addClass('active');
            list.addClass('active');
            return false;
        }
    });

    $(document).click(function(e){
        $('.select__title').removeClass('active');
        $('.select__list').removeClass('active');
    });

    $('.select__item').on('click', function(e){
        var item  = $(this),
            title = item.parent().prev('.select__title'),
            input = item.parent().parent().find('.select__input'),
            select = title.parent();

        if(select.attr('data-select') != undefined){
            title.removeClass().addClass('select__title').addClass(item.data('class'));
        };

        $(this).addClass('active').siblings().removeClass('active');

        title.text(item.text());
        input.val(item.text());
        item.parent().removeClass('active');
    });

    $('.select__title').on('mousedown', function(e){
        e.preventDefault();
    });

    $('.select__title').on('selectstart', function(e){
        e.preventDefault();
    });

    /*  ======================================================================
            CUSTOM SCRIPTS: TABS
    ========================================================================== */
        $('.tabs__caption').on('click', 'li:not(.active)', function() {
          $(this).addClass('active').siblings().removeClass('active')
          .closest('.js-tabs').find('.tab__content').hide().eq($(this).index()).fadeIn(600);
        });


    /*  ======================================================================
            CUSTOM SCRIPTS: BUTTON "TO TOP"
    ========================================================================== */
    // Activation
    var offsetTop = 700;
    $(window).scroll(function () {
        if ($(this).scrollTop() > offsetTop) {
            $('.js-to-top').addClass('active');
        }
        else {
            $('.js-to-top').removeClass('active');
        }
    });

    // Click Button "TO TOP"
    $('.js-to-top').on('click', function(){
        $('body, html').animate({
            scrollTop: 0
        }, 500);
    });

});

/*  ======================================================================
        TABS-PROD
========================================================================== */


(function($){
    jQuery.fn.lightTabs = function(options){
        
        var createTabs = function(){
            tabs = this;
            i = 0;
            
            showPage = function(i){
                $(tabs).children("div").children("div").hide();
                $(tabs).children("div").children("div").eq(i).show();
                $(tabs).children("ul").children("li").removeClass("active");
                $(tabs).children("ul").children("li").eq(i).addClass("active");
            }
            
            showPage(0);				
            
            $(tabs).children("ul").children("li").each(function(index, element){
                $(element).attr("data-page", i);
                i++;                        
            });
            
            $(tabs).children("ul").children("li").click(function(){
                showPage(parseInt($(this).attr("data-page")));
            });				
        };		
        return this.each(createTabs);
    };	
})(jQuery);
$(document).ready(function(){
    $(".tabs").lightTabs();
});
$(document).ready(function(){

	"use strict";

    // WIDTH - MAIN MENU ITEM
    $('.sub-menu').each(function(i, elem) {
        var menu = $(this).closest('.main-menu'),
            menu_item = $(this).closest('.main-menu__item'),
            menu_link = menu_item.find('.main-menu__link'),
            width = menu_item.innerWidth() + 122,
            pos = 'calc(50% - ' + width/2 +'px)',
            pos_x = menu_item.position().left;

            if(pos_x > 0) {
                $(this).css('left', pos);
            }

            $(this).innerWidth(width);
            $(this).css('z-index', '12');
            menu_link.css('z-index', '13');
    });

    // MOBILE MENU
    $('.js-mb-menu-open').on('click', function(){
        $('.responsive-menu').addClass('active'); 
        $('.responsive-overlay').addClass('active');
        $('body').addClass('not-scroll');
    });

    $('.responsive-overlay').on('click', function(){
        $('.responsive-menu').removeClass('active'); 
        $('.responsive-overlay').removeClass('active');
        $('body').removeClass('not-scroll');
    });

    $('.responsive-menu__close').on('click', function(){
        $('.responsive-menu').removeClass('active'); 
        $('.responsive-overlay').removeClass('active');
        $('body').removeClass('not-scroll');
    });

    // FILTER BOX
    $('.js-fb-down').on('click', function(){
        var filter_box = $(this).closest('.filter-box'),
            filter_content = filter_box.find('.filter-box__content');

        if(!filter_content.hasClass('active')) {
            filter_content.addClass('active');
            filter_content.slideDown(200);
        } 
        else {
            filter_content.removeClass('active');
            filter_content.slideUp(200);
        }
    });

    // MASK PHONE
    $("#phone").inputmask("+7(999)999-99-99");

    // RADIO TABS
    $('.radio-tabs__caption').on('click', '.radio-tab__link:not(.active)', function() {
        $(this).addClass('active').siblings().removeClass('active')
        .closest('.js-radio-tabs').find('.radio-tab__content').hide().eq($(this).index()).fadeIn(600);
    });

    //  CUSTOM SCRIPTS: MOBILE FILTER
    $('.js-mb-filter').on('click', function(){
        $('.widget-filter').addClass('active');
        $('.filter-overlay').addClass('active');
        $('body').addClass('not-scroll');
    });

    $('.filter-overlay').on('click', function(){
        $('.widget-filter').removeClass('active'); 
        $('.filter-overlay').removeClass('active');
        $('body').removeClass('not-scroll');
    });

    $('.mb-filter-close').on('click', function(){
        $('.widget-filter').removeClass('active'); 
        $('.filter-overlay').removeClass('active');
        $('body').removeClass('not-scroll');
    });

    // Open Sub Menu
    $('.mb-menu__open-sub-menu').on('click', function(){
        var mb_item = $(this).parent();
        if (!mb_item.hasClass('active')){
            mb_item.addClass('active');
            $(this).next('.mb-sub-menu').slideDown(300);
        }
        else {
            mb_item.removeClass('active');
            $(this).next('.mb-sub-menu').slideUp(300);
        }
    });


/*  ======================================================================
    PLUGINS: OWL CAROUSEL
========================================================================== */
    // Carousel
    $(".owl-carousel-custom").each(function(i, elem){
        var $navigation = true,
            $pagination = true,
            $autoPlay = true,
            $itemsCount = 5,
            $itemsCountSM = 3,
            $itemsCountXS = 2,
            $itemsCountXSL = 1;

        if($(this).attr('data-items')) {
            $itemsCount = Number($(this).attr('data-items'));
        }
        if($(this).attr('data-items-sm')) {
            $itemsCountSM = Number($(this).attr('data-items-sm'));
        }
        if($(this).attr('data-items-xs')) {
            $itemsCountXS = Number($(this).attr('data-items-xs'));
        }
        if($(this).attr('data-items-xsl')) {
            $itemsCountXSL = Number($(this).attr('data-items-xsl'));
        }
        if($(this).attr('data-autoplay') == "false") {
            $autoPlay = false;
        }
        if($(this).attr('data-navigation') == "false") {
            $navigation = false;
            $(this).addClass('navigation-false');
        }
        if($(this).attr('data-pagination') == "false") {
            $pagination = false;
        }
        $(this).owlCarousel({
            items: $itemsCount,
            autoPlay: $autoPlay,
            navigation: $navigation,
            pagination: $pagination,
            navigationText: 
                ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M45.93,0L49,3.19,21.09,32,49,60.81,45.93,64,15,32.08Z"/></svg>', 
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M49,32.08L18.07,64,15,60.81,42.91,32,15,3.19,18.07,0Z"/></svg>'],
            slideSpeed: 500,
            paginationSpeed: 500,
            stopOnHover: true,
            itemsDesktop: false,
            itemsDesktopSmall: [991, $itemsCountSM],
            itemsTablet: [767, $itemsCountXS],
            itemsTabletSmall: [480, $itemsCountXSL],
        });
    });

    // Slider
    $(".owl-slider").each(function(i, elem){
        var $navigation = true,
            $pagination = true,
            $autoPlay = true;

        if($(this).attr('data-autoplay') == "false") {
            $autoPlay = false;
        }
        if($(this).attr('data-navigation') == "false") {
            $navigation = false;
            $(this).addClass('navigation-false');
        }
        if($(this).attr('data-pagination') == "false") {
            $pagination = false;
        }
        $(this).owlCarousel({
            singleItem: true,
            autoPlay: $autoPlay,
    animateOut: 'slideOutDown',
    animateIn: 'flipInX',
            navigation: $navigation,
            pagination: $pagination,
            navigationText: 
                ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M45.93,0L49,3.19,21.09,32,49,60.81,45.93,64,15,32.08Z"/></svg>', 
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M49,32.08L18.07,64,15,60.81,42.91,32,15,3.19,18.07,0Z"/></svg>'],
        	slideSpeed: 500,
            paginationSpeed: 500,
            stopOnHover : true,
        });
    });

    // Shop Single Page - Gallery
    var owl_gallery = $('.hd-gallery-owl'),
        owl_gallery_nav = $('.hd-gallery-nav'),
        n = 0,
        strItem = '';

    owl_gallery.owlCarousel({
        singleItem: true,
        autoPlay: false,
        navigation: false,
        pagination: false,
        navigationText: false,
        slideSpeed: 500,
        paginationSpeed: 500,
        stopOnHover : true,
        afterMove: function (){
            $('.hd-gallery-nav__item').removeClass('active');
            n = Number(this.currentItem) + 1;
            strItem = '.hd-gallery-nav .owl-item:nth-child('+ n +') .hd-gallery-nav__item';
            $(strItem).addClass('active');
            owl_gallery_nav.trigger('owl.goTo', this.currentItem);
        }
    });

    owl_gallery_nav.owlCarousel({
        items: 6,
        autoPlay: false,
        navigation: true,
        pagination: false,
        navigationText: 
                ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M45.93,0L49,3.19,21.09,32,49,60.81,45.93,64,15,32.08Z"/></svg>', 
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M49,32.08L18.07,64,15,60.81,42.91,32,15,3.19,18.07,0Z"/></svg>'],
        slideSpeed: 500,
        paginationSpeed: 500,
        stopOnHover : true,
        rewindNav : false,
        mouseDrag: false,
        itemsDesktop: [1200, 5],
        itemsDesktopSmall: [991, 5],
        itemsTablet: [767, 5],
        itemsMobile: [479, 3],
    });

    $('.hd-gallery-nav__item').on('click', function(){
        $('.hd-gallery-nav__item').removeClass('active');
        $(this).addClass('active');
        owl_gallery.trigger('owl.goTo', $(this).parent().index());
    });


$('.owl-slider-lp').owlCarousel({
    loop:true,
    margin:10,
    items: 2,
    nav:true,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:2
        }
    }
})

$('.owl-carousel').owlCarousel({
    margin:20,
    loop:true,
    autoWidth:true,
    items:3
})

$('.owl-slider-lpto').owlCarousel({
    loop:true,
    margin:10,
    items: 1,
    nav:true
})

/*  ======================================================================
    PLUGINS: MAGNIFIC POPUP
========================================================================== */
    // Magnific popup init for Image
    var cp_magnificPopup_image = function(index){
        index.magnificPopup({
            type:'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
        });
    };

    // Magnific popup init for Iframe
    var cp_magnificPopup_iframe = function(index){
        index.magnificPopup({
            type: 'iframe',
            iframe: {
                markup: '<div class="mfp-iframe-scaler">'+
                        '<div class="mfp-close"></div>'+
                        '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                        '</div>',
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                        index: '//maps.google.',
                        src: '%id%&output=embed'
                    }
                },
                srcAction: 'iframe_src',
            }
        });
    };

    // Img-Popup
    cp_magnificPopup_image($('.img-popup'));
    // Iframe-Popup
    cp_magnificPopup_iframe($('.iframe-popup'));

    $('.gallery').each(function() { // the containers for all your galleries
        $(this).find('.img-popup').magnificPopup({
            type: 'image',
            gallery: {
                enabled:true,
                tCounter: '<span class="mfp-counter">%curr% of %total%</span>',
            }
        });
    });

    // Single Product gallery
    $('.hd-gallery-owl').find('a').magnificPopup({
        type: 'image',
        gallery:{
            enabled:true,
            tCounter: '<span class="mfp-counter">%curr% of %total%</span>'
        },
    });

/*  ======================================================================
    PLUGINS: NOUISLIDER
========================================================================== */
    if(document.getElementById('nouislider') != null ) {

        var rangeSlider = document.getElementById('nouislider');
        noUiSlider.create(rangeSlider, {
            start: [25000, 123000],
            connect: true,
            step: 1,
            range: {
                'min': 0,
                'max': 150000
            },
            format: wNumb({
                decimals: 0,
                thousand: ' ',
            })
        });
        // UPDATE INPUT ELEMENTS
        var inputMin = document.getElementById('input-min'),
            inputMax = document.getElementById('input-max');

            rangeSlider.noUiSlider.on('update', function ( values, handle ) {
                if ( handle == 0 ) {
                    inputMin.value = values[handle];
                }
                if ( handle == 1 ) {
                    inputMax.value = values[handle];
                }
            });
    }

$(".buy-but").on("click", function(){
            $.ajax({
                type: "GET",
                url: $(this).attr('data-value')+"&quantity="+$(".amount__input").val(),
                dataType: "html",
                success: function(out){

                    alert("Товар добавлен в корзину");
                }

            });
            });

/*  ======================================================================
    Отправка формы
========================================================================== */
    $(".js-form").on("submit", function(e) {

        var th = $(this);

        if(validate_form($(this)))
        {
            // Ajax
        }

        return false;
    });

/*  =====================================================
    fucntion: number_format() - (аналог в php number_format())
========================================================= */
/*
 *  number - исходное число
 *  decimals - количество знаков после разделителя
 *  dec_point - символ разделителя
 *  thousands_sep - разделитель тысячных
 */
 function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + (Math.round(n * k) / k).toFixed(prec);
        };
    
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }

    return s.join(dec);
}

/*  ======================================================================
    Расчет стоимости пошива штор
========================================================================== */
    function calculation(f) {
        var result = [];
        var Pv = (f.Pv) ? 200 : 100;
        var K = 1.5;
        var Kp = 2;

        // Пошив тюля
        var tulle = Pv + f.Lk*K*100+f.H*2*45;

        // Комплект штор на петлях
        result[1] = (200+f.Lk*Kp*100+f.H*4*45+f.Lk*Kp*45+f.Lk*Kp/0.18*45) + (f.Lk*Kp*f.Sp) + (f.Lk*K*f.St) + tulle + (f.Lk*K*f.Sl) + (f.Lk*Kp*f.Slp);
        $('#set-curtains-hinges').find('.s-calculation__price span').text(number_format(result[1], '', '.', ' '));

        // Комплект штор на люверсах
        result[2] = (200+f.Lk*(Kp<2.5?2.5:Kp)*100+f.H*4*45+f.Lk*(Kp<2.5?2.5:Kp)*45+f.Lk*(Kp<2.5?2.5:Kp)/0.18*45) + tulle + (f.Lk*(Kp<2.5?2.5:Kp)*f.Sp) + (f.Lk*K*f.St) + (f.Lk*(Kp<2.5?2.5:Kp)/0.18*45) + ((Kp<2.5?2.5:Kp)*f.Lk*(f.Slp<200?200:f.Slp)) + (f.Lk*K*f.Sl);
        $('#set-curtains-eyelets').find('.s-calculation__price span').text(number_format(result[2], '', '.', ' '));

        // Комплект штор на ленте
        result[3] = (200+f.Lk*Kp*100+f.H*4*45+f.Lk*K*45) + (f.Lk*K*f.Sl) + (f.Lk*Kp*f.Slp) + (f.Lk*K*f.St) + (f.Lk*Kp*f.Sp) + tulle;
        $('#set-curtains-tape').find('.s-calculation__price span').text(number_format(result[3], '', '.', ' '));

        // Комплект штор на псевдо-люверсах
        result[4] = (200+f.Lk*Kp*100+f.H*4*45+f.Lk*K*45) + (f.Lk*Kp*f.Sp) + (f.Lk*K*f.St) + tulle + (f.Lk*K*f.Sl) + (f.Lk*Kp*(f.Slp<250?250:f.Slp));
        $('#set-curtains-pseudo-grommets').find('.s-calculation__price span').text(number_format(result[4], '', '.', ' '));

        // Комплект шторной ленты Волна
        result[5] = (f.Lk*(Kp<2?2:Kp)*f.Sp) + tulle + (f.Lk*(Kp<2?2:Kp)*f.Sp) + (f.Lk*K*f.St) + (f.Lk*K*f.Sl) + (f.Lk*(Kp<2?2:Kp)*500);
        $('#set-curtains-tapes-wave').find('.s-calculation__price span').text(number_format(result[5], '', '.', ' '));

        // Для письма
        var str = 'Данные из формы расчета:<br>'+
                  'Длина карниз: '+f.Lk+'<br>'+
                  'Высота штор: '+f.H+'<br>'+
                  'Стоимость тюлевой ткани за 1 метр: '+f.St+'<br>'+
                  'Cтоимость портьерной ткани за 1 метр: '+f.Sp+'<br>'+
                  'Cтоимость ленты для портьер за 1 метр: '+f.Slp+'<br>'+
                  'Cтоимость ленты для тюля за 1 метр: '+f.Sl+'<br><br>'+
                  'Разрезать тюль: '+f.Pv+'<br>';

        str = str + 'Результаты:<br>'+
                    'Комплект штор на петлях: '+result[1]+' руб.<br>'+
                    'Комплект штор на люверсах: '+result[2]+' руб.<br>'+
                    'Комплект штор на ленте: '+result[3]+' руб.<br>'+
                    'Комплект штор на псевдо-люверсах: '+result[4]+' руб.<br>'+
                    'Комплект шторной ленты Волна: '+result[5]+' руб.<br>';

        $('#md-calc').find('input[name="calc-result-input"]').val(str);
    }

    var calcFields = {
        Lk: 3.2,
        H: 3.5,
        St: 600,
        Sp: 1500,
        Slp: 400,
        Sl: 100,
        Pv: true,
    }
    calculation(calcFields);

    $('.s-calculation__input input[name="Lk"]').val(calcFields.Lk);
    $('.s-calculation__input input[name="H"]').val(calcFields.H);
    $('.s-calculation__input input[name="St"]').val(calcFields.St);
    $('.s-calculation__input input[name="Sp"]').val(calcFields.Sp);
    $('.s-calculation__input input[name="Slp"]').val(calcFields.Slp);
    $('.s-calculation__input input[name="Sl"]').val(calcFields.Sl);

    $('.s-calculation__field input').on('change', function(e){
        if($(this).val() == '' || $(this).val() == 0) {
            $(this).val(0);
        }
    })

    $('.s-calculation__field input').on('keydown', function(e){
        if(e.key.length == 1 && e.key.match(/[^0-9'".]/)){
            return false;
        };
    });

    $('.s-calculation__field-btn').on('click', function(e){
                
        calcFields = {
            Lk: $('.s-calculation__input input[name="Lk"]').val(),
            H: $('.s-calculation__input input[name="H"]').val(),
            St: $('.s-calculation__input input[name="St"]').val(),
            Sp: $('.s-calculation__input input[name="Sp"]').val(),
            Slp: $('.s-calculation__input input[name="Slp"]').val(),
            Sl: $('.s-calculation__input input[name="Sl"]').val(),
            Pv: true,
        }
        calcFields.Pv = ($('.s-calculation__checkbox input[name="R"]').prop('checked')) ? true : false;
        calculation(calcFields);
        return false;
    });


// end document.ready
});



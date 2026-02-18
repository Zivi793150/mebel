$(function (){
    $('body').on('click', '[data-vmenu-switcher]', function (event){
        const self = $(this), parent = self.parents('[data-vmenu-item-parent]');
        if(!parent.hasClass('is-active')){
            parent.addClass('is-active');
        }else{
            parent.removeClass('is-active');
        }
    });
});
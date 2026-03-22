/*$(function() {
    checkVisibleScrollOnObject($('.work_steps__side'), {
        offsetObject: $('.work_steps__side-image-inner'),
        startOffset: -80,
    });
});
*/

$(function() {
    $('.work_steps__side').each(function() {
        let sideImageInner = $(this).find('.work_steps__side-image-inner');
        if (sideImageInner.length) {
			
            checkVisibleScrollOnObject($(this), {
                offsetObject: sideImageInner,
                startOffset: -80,
            });
        }
    });
});
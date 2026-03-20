/* remodal helper */
$(function() {
	// console.log('local-remodal');
	let ModRemodalStorage = {};
	$('body').on('click','.js--remodal-link',function(e) {
		e.preventDefault();
    	let target = $(this).data('target');
		let params = $(this).data('params');

		if(target && ModRemodalStorage.hasOwnProperty(target)){
			ShowRemodal(params, ModRemodalStorage[target]);
		}else{
			params.modal_link = $(this);
			ModRemodal(params);
		}
	});
	function setRemodalLoading(params, box){
		box.$wrapper.removeClass(params.classList.is_loaded).addClass(params.classList.is_loading);
	}

	function setRemodalLoaded(params, box){
		box.$wrapper.removeClass(params.classList.is_loading).addClass(params.classList.is_loaded);

		if(box.$wrapper.find('.'+params.classList.mask_phone).length)
			box.$wrapper.find('.'+params.classList.mask_phone).mask(params.mask_phone_placeholder);
	}

	function setRemodalContent(params, box, content){
		box.$wrapper.find('.'+params.classList.body).html(content);
	}

	function createRemodalBox(params){
		let html = '<div class="remodal" data-remodal-id="'+params.remodal_id+'"';

		if(params.maxWidth || params.align){
			html += ' style="';
			if(params.maxWidth){
				html += 'max-width:'+params.maxWidth+'px;';
			}
			if(params.align){
				html += 'text-align:'+params.align+';';
			}
			html += '"';
		}

		html += '>';

		if(params.closeLink == 'Y'){
			html += '<button data-remodal-action="close" class="'+params.classList.closeLink+'"></button>';
		}
		html += '<div class="'+params.classList.inner+'">';
		if(params.header || params.title){
			html += params.header.replaceAll('#TITLE#', params.title);
		}

		html += '<div class="'+params.classList.body+'">'+params.content+'</div>';

		if(params.footer || params.cancelButton || params.confirmButton){
			html += '<div class="'+params.classList.footer+'">';

			if(params.footer) {
				html += params.footer;
			}

			if(params.cancelButton){
				html += '<button data-remodal-action="cancel" class="'+params.classList.cancelButton+'">'+params.cancelButton+'</button>';
			}

			if(params.confirmButton){
				html += '<button data-remodal-action="confirm" class="'+params.classList.confirmButton+'">'+params.confirmButton+'</button>';
			}
			html += '</div>';
		}

		html += '</div>';
		html += '</div>';

		$('body').append(html);

		let remodalBox = $('[data-remodal-id="'+params.remodal_id+'"]').remodal(params);

		ModRemodalStorage[params.remodal_id] = remodalBox;

		if(params.cache == 'Y' && params.modal_link && params.modal_link.length){
			params.modal_link.attr('data-target', params.remodal_id);
		}else{
			$(document).on('closed', '.remodal', function (e) {
				remodalBox.destroy();
				// Reason: 'confirmation', 'cancellation'
				console.log('Modal is closed' + (e.reason ? ', reason: ' + e.reason : ''));
			});
		}

		if($.isFunction(params.onAfterCreatedBox)){
			params.onAfterCreatedBox(params, $('[data-remodal-id="'+params.remodal_id+'"]'), remodalBox, ModRemodalStorage);
		}

		return remodalBox;
	}

	function ModRemodal(userParams){
		var defaultParams = {
			hashTracking: false,
			maxWidth: 744,
			align: '',
			closeLink: 'Y',
			title: '',
			remodal_id: 'remodal-'+getRandomInt(1, 20000),
			content:'',
			is_ajax_content: 'N',
			ajax_content_url:'',
			ajax_params: {},
			autoclose: 'N',
			autocloseTimeOut: 3000,
			mask_phone_placeholder: '+7-(999)-999-99-99',
			cache: 'N',
			classList: {
				inner: 'remodal__inner',
				header: 'remodal__header',
				title: 'remodal__title',
				body: 'remodal__body',
				footer: 'remodal__footer',
				closeLink: 'remodal__close-link',
				cancelButton: 'remodal__btn-cancel',
				confirmButton: 'remodal__btn-confirm',
				overlay: 'remodal-overlay',
				is_opened: 'remodal-is-opened',
				is_loading: 'remodal-is-ajax-loading',
				is_loaded: 'remodal-is-ajax-loaded',
				mask_phone: 'form__field_is-mask-phone',
			},
			onAfterCreatedBox: null
		};

		defaultParams.header = '<div class="'+defaultParams.classList.header+'"><div class="'+defaultParams.classList.title+'">#TITLE#</div></div>';

		var params = $.extend(defaultParams, userParams);

		if(params.is_ajax_content == 'Y'){
			var remodalBox = createRemodalBox(params);

			setRemodalLoading(params, remodalBox);
			ShowRemodal(params, remodalBox);

			$.ajax({
				url: params.ajax_content_url,
				type: "POST",
				data: params.ajax_params,
				dataType: "html",
				success: function(data, textStatus, jqXHR) {

					let content;

					if(isValidHtmlResponse(data)){
						content = data;
					}else{
						params.title = 'Ошибка';
						content = 'Не корректный контент';
					}

			    setRemodalContent(params, remodalBox, content);
					setRemodalLoaded(params, remodalBox);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					console.error(textStatus);
					console.error(errorThrown);

					params.title = 'Ошибка';
					params.content = 'Ошибка';
					ShowRemodal(params);
				},
			});
		}else{
			if(!params.content){
				params.title = 'Ошибка';
				params.content = 'Не найден контент';
			}

			ShowRemodal(params);
		}
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
	}

	function ShowRemodal(params, remodalBox){
		//console.log(params);

		if(!remodalBox){
			remodalBox = createRemodalBox(params);
		}

		remodalBox.open();

		if(params.autoclose == 'Y'){
			setTimeout(function(){
				remodalBox.close();
			}, params.autocloseTimeOut);
		}
	}

	function isValidHtmlResponse(response=''){
		if(response && response.indexOf('<head>') == -1){
			return true;
		}else{
			return false;
		}
	}

	$.ModRemodal = ModRemodal;

	$.ModRemodal.Close = function (target){
		if(target && ModRemodalStorage.hasOwnProperty(target)){
			ModRemodalStorage[target].close();
			delete ModRemodalStorage[target];
		}
	}

});

function createMessageOk(userParams){
	var params = $.extend({
		title: 'Спасибо!',
		text: 'Ваше сообщение отправлено',
	}, userParams);

	var html = '<div class="message-ok-panel"><div class="message-ok-panel__inner">';

	if(params.title){
		html += '<span class="message-ok-panel__title">'+params.title+'</span>';
	}

	if(params.text){
		html += '<span class="message-ok-panel__text">'+params.text+'</span>';
	}

	html += '</div></div>';

	return html;
}
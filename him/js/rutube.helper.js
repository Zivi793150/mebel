$(function (){
	$('body').on('click', '.remodal-rutube', function (e){
		e.preventDefault();
		let videoId = $(this).data('video-id');
		let width = $(this).data('width') || 960;
		let height = $(this).data('height') || 615;
		let autoplay = $(this).data('autoplay') || true;
		if(!videoId){
			console.error('videoId is not found');
			return false;
		}
		const rt = new Rutube();
		$.ModRemodal({
			maxWidth: width,
			// closeLink: false,
			remodal_id: 'remodal-rutube',
			content: '<div id="remodal-rutube-player"></div>',
			onAfterCreatedBox: function () {
				rt.Player('remodal-rutube-player', {
					width,
					videoId,
					height,
					events: {
						onReady: function (event) {
							// console.log('Плеер загружен.');
							// console.log(event); // { videoId: '6e5e06ad0f3104ae47fb0f69d2198855', clientId: 'e56df991-ca59-4036-91b8-e2913944f84c' }
							if(!!autoplay){
								setTimeout(function (){
									rt.play();
								}, 700);
							}

						},
						onStateChange: function (event) {
							// console.log(event); //  { 'playerState': { 'PLAYING': 0, 'PAUSED': 1, 'STOPPED': 0, 'ENDED': 0 } }

							// if (event.playerState.PAUSED) {
							// 	console.log('PAUSED');
							//
							// 	console.log(rt.currentDuration()); // 41.635709
							// }
							//
							// if (event.playerState.ENDED) {
							// 	console.log('ENDED');
							//
							// 	// если текущее видео закончилось, переход к другому с ID d124f6d7c977b94031051409aa55648a
							// 	rt.changeVideo({
							// 		id: 'd124f6d7c977b94031051409aa55648a',
							// 	});
							// }

							// if (event.playerState.PLAYING && !jumpToSeek) {
							//   rt.seekTo({ time: 124 });
							//   jumpToSeek = true;
							// }
						}
					}
				});
			}
		});
	});
});
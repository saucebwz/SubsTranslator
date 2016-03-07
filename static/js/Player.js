function Player(videoPlayer, mainPanel, fs, path){

	this.videoPlayer = videoPlayer[0];
	this.modules = {
		fs: fs,
		path: path
	};
	this.timeline = new Timeline(this.videoPlayer);

//	this.format = path.extname(this.src).split('.')[1];
	this.panelTimeout = 1500; // todo: move to settings ob

	this.hidePanel =  function(){
		clearTimeout(this.timer);
		mainPanel.show();
		this.timer = setTimeout(function(){
			mainPanel.hide();
	  }, this.panelTimeout);
	};

	var self = this;

	$('.video-wrapper')[0].addEventListener('mousemove', this.hidePanel.bind(this), false);
  setInterval(function(){
		$('#time')[0].textContent = this.videoPlayer.currentTime;
	}.bind(this), 500);


	$('.playButton').on('click', function(){
		var v = document.getElementById('video-player');
		v.paused ? v.play() : v.pause();
		self.timeline.index = 0;
	});

}

Player.prototype = {

	timer: null,
	topSubs: null,
	bottomSubs: null,

	formatRegExp: /^[^\.\\]+\.(mp4|webm)$/,
	formatError: "Error! Video format is not supported (only .webm and .mp4).",
	dontExistError: "Error! File is not exist :c",

	loadVideo: function(src){

		if(!this.modules.fs.existsSync(src)){
			alert(this.dontExistError);
			return false;
		}


		var filename = this.modules.path.basename(src),
			match = filename.match(this.formatRegExp);

		if(match){
			this.playNewVideo(src); //this.videoPlayer.src = src;
		}

		else {
			alert(this.formatError);
			return false;
		}
		var srt = src.split('.');
		srt = srt.slice(0, srt.length-1).join('.') + '.srt';
		this.loadSubtitles(srt);
	},

	playNewVideo: function(src){

		var format = this.modules.path.extname(src).split('.');

		format = format[format.length-1];

		$('source', this.videoPlayer).remove();

		$(this.videoPlayer).append('source', {
			src: src,
			format: 'video/' + format
		});

		this.videoPlayer.play();

		$('.input-wrapper').hide();
		$('.video-wrapper').show();

	},

	loadSubtitles: function(src){
		var timeline = this.timeline;
		var str = this.modules.fs.readFile(src, function(err, data){
			if(err){
				console.log(err);
				return;
			}

			var stream = new SubtitlesStream(data.toString());
			var subtitles = {};

			stream.on('data', function(chunk){
				var time;

				time = chunk.timeStart[0] + ':' + chunk.timeStart[1] + ':' + chunk.timeStart[2] + ',' + chunk.timeStart[3];
				timeEnd = chunk.timeEnd[0] + ':' + chunk.timeEnd[1] + ':' + chunk.timeEnd[2] + ',' + chunk.timeEnd[3];
				subtitles[timeline.timeToMs(time)] = { begin: timeline.timeToMs(time), end: timeline.timeToMs(timeEnd), text: chunk.text };
				//	playing = timeline.timeToMs(timeEnd) - timeline.timeToMs(time);
					// maybe, `let chunk` instead of `var chunk`?
					// chunk.number
					// chunk.text
					// chunk.time
					// chunk.timeStart
					// chunk.timeEnd

			});
			stream.on('end', function(){

				timeline.subtitles = subtitles;
				timeline.start();
			});

		}); //from here
	},
};

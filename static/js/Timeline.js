


var Timeline = function(videoPlayer){
	this.index = 0;
	this.subtitles = null;
	this.videoPlayer = videoPlayer;
	this.translator = new Translator({from: 'en', to: 'ru'});
};

Timeline.prototype.timeToMs = function(time){
		var time = time.split(':');
		var result = Number(time[0]) * 60 * 60 * 1000;
		result += Number(time[1]) * 60 * 1000;
		var secs = time[2].split(',');
		result += Number(secs[0]) * 1000;
		result += Number(secs[1]);
		return result;
};


Timeline.prototype.setSubtitles = function(text){
	var self = this;
	text.split(" ").map(function(chunk){
		console.log(chunk);
		var a = document.createElement("a");
		a.className = "subtitle-chunk";
		a.innerHTML = chunk + " ";
		a.onclick = function(){
			var text = this.innerHTML;
			self.translator.translate(text, function(data){
				alert(data.text);
			});
		}
		$('#top_subs').append(a);
	});
		// todo: extended subs (i, b tags)
};

Timeline.prototype.cTimeToMs = function(ctime){
	return ctime * 1000;
};

Timeline.prototype.start = function(){
	var self = this;
	var currentSubtitle;
	var subInterval = setInterval(function(){
		var currentTime = self.cTimeToMs(self.videoPlayer.currentTime);
		console.log(currentTime);
		var sb = -1;
		for(var sub in self.subtitles){
			if(sub > currentTime)
				break;
			sb = sub;
		}
		if(sb > 0){

			if(sb != currentSubtitle){
				self.setSubtitles(self.subtitles[sb].text);
				currentSubtitle = sb;
			}

			else if (self.subtitles[sb].end < currentTime) {
				self.setSubtitles('');

			}

		}
	}, 100);
};

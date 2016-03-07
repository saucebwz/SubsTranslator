(function(undefined){
	var os = require('os'),
		fs = require('fs'),
		path = require('path'),
		_ = require('underscore'),
		videoInput = document.getElementById('video-input'),
		videoPlayer = $('#video-player'),
    	mainPanel = $('#main_panel'),
		player = new Player(videoPlayer, mainPanel, fs, path);

	videoInput.addEventListener("change", function(e){

		player.loadVideo(this.value);

	});



	if(typeof exports !== 'undefined'){
		exports = {
			//Later exports for mocha's testing
		};
	}

	window.player = player;

})();

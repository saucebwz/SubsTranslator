var stream = require('stream');
var util = require('util');

var Readable = stream.Readable;

function SubtitlesStream(subs, options){
	if(!(this instanceof SubtitlesStream)){
		return new SubtitlesStream(sub, options);
	}
	if(!options) options = {};
	options.objectMode = true;
	Readable.call(this, options);
	this.subs = this.parse(subs);
	this.index = 0; //starting point
}
util.inherits(SubtitlesStream, Readable);

extend(SubtitlesStream.prototype, {

	timeRegExp: /(\d+):(\d+):(\d+),(\d+)\s*\-+>\s*(\d+):(\d+):(\d+),(\d+)/,

	parse: function(subs){
		var array = [],
			obj;
		subs.split("\n").forEach(function(line){
			// trimming
			line = line.replace(/^\s/g, '').replace(/\s$/g, '');
			if(line === '')
				return;

			if((Number(line) + '') == line){
				// number
				obj = {
					number: Number(line)
				};
				array.push(obj);
			}
			else if(obj === undefined){
				// I don't know how this error may be, but...
				return;
			}
			else if(this.timeRegExp.test(line)){
				obj.time = line;
				line = this.timeRegExp.exec(line);
				obj.timeStart = line.slice(1, 5);
				obj.timeEnd = line.slice(5);
			}
			else {
				if(obj.text)
					obj.text += '\n' + line;
				else
					obj.text = line;
			}

		}.bind(this));
		return array;
	},

	_read: function(n){
		var subs = this.subs;
		if(this.index > subs.length - 1){
			return this.push(null); // stop iteration and send 'end' handle
		}
		this.push(subs[this.index]);
		this.index += 1;
	}
});

function extend(to, from){
	for(var key in from){
		if(Object.prototype.hasOwnProperty.call(from, key)){
			to[key] = from[key];
		}
	}
	return to;
}

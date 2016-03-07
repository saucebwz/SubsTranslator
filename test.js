var should = require('chai').should(),
    chai = require('chai'),
    videoFileRegexp = /^[^\.\\]+\.(mp4|webm)$/,
    Translator = new require('./static/js/Translator.js').Translator;
    trans = new Translator({from: 'en', to: 'ru'}),
    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

describe('Video filename', function(){
  describe('Format', function(){
    it('Should return null when the value doesn\'t contain .webm or .mp4 format.', function(){
      should.not.exist("videoname.wmv".match(videoFileRegexp));
    });
    it('Should return the array of elements when contains .webm or .mp4 format.', function(){
      "videoname34.webm".match(videoFileRegexp).should.be.a('Array');
    });
  });
});

describe('Translator', function(){
  describe('Response', function(){
    it('Should return an array if there are more than one word', function(done){
      trans.translate("suck it", function(data){
        done();
        data.should.be.a('string');
        done();
      });
    });
  });
});

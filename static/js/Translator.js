var path = require('path');
var util = require('util');
var http = require('http');

function HttpError(status, message){
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";



function Translator(options){
  this.apiString = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
  this.key = 'trnsl.1.1.20151206T122027Z.9457cea1e034b7ed.2ac6643341ea439e6a1d6a5acc5589c5ca7d8c0e';
  this.wTranslateUrl = 'http://www.lingvo-online.ru/ru/Translate/';
  this.options = options || {};
}

Translator.prototype.parseJSON = function(data){
    return window.JSON && window.JSON.parse ? window.JSON.parse( data ) : (new Function("return " + data))();
}

Translator.prototype._translateSentence = function(sentence, options, cb){
  var fullUrl = this.apiString + "key=" + this.key + "&" + "text=" + sentence + "&" + "lang=" + options.from + '-' + options.to;
  this._sendRequest(fullUrl, cb);
}

Translator.prototype._translateWord = function(word, options, cb){
  var url = this.wTranslateUrl + options.from + '-' + options.to + '//' + word;
  this._sendRequest(url, cb);
}

Translator.prototype.getTranslateFromHtml = function(html){
  var data = $(html);
  var regex = /<.+>.+<\/.+>/gi;
  var translateArray = data.findByClass('js-article-lingvo');
  var str = [],
      self = this;
  translateArray.forEach(function(item){
    var items = item.querySelectorAll('.P1');
    str.push(self.getTextContent(items));
  });
  bData = this.beautifyData(str[0]);
  return bData;
};

Translator.prototype.beautifyData = function(data){
  var result = {},
      lastAdd = 'сущ',
      sunReg = /^\d?\.\s*(.+)/i;

  data.forEach(function(item){
    var match = item.match(sunReg);
    if(match){
      lastAdd = match[0];
      result[lastAdd] = [];
    }
    else{
      result[lastAdd].push(item);
    }
  });
  return result;
};



Translator.prototype.getTextContent = function(element){
  var result = [];
  for(var i = 0; i < element.length; i++){
    result.push(element[i].textContent);
  }
  return result;
}

Translator.prototype._sendRequest = function(url, header, cb){
  if(arguments.length > 2){
    header = header || 'application/json';
  }
  else{
    cb = header;
    header = 'application/json';
  }
  var httpRequest = new XMLHttpRequest();
  var data;
  if(!httpRequest){
    return new Error("Cannot create an XMLHttpRequest instance");
  }

  httpRequest.onreadystatechange = function(){
    if(httpRequest.readyState === XMLHttpRequest.DONE){
      if(httpRequest.status === 200){
        if (cb && typeof(cb) === "function") {
          var regex = /(html)?[\s\n]*<.+>.+<\/.+>/gi;
          var translateText;
          if(regex.exec(httpRequest.responseText)){
            translateText = this.getTranslateFromHtml(httpRequest.responseText);
            cb(translateText);
            return;
          }
          cb(httpRequest.responseText);
        }
      }
      else{
        if (cb && typeof(cb) === "function") {
            cb(new HttpError(httpRequest.status));
        }
      }
    }
  }.bind(this);

  httpRequest.open('GET', url);
  httpRequest.setRequestHeader('Content-Type', header);
  httpRequest.send();
};

Translator.prototype.translate = function(str, options, cb){
  if(str.length > 30){
    return;
  }
  var _options;
  if(arguments.length > 2){
    _options = options || this.options;
  }

  else{
    cb = options;
    _options = this.options;
  }

  var httpRequest = new XMLHttpRequest();
  var data;
  if(!httpRequest){
    return new Error("Cannot create an XMLHttpRequest instance");
  }

  if(str.split(" ").length > 1){
    this._translateSentence(str, _options, cb);
    return;
  }
  else{
    this._translateWord(str, _options, cb);
    return;
  }
};
if(typeof exports !== 'undefined'){
  exports.Translator = Translator;
}

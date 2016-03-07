$=function(t,e,n,i,o,r,s,u,c,f,l,h){return h=function(t,e){return new h.i(t,e)},h.i=function(i,o){n.push.apply(this,i?i.nodeType||i==t?[i]:""+i===i?/</.test(i)?((u=e.createElement(o||"q")).innerHTML=i,u.children):(o&&h(o)[0]||e).querySelectorAll(i):/f/.test(typeof i)?/c/.test(e.readyState)?i():h(e).on("DOMContentLoaded",i):i:n)},h.i[l="prototype"]=(h.extend=function(t){for(f=arguments,u=1;u<f.length;u++)if(l=f[u])for(c in l)t[c]=l[c];return t})(h.fn=h[l]=n,{on:function(t,e){return t=t.split(i),this.map(function(n){(i[u=t[0]+(n.b$=n.b$||++o)]=i[u]||[]).push([e,t[1]]),n["add"+r](t[0],e)}),this},off:function(t,e){return t=t.split(i),l="remove"+r,this.map(function(n){if(f=i[t[0]+n.b$],u=f&&f.length)for(;c=f[--u];)e&&e!=c[0]||t[1]&&t[1]!=c[1]||(n[l](t[0],c[0]),f.splice(u,1));else!t[1]&&n[l](t[0],e)}),this},is:function(t){return u=this[0],(u.matches||u["webkit"+s]||u["moz"+s]||u["ms"+s]).call(u,t)}}),h}(window,document,[],/\.(.+)/,0,"EventListener","MatchesSelector");

$.fn.append = function(element, options){
  var self = this;
  function isNode(o){
    return (
      typeof Node === "object" ? o instanceof Node :
      o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  }
  options = options || {};
  if(!isNode(element)){
    element = document.createElement(element);
    for(var k in options){
      if(typeof options[k] === 'object' && k === 'styles'){
        for(var attrib in options[k]){
          element.style[attrib] = options[k][attrib];
        }
        continue;
      }
      else if(k==='class'){
        var classList = element.classList;
        classList.add.apply(classList, options[k].split(/\s/));
        continue;
      }
      else if(k === 'id'){
        element.id = k;
        continue;
      }
      else{
        element.setAttribute(k, options[k]);
      }
    }
  }
  this.forEach(function(item){
    item.appendChild(element);
  });
  return this;
};

$.fn.hide = function(){
  this.forEach(function(item){
    item.style.display = 'none';
  });
};

$.fn.show = function(){
  this.forEach(function(item){
    item.style.display = 'block';
  });
};

$.fn.remove = function(){
  this.forEach(function(item){
    item.parentNode.removeChild(item);
  });
};


//return @array
$.fn.findByClass = function(element){
  var result = [];
  this.forEach(function(item){
    var el = _find(item, element);
  });
  function _find(element, f){
    var classes;
    try{
      classes = element.className.split(" ");
      for(var i = 0; i < classes.length; i++){
        if(classes[i] === f) result.push(element);
      }
    }catch(e){/*Just do nothing*/}

    if(element.childNodes.length > 0){
      for(var j = 0; j < element.childNodes.length; j++){
        _find(element.childNodes[j], f);
      }
    }
  }
  return result;
};
if(typeof exports !== 'undefined'){
  exports = {
    append: $.fn.append
  };
}

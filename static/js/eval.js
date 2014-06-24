(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function() {

var noop = function(){}
var silent_obj = {alert:noop, prompt:noop, console:{log:noop}}



window.EVAL = function(jqconsole, log, str, silent) {
  // capture console output & print in our console instead
  window.console.log = function() {
    for (var i=0, len=arguments.length; i<len; i++) {
      log.push(arguments[i])
    }
  }

  var result = eval.call(silent ? silent_obj : window, str)
  var newKeys = Object.keys(window)

  _empty(window.__context__)
  window.__context__.push.apply(window.__context__, 
                                window.top._.difference(newKeys, originalKeys))

  return result
}


window.__context__ = []



var originalKeys = Object.keys(window)



function _empty(arr) { while (arr.length) { arr.pop() } }

}());

},{}]},{},[1])
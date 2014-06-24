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

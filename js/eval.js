;(function() {



window.EVAL = function(jqconsole, str, silent) {

  // capture console output & print in our console instead
  window.console.log = function() {
    if (silent)
      return;

    for (var i=0, len=arguments.length; i<len; i++) {
      jqconsole.Write(arguments[i] + '\n', 'jqconsole-output jqconsole-log')
    }
  }

  var result = eval.call(silent ? {} : window, str)
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

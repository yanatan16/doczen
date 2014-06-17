;(function() {


window.EVAL = function(str) {
  var result = eval.call(window, str)
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

var $replContainer = $('.repls')


function repl() {
  var jqconsole, evl, ctx

  var $container = $('<div class="repl">').appendTo($replContainer)

  // load the eval-er into a sandboxed iframe
  booter.loadScript('/js/eval.js', ['EVAL', '__context__'], ready)

  return $container



  function ready(EVAL, ctx) {
    jqconsole = $container.jqconsole(null, '>>> ', '... ', false, false)

    evl = EVAL.bind(null, jqconsole)
    do_prompt()
  }

  function do_prompt() {
    jqconsole.Prompt(true, _result_cb, _multiline_cb)
  }



  //~~ Console Input Helpers ~~

  function _result_cb(input) {
    try {
      var result = evl(input)

      if (result !== undefined) {
        jqconsole.Write(JSON.stringify(result) + '\n', 'jqconsole-output')
      }
    } catch (ex) {
      jqconsole.Write("ERROR: " + ex + '\n', 'jqconsole-error')
    }
    do_prompt()
  }

  function _multiline_cb(input) {
    try {
      var result = evl(input)
      return false
    } catch (ex) {
      var str = '' + ex

      return /end of input/.test(str)
        ? (input.trim().slice(-1) == '{' ? 2 : 0)
        : false
    }
  }
}



module.exports = repl


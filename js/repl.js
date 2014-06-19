
function repl($container) {
  var jqconsole, evl, ctx

  // load the eval-er into a sandboxed iframe
  booter.loadScript('/js/eval.js', ['EVAL', '__context__'], ready)

  function ready(EVAL, ctx) {
    jqconsole = $container.jqconsole(null, '>>> ', '... ', false)

    evl = EVAL.bind(null, jqconsole)
    do_prompt()
  }

  function do_prompt() {
    jqconsole.Prompt(true, result_cb, multiline_cb)

    function result_cb(input) {
      try {
        var result = evl(input)

        if (result !== undefined)
          jqconsole.Write(JSON.stringify(result) + '\n', 'jqconsole-output')

      } catch (ex) {
        jqconsole.Write("ERROR: " + ex + '\n', 'jqconsole-error')
      }
      do_prompt()
    }

    function multiline_cb(input) {
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
}



module.exports = repl



function repl($container) {
  var jqconsole, evl, ctx

  // load the eval-er into a sandboxed iframe
  booter.loadScript('/js/eval.js', ['EVAL', '__context__'], ready)

  function ready(EVAL, ctx) {
    evl = EVAL
    jqconsole = $container.jqconsole(null, '>> ')
    do_prompt()
  }

  function do_prompt() {
    jqconsole.Prompt(true, function(input) {
      try {
        var result = evl(input)

        if (result !== undefined)
          jqconsole.Write(JSON.stringify(result) + '\n', 'jqconsole-output')

      } catch (ex) {
        jqconsole.Write("ERROR: " + ex + '\n', 'jqconsole-error')
      }
      do_prompt()
    })
  }
}



module.exports = repl


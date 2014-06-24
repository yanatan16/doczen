var $replContainer = $('body')


function repl() {
  var jqconsole, evl, ctx
  var log = []

  var $container = $('<div class="repl">').appendTo($replContainer)

  // load the eval-er into a sandboxed iframe
  booter.loadScript('/js/eval.js', ['EVAL', '__context__'], ready)

  return $container


  /***** ~ *****/


  function ready(EVAL, ctx) {
    jqconsole = $container.jqconsole(null, '>>> ', '... ', false, false)

    evl = EVAL.bind(null, jqconsole, log)
    do_prompt()

    $container.__eval__ = function(str) {
      var _result = evl(str)
      log.forEach(_.partial(_write, _, 'jqconsole-output jqconsole-log'))
      _write(_result)
      _empty(log)
    }

    $container.__set_cmd_history__ = function(hist) {
      jqconsole.SetHistory(hist)
    }

    $container.__display_history_line__ = function(str) {
      jqconsole.Write(str + '\n', 'jqconsole-preloaded')
    }

    $container.trigger('repl-ready')
  }

  function do_prompt() {
    // since our code could get run twice (once to check for multi-line, and
    // once during eval), we'll cache the result so that we only do it once
    var result, has_result

    jqconsole.Prompt(true, _result_cb, _multiline_cb)


    //~~ Console Input Helpers ~~

    function _multiline_cb(input) {
      try {
        result = evl(input, true)
        has_result = true
        return false
      } catch (ex) {
        var str = '' + ex

        return /end of input/.test(str)
          ? (input.trim().slice(-1) == '{' ? 2 : 0)
          : false
      }
    }

    function _result_cb(input) {
      try {
        has_result || (result = evl(input))

        log.forEach(_.partial(_write, _, 'jqconsole-output jqconsole-log'))
        _write(result)
      } catch (ex) {
        _write('ERROR: ' + ex, 'jqconsole-error')
      }
      

      has_result = false
      result = undefined
      _empty(log)
      do_prompt()
    }
  }

  function _write(result, cls) {
    cls || (cls = 'jqconsole-output')

    if (result !== undefined)
      jqconsole.Write(JSON.stringify(result) + '\n', cls);
  }
}


// TODO: this is copy/pasted from eval.js
function _empty(arr) { while (arr.length) { arr.pop() } }



module.exports = repl


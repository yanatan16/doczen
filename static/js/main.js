(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var repl = require('./repl')

var $doc = $(document)
  , $replsContainer = $('.repls')

var editable_tabindex = 0

var PAD = 40



var HISTORIES = {
  'foreach': [
    [function print_badge(guest_name) {
       var str = ' |  Hello, my name is ' + guest_name + '  | '
         , line1 = ' ┏' + (new Array(str.length - 3)).join('-') + '┓ '
         , line2 = ' ┗' + (new Array(str.length - 3)).join('-') + '┛ '
         , pad = ' |' + (new Array(str.length - 3)).join(' ') + '| '
         , space = (new Array(str.length + 1)).join(' ')

       console.log(line1)
       console.log(pad)
       console.log(str)
       console.log(pad)
       console.log(line2)

       console.log(space)
     },
     'function print_badge(guest_name) { ... }']
  ]
}



$('.runnable').each(make_runnable)
$('.highlight').each(highlight)


// Doing this after make_runnable matters, because make_runnable
// trims blank lines from <pre> elements, changing the content height.
$('.has-repl').each(function(ind, sect) {
  var $sect = $(sect)
    , $topEl = $sect.find('h1+p, h2+p, h3+p, h1+pre, h2+pre, h3+pre').first()
    , $repl = repl()

  $repl.css('top', $topEl.offset().top)

  if (HISTORIES[$sect.attr('id')]) {
    preload_history($sect, $repl)
  }

  make_sticky($sect, $topEl, $repl)
  $sect.data('$repl', $repl)
  
  // dirty hack
  setTimeout(function() {
    $repl.find('.jqconsole').addClass('jqconsole-blurred')
  }, 100)
})



function make_runnable(ind, code) {
  var $code = $(code)
    , $btn = $('<button class="run-code">&#9654;</button>')
    , display = $code.css('display')

  $code.wrap('<div style="position:relative;display:'+display+';">')
  $code.parent().append($btn)

  $code.html($code.html().trim())

  $btn.on('click', function(evt) {
    // a bit hacky, but it works
    var $input = $(this).closest('.has-repl').data('$repl').find('textarea')
      , src = $code.text().trim()

    $input
      .text(src)
      .val(src)
      .trigger('paste')
  })

  var $editable = $code.find('span[contenteditable="true"]')
  $editable.on('focus', function() {
    var $tag = $(this)

    setTimeout(function() {
      $tag.selectText()
    }, 50)
  })

  $editable.each(function(i, ed) {
    $(ed).attr('tabindex', ++editable_tabindex)
  })
}

function highlight(ind, code) {
  $(code).attr('data-language', 'javascript')
  Rainbow.color(code)
}

function make_sticky($sect, $topEl, $repl) {
  var T = $topEl.offset().top

  window.WAT = {}

  $doc.on('scroll', function(evt) {
    var ST = $doc.scrollTop()
      , h = $repl.height()

    var B = T + $sect.height() - $topEl.position().top

    if (ST < T - PAD) {
      if ($repl.css('position') != 'absolute')
        $repl
          .css({
             top: T
            ,position: 'absolute'
          })

          .removeClass('scrolled-past')

    } else if ((ST + h + PAD) < B) {
      if ($repl.css('position') != 'fixed')
        $repl
          .css({
             top: PAD
            ,position: 'fixed'
          })

          .removeClass('scrolled-past')

    } else if ((ST + h + PAD) >= B) {
      $repl
        .css({
           top: B - h
          ,position: 'absolute'
        })

        .addClass('scrolled-past')
    }
  })
}

function preload_history($sect, $repl) {
  var history = HISTORIES[$sect.attr('id')]

  if (history) {
    $repl.on('repl-ready', function() {
      history.forEach(function(h) {
        $repl.__eval__(''+h[0])
        $repl.__display_history_line__(h[1])
      })
    })
  }
}




/** from http://jsfiddle.net/edelman/KcX6A/1506/ **/

jQuery.fn.selectText = function(){
    var doc = document
        , element = this[0]
        , range, selection
    ;
    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();        
        range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};

},{"./repl":2}],2:[function(require,module,exports){
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


},{}]},{},[1])
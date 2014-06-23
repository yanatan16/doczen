var repl = require('./repl')

var $doc = $(document)
  , $replsContainer = $('.repls')

var PAD = 40


$('.has-repl').each(function(ind, sect) {
  var $sect = $(sect)
    , $topEl = $sect.find(':not(h1,h2,h3)').first()
    , $repl = repl()

  $repl.css('top', $topEl.offset().top)

  make_sticky($sect, $topEl, $repl)
  $sect.data('$repl', $repl)
  
  // dirty hack
  setTimeout(function() {
    $repl.find('.jqconsole').addClass('jqconsole-blurred')
  }, 100)
})


$('.runnable').each(make_runnable)
$('.highlight').each(highlight)


function make_runnable(ind, code) {
  var $code = $(code)
    , $btn = $('<button class="run-code">&#9654;</button>')

  $code.wrap('<div style="position:relative">')
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

  $code.find('span[contenteditable="true"]').on('focus', function() {
    var $tag = $(this)

    setTimeout(function() {
      $tag.selectText()
    }, 50)
  })
}

function highlight(ind, code) {
  $(code).attr('data-language', 'javascript')
  Rainbow.color(code)
}

function make_sticky($sect, $topEl, $repl) {
  var T = $topEl.offset().top
    , B = T + $sect.height() - $topEl.position().top

  window.WAT = {}

  $doc.on('scroll', function(evt) {
    var ST = $doc.scrollTop()
      , h = $repl.height()

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

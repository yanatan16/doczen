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


function make_runnable(ind, code) {
  var $code = $(code)
    , $btn = $('<button class="run-code">&#9654;</button>')

  $code.wrap('<div style="position:relative">')
  $code.parent().append($btn)

  $btn.on('click', function(evt) {
    // a bit hacky, but it works
    var $input = $(this).closest('section').data('$repl').find('textarea')
      , src = $code.html().trim()

    $input
      .text(src)
      .val(src)
      .trigger('paste')
  })
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
        $repl.css({
           top: T
          ,position: 'absolute'
        })

    } else if ((ST + h + PAD) < B) {
      if ($repl.css('position') != 'fixed')
        $repl.css({
           top: PAD
          ,position: 'fixed'
        })

    } else if ((ST + h + PAD) >= B) {
      $repl.css({
         top: B - h
        ,position: 'absolute'
      })
    }
  })
}


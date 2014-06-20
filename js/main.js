var repl = require('./repl')

var $doc = $(document)
  , $replsContainer = $('.repls')


$('.has-repl').each(function(ind, sect) {
  var $sect = $(sect)
    , $topEl = $sect.find(':not(h1,h2,h3)').first()
    , $container = repl()

  $container.css('top', $topEl.offset().top)

  
  var T = $topEl.offset().top
    , B = T + $sect.height() - $topEl.position().top

  window.WAT = {}
  WAT.topel = $topEl
  WAT.T = T
  WAT.B = B
  WAT.tpos = $topEl.position().top

  $doc.on('scroll', function(evt) {
    var ST = $doc.scrollTop()
      , h = $container.height()

    if (ST < T) {
      if ($container.css('position') != 'absolute')
        $container.css({
           top: ST
          ,left: null
          ,position: 'absolute'
        })

    } else if ((ST + h) < B) {
      if ($container.css('position') != 'fixed')
        $container.css({
           top: 0
          ,left: $replsContainer.offset().left + 40
          ,position: 'fixed'
        })

    } else if ((ST + h) >= B) {
      debugger
      $container.css({
         top: B - h
        ,left: null
        ,position: 'absolute'
      })
    }
  })


  // dirty hack
  setTimeout(function() {
    $container.find('.jqconsole').addClass('jqconsole-blurred')
  }, 100)
})

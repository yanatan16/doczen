var repl = require('./repl')

var $doc = $(document)
  , $replsContainer = $('.repls')

var PAD = 40


$('.has-repl').each(function(ind, sect) {
  var $sect = $(sect)
    , $topEl = $sect.find(':not(h1,h2,h3)').first()
    , $container = repl()

  $container.css('top', $topEl.offset().top)

  
  var T = $topEl.offset().top
    , B = T + $sect.height() - $topEl.position().top

  window.WAT = {}

  $doc.on('scroll', function(evt) {
    var ST = $doc.scrollTop()
      , h = $container.height()

    if (ST < T - PAD) {
      if ($container.css('position') != 'absolute')
        $container.css({
           top: T
          ,position: 'absolute'
        })

    } else if ((ST + h + PAD) < B) {
      if ($container.css('position') != 'fixed')
        $container.css({
           top: PAD
          ,position: 'fixed'
        })

    } else if ((ST + h + PAD) >= B) {
      $container.css({
         top: B - h
        ,position: 'absolute'
      })
    }
  })


  // dirty hack
  setTimeout(function() {
    $container.find('.jqconsole').addClass('jqconsole-blurred')
  }, 100)
})

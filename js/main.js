var repl = require('./repl')
  // , scroller = require('./scroller')

$('.has-repl').each(function(ind, sect) {
  var $topEl = $(sect).find(':not(h1,h2,h3)')
    , $container = repl()

  $container.css('top', $topEl.offset().top)

  // dirty hack
  setTimeout(function() {
    $container.find('.jqconsole').addClass('jqconsole-blurred')
  }, 100)
})

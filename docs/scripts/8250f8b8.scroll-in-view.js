$(function($) { 'use strict';
  
  function ScrollInView($el, options) {
    
    $el.on('click', function() {
        var _top = $el.offset().top - ($(window).height() / 2);
        
        $('html, body').animate({
            scrollTop: _top
        }, _top * 1.5);
        
        $el.parent().parent().find('.toggle-box').css( Modernizr.prefixed('transitionDelay') , (_top - $(window).scrollTop()) + 'ms');
        
    });
  }

  $('[data-role="scroll-in-view"]').each(function(index, el) {
    var stickyHeader = new ScrollInView($(el), $(el).data('options'));
    $(el).data('scrollinview', stickyHeader);
  });
  
});
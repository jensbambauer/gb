$(function($) { 'use strict';

  function ToggleSwitch($el, options) {

      $el.on('click', function(e) {
          if ( $('#' + $el.attr('for')).is(':checked') ) {
              $el.removeClass('toggled');
          } else {
              $el.addClass('toggled');
          }
      });

  }

  $('.toggle-switch').each(function(index, el) {
    var toggleSwitch = new ToggleSwitch($(el), $(el).data('options'));
    $(el).data('toggleswitch', toggleSwitch);
  });

});

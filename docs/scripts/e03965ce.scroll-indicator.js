/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var scrollIndicator = (function (scrollIndicator, $, undefined) {
    'use strict';

    function init($el) {
        $(window).on('scroll', function() {
            var _h = $el.height();
            $el.css("opacity", 1 - Math.min($(window).scrollTop(),_h) / _h );
        });
    }

    $('[data-role="scroll-indicator"]').each(function() {
        init($(this));
    });
    
})(scrollIndicator || {}, jQuery);

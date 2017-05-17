/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var oneHover = (function (oneHover, $, undefined) {
    'use strict';
    
    var onMouseOver = function(e) {
        var $container = e.data.$container;
        
        $container.find('.hover').removeClass('hover');
        $(this).addClass('hover');
    }
    
    var init = function() {
        $('[data-role="one-hover"]').each(function() {
            $(this).find('a').on('mouseover', {$container: $(this)} ,onMouseOver);
        });
    };

    init();
  
})(oneHover || {}, jQuery);

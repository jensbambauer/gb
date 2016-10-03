/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var imagePreloader = (function (imagePreloader, $, undefined) {
    'use strict';
    
    var onLoad = function() {
        $(this).parent().removeClass('preloading');
    }
    
    var init = function() {
        $('.preloader [data-src]').each(function() {
            $(this)
                .on('load', onLoad)
                .attr('src', $(this).data('src'));
            
        });
    };

    init();
  
})(imagePreloader || {}, jQuery);

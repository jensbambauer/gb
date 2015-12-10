/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var overlay = (function (overlay, $, undefined) {
    'use strict';
    
    function Overlay($el) {
        
        var onCloseClick = function(e) {
            e.preventDefault();
            
            close();
        };
        
        var close = function() {
            $('.overlay-container').removeClass('open');
        };
        
        var removeClose = function() {
            $('.overlay .close').remove();
        };
        
        var open = function(id) {
            $('.overlay-container').addClass('open');
            
            $('.overlay').empty()
                .append( $(id).html() )
                .append( '<a class="icon-button close">close</a>' );
            
            $('.overlay .close').one('click', onCloseClick);
        }
        
        var getOverlay = function() {
            return $('.overlay');
        }
        
        var onClick = function(e) {
            e.preventDefault();
            
            open($el.attr('href'));
        };
        
        var addBackground = function(html) {
           $('.overlay-background').append(html);
        }
        
        var init = function() {
            if ($el)
                $el.on('click', onClick);
        }

        init();
        
        return {
            open: open,
            getOverlay: getOverlay,
            close: close,
            removeClose: removeClose,
            addBackground: addBackground
        }
    }
    
    var init = function () {
        $('[data-role="overlay"]').each(function() {
            new Overlay($(this));
        });
    };

    init();
    
    return {
        api: new Overlay()
    }
    
})(overlay || {}, jQuery);

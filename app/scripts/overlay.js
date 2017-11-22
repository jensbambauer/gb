/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/

var getScrollBarWidth = function() {
  var scrollDiv = document.createElement('div');
  scrollDiv.className = 'scrollbar-measure';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

var overlay = (function (overlay, $, undefined) {
    'use strict';
    
    function Overlay($el) {
        
        var onCloseClick = function(e) {
            e.preventDefault();
            
            close();
        };
        
        var close = function() {
            $('.overlay-container').removeClass('open');
            
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '0px';
        };
        
        var removeClose = function() {
            $('.overlay .close').remove();
        };
        
        var open = function(id) {
            $('.overlay-container').addClass('open');
            
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = getScrollBarWidth() + 'px';
            
            $('.overlay').empty()
                .append( $(id).html() )
                .append( '<a class="icon-button close"><svg><use xlink:href="#icon-close"/></svg></a>' );
            
            $(document).trigger('overlay-content-ready');
            
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

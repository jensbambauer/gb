/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var photowall = (function (photowall, $, undefined) {
    'use strict';
    
    function PhotoWall($el) {
        var photos = null,
            columns = [];
        
        
        var getImage = function() {
            var randomIndex = Math.min(Math.round(Math.random() * photos.length), photos.length - 1);
            var randomPhoto =  photos[randomIndex];
            photos.splice(randomIndex, 1);
            return ['<img src="' + randomPhoto.src + '" width="256" height="'+ randomPhoto.height +'">', randomPhoto.height];
        };
        
        var initialContent = function() {
            
            $.each(columns, function() {
                $(this).prepend(getImage()[0]);
            });
            
        };
        
        var addContent = function() {
            var randomIndex = Math.min(Math.round(Math.random() * columns.length), columns.length - 1);
            var col = columns[randomIndex];
            var img = getImage();
            var y = img[1] * -1;
            
            if ( col.hasClass('overlap') ) {
                col
                    .removeClass('no-animation')
                    .removeClass('overlap')
                    .css( Modernizr.prefixed('transform'), 'translate3D(0,0,0)' );
            } else {
                
                var $img = $(img[0]);
                
                $img.on('load', function() {
                    var _y = 0;
                
                    if ( y * -1 > $el.height()) {
                        _y = y / 2;
                        col.addClass('overlap');
                    }
                
                    col
                        .removeClass('no-animation')
                        .css( Modernizr.prefixed('transform'), 'translate3D(0,'+ _y +'px,0)' )
                });
                
                col
                    .addClass('no-animation')
                    .css( Modernizr.prefixed('transform'), 'translate3D(0,' + y + 'px,0)' )
                    .prepend($img);
            }
                
        };
        
        var init = function() {

            $el.find('.col-1-4').each(function() {
                columns.push($(this));
            });

            $.get('/data/photowall.json', function(data) {
                photos = data.data;
                initialContent();
            });
            

            setInterval(function() {

                if ( photos.length > 0) {
                    addContent();
                }
            }, 4000);
        }

        init();
        
    }
    
    var init = function () {
        $('[data-role="photowall"]').each(function() {
            new PhotoWall($(this));
        });
    };

    init();
  
})(photowall || {}, jQuery);

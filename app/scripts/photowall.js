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
        var photos = [],
            photoData = null,
            columns = [],
            lastColIndex;


        var getImage = function() {
            var randomIndex = Math.min(Math.round(Math.random() * photos.length), photos.length - 1);
            var randomPhoto =  photos[randomIndex];
            photos.splice(randomIndex, 1);
            return '<img src="' + randomPhoto.src + '" width="256">';
        };

        var initialContent = function() {
            var count = columns.length;

            var addToCol = function($col) {
                var img = getImage();

                $(img).on('load', function() {
                    if ($col.height() < $el.height()) {
                        addToCol($col);
                    } else {
                        count --;
                        if (count === 0) {
                            $el.addClass('ready');
                        }
                    }
                });

                $col.prepend(img);
            };

            $.each(columns, function() {
                addToCol($(this));
            });
        };

        var randomAdd = function() {
            var randomIndex = Math.min(Math.round(Math.random() * columns.length), columns.length - 1);

            if ( randomIndex !== lastColIndex) {
                lastColIndex = randomIndex;
                addContent(randomIndex);
            } else {
                randomAdd();
            }
        };

        var addContent = function(index) {
            var col = columns[index];
            var img = getImage();

            if ( col.hasClass('overlap') ) {
                col
                    .removeClass('no-animation')
                    .removeClass('overlap')
                    .css( Modernizr.prefixed('transform'), 'translate3D(0,0,0)' );
            } else {

                var $img = $(img);

                $img.on('load', function() {
                    var y = this.height / -2;
                    var _y = 0;

                    if ( y * -1 > $el.height()) {
                        _y = y / 2;
                        col.addClass('overlap');
                    }

                    col
                        .addClass('no-animation')
                        .css( Modernizr.prefixed('transform'), 'translate3D(0,' + y + 'px,0)' )
                        .prepend(img);

                        setTimeout(function() {
                    col
                        .removeClass('no-animation')
                        .css( Modernizr.prefixed('transform'), 'translate3D(0,'+ _y +'px,0)' )
                            }, 2000);
                });


            }

        };

        var init = function() {
            var columnWidth = 256;
            var columnCount = Math.ceil($el.width() / columnWidth);

            for (var i = 0; i < columnCount; i++) {
                $el.find('.wrapper').append('<div class="col"></div>');
            }

            $el.find('.col').each(function() {
                columns.push($(this));
            });

            $.get( config.assetsPath + '/data/photowall.json', function(result) {
                photos = result.photos;
                photoData = result.photos;

                initialContent();

                if ( $el.find('.quote').length > 0) {
                    var quote = result.quotes[Math.floor(Math.random() * result.quotes.length)];

                    ko.applyBindings({quote: quote.text, author: quote.author}, $el.get(0));

                    var _height = $el.find('.quote').height();

                    $el.css('height', _height + 102);
                }
            });


            setInterval(function() {
                if ( photos.length > 0) {
                    randomAdd();
                }
            }, 4000);
        }

        init();

    }

    var init = function (e, $el) {
        $('[data-role="photowall"]').each(function() {
            new PhotoWall($(this));
        });
    };

    init({}, $(document));

    $(document).on('domupdate', init);

})(photowall || {}, jQuery);

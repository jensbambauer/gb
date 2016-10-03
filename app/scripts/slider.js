/**
 *
 * @author
 * @description
 *
 */

/*jslint browser: true*/


var slider = (function (slider, $, undefined) {
    'use strict';

    var onResize = function() {
        // var w = $('[data-role="slider"]').find('.slides .flex-active-slide .slide-content').width();
//
//         $('[data-role="slider"]').find('.slides .flex-active-slide').each(function() {
//             $(this).find('.slide-content').css({
//                 marginLeft: ($(this).width() - $(this).find('.slide-content').width()) / 2
//             });
//         });

    }

    var onImageLoad = function() {
        $(this).parent().removeClass('preloading');
    }

    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }


    var loadImage = function(el) {
        if ($(el).attr('src') === undefined) {
            $(el)
                .on('load', onImageLoad)
                .attr('src', $(el).data('src'));
        }
    }

    var loadNext = function(slider) {

        loadImage($(slider[0]).find('[data-src]')[slider.currentSlide + 1]);

        loadImage($(slider[0]).find('[data-src]')[slider.currentSlide + 2]);

    }

    var initLoading = function(slider) {
        loadImage($(slider[0]).find('[data-src]')[$(slider[0]).find('[data-src]').length - 1]);
        loadImage($(slider[0]).find('[data-src]')[1]);

        loadNext(slider);
        onResize();
    }

    var init = function(selector) {
        $(selector).each(function() {

            if ( $(this).data('order') === 'random') {
                var categories = [];
                var $el = $(this);
                var $li = $(this).find('li');

                $li.each(function() {
                    if( $.inArray($(this).attr('class'), categories) === -1) {
                        categories.push($(this).attr('class'));
                    }
                });

                var randomCategories = shuffle(categories);

                var priority = randomCategories.indexOf($(this).data('priority'));

                randomCategories.splice(priority, 1);
                randomCategories.unshift($(this).data('priority'));


                var orderedItems = new Array(randomCategories.length);

                $.each(randomCategories, function(index, cat) {

                    if(orderedItems[index] === undefined) {
                        orderedItems[index] = [];
                    }

                    $el.find('.' + cat).each(function() {
                        orderedItems[index].push($(this));
                    });

                });

                var $container = $('<div></div>');

                for (var y = 0; y < $li.length; y ++) {
                    $.each(orderedItems, function(i, cats) {

                        if ( cats.length > 0 ) {
                            $container.append(shuffle(cats).shift());
                        }

                    });
                }

                $el.find('.slides').append($container.html());
            }


            $(this).flexslider({
                animation: "slide",
                slideshow: false,
                start: initLoading,
                after: loadNext,
                nextText: '<svg><use xlink:href="#icon-arrow-right"/></svg>',
                prevText: '<svg><use xlink:href="#icon-arrow-left"/></svg>'
            });

        });

        $(window).on('resize', onResize);


    };

    init('[data-role="slider"]');

    $(document).on('overlay-content-ready', function() {
        init('[data-role="overlay-slider"]');
    });

})(slider || {}, jQuery);

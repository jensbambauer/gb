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

    var onImageLoad = function(e) {
        $(e.currentTarget).parent().removeClass('preloading');
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


    var loadImage = function(el, cb) {
        if ($(el).attr('src') === undefined) {
            $(el)
                .on('load', function(e) {
                    onImageLoad(e);
                    
                    if(cb) {
                        cb();
                    }
                })
                .attr('src', $(el).data('src'));
        }
    }

    var loadNext = function(slider) {
        loadImage($(slider[0]).find('.flex-active-slide').find('[data-src]')[0]);
        loadImage($(slider[0]).find('.flex-active-slide').next().find('[data-src]')[0]);
        loadImage($(slider[0]).find('.flex-active-slide').prev().find('[data-src]')[0]);
    }

    var initLoading = function(slider, start) {

        $(slider[0]).find('.flex-active-slide').find('img').addClass('lazyload');
        
        
        /*
        loadImage($(slider[0]).find('.flex-active-slide').find('[data-src]')[0], function() {
            loadImage($(slider[0]).find('.flex-active-slide').next().find('[data-src]')[0]);
            loadImage($(slider[0]).find('.flex-active-slide').prev().find('[data-src]')[0]);
        });
        */
    }

    var onImageLoad = function(e) {
        $(e.target).parents('li').next().find('img').addClass('lazyload');
        $(e.target).parents('li').prev().find('img').addClass('lazyload');
    };

    var init = function(selector, options) {
        
        document.addEventListener('lazybeforeunveil', onImageLoad);
        
        $(selector).each(function() {
            
            var start = parseInt($(this).data('start')) || 0;
            
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


            $(this).flexslider($.extend({
                animation: "slide",
                startAt: start,
                slideshow: false,
                start: function(slider) {
                    initLoading(slider, start)
                },
                after: loadNext,
                nextText: '<svg><use xlink:href="#icon-arrow-right"/></svg>',
                prevText: '<svg><use xlink:href="#icon-arrow-left"/></svg>'
            }, options || {}));

        });

        $(window).on('resize', onResize);


    };

    init('[data-role="slider"]');

    $(document).on('overlay-content-ready', function() {
        init('[data-role="overlay-slider"]', {
            animationLoop: false,
            slideshow: true
        });
    });

})(slider || {}, jQuery);

/**
 *
 * @author
 * @description
 *
 */

/*jslint browser: true*/


var slider = (function (slider, $, undefined) {
    'use strict';

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
//        $(e.target).parents('li').next().find('img').addClass('lazyload');
//        $(e.target).parents('li').prev().find('img').addClass('lazyload');
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
                    var cat = $(this).attr('class').split('swiper-slide ').join('');
                    
                    if( $.inArray(cat, categories) === -1) {
                        categories.push(cat);
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

/*
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
*/
            var swiperOptions = $.extend({
                speed: 400,
                spaceBetween: 0,
                autoHeight: true,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev'
           }, options || {});

            var mySwiper = new Swiper(this, swiperOptions);

            if (swiperOptions.onSlideChangeEnd) {
                swiperOptions.onSlideChangeEnd(mySwiper);
            }

            $(slider[0]).find('.flex-active-slide').find('img').addClass('lazyload');
        });
    };

    var onSlideChangeEnd = function(swiper) {
        console.log(swiper)
        $(swiper.slides[swiper.activeIndex]).find("img").addClass('lazyload');
        if(swiper.activeIndex !== swiper.slides.length) {
            $(swiper.slides[swiper.activeIndex + 1]).find("img").addClass('lazyload');
        }
        if (swiper.activeIndex > 0) {
            $(swiper.slides[swiper.activeIndex - 1]).find("img").addClass('lazyload');
        }
    }

    init('[data-role="slider-single"]', {
        loop: false,
        onSlideChangeEnd: onSlideChangeEnd
    });

    init('[data-role="slider"]', {
        loop: true,
        onSlideChangeEnd: onSlideChangeEnd
    });

    init('[data-role="slider-journal"]', {
        loop: false
    });

    $(document).on('overlay-content-ready', function() {
        init('.overlay-container [data-role="overlay-slider"]', {
            loop: false,
            autoplay: true,
            preloadImages: false,
            lazyLoading: true
        });
    });

})(slider || {}, jQuery);

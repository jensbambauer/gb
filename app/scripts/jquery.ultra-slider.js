;( function( $, window, document, undefined ) {

	"use strict";

		// Create the defaults once
		var pluginName = "ultraSlider",
			defaults = {
				slideDuration: 1800,
				onMove: function($el, positionX) {
					var active = Math.abs(parseInt(positionX / $el.width()));
					var newPositionX = Math.abs(positionX) - (active * $el.width());
					var completed = newPositionX / $el.width();

					$($el.find('.slides').children().get(active)).find('.slide-content').css({
							'transform': 'translate3d('+ newPositionX +'px,0,0) scale('+ Math.max(1 - (0.20 * completed), 0.95) +')',
							//'opacity': Math.max(Math.abs((completed - 1) * 1), 0.65),
							'-webkit-filter': 'grayscale('+ (completed * 100) +'%)',
    					'filter': 'grayscale('+ (completed * 100) +'%)'
						});
				}
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.$el = $(element);
			this.$wrapper = $(element).find('.slides');

			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend( Plugin.prototype, {
			init: function() {
				var that = this;

				this.setSlidePositions();

				// touch events
				this.$el.on('touchstart', $.proxy(this.onTouchStart, this));
				this.$el.on('touchmove', $.proxy(this.onTouchMove, this));
				this.$el.on('touchend', $.proxy(this.onTouchEnd, this));

				// click events
				this.$el.find('.prev').on('click', $.proxy(this.prevSlide, this));
				this.$el.find('.next').on('click', $.proxy(this.nextSlide, this));

				
				this.activeSlide = 0;

			},

			/*
				set the position for each slide, slides are absolute positioned
			*/
			setSlidePositions: function() {
				var that = this;

				this.$wrapper.children().each(function(index, el) {
					$(el).velocity({
							translateZ: 0,
		    			translateX: that.$el.width() * index
						}, {
							duration: 0
					});
				});

				this.positionX = this.$wrapper.find('.active-slide').position().left;
			},

			/*
				callbacks for touchevents
			*/
			onTouchStart: function(e) {
				this.touchStartX = e.originalEvent.touches[0].clientX;
				this.touchStartY = e.originalEvent.touches[0].clientY;
			},

			onTouchMove: function(e) {
				if (!this.touchDirection) {
					if (Math.abs(e.originalEvent.touches[0].clientX - this.touchStartX) > Math.abs(e.originalEvent.touches[0].clientY - this.touchStartY)) {
						this.touchDirection = 'horizontal';
					} else {
						this.touchDirection = 'vertical';
					}
				}

				// prevent scrolling when sliding
				if (this.touchDirection === 'horizontal') {
					e.preventDefault();
					this.shiftSlider(e.originalEvent.touches[0].clientX - this.touchStartX);
				}
			},

			onTouchEnd: function(e) {
				this.touchDirection = undefined;
				this.shiftEnd();
			},

			shiftSlider: function(delta) {
				var newPositionX;

				if ( !this.lastDelta ) {
					this.lastDelta = 0;
				}

				newPositionX = parseFloat($.Velocity.hook(this.$wrapper, 'translateX')) + (delta - this.lastDelta);

				this.$wrapper
					.velocity('stop')
					.velocity({
							translateZ: 0,
							translateX: newPositionX
		    			//translateX: '+=' + (delta - this.lastDelta)
						}, {
							duration: 0
					});

				this.lastDelta = delta;

				this.settings.onMove(this.$el, newPositionX);

			},

			/*
				check how much the slider has been moved and transition to the new slide
			*/
			shiftEnd: function() {
				var slideTarget = this.activeSlide;

				if ( this.lastDelta < -200 ) {
					slideTarget ++;
				}

				if ( this.lastDelta > 200 ) {
					slideTarget --;
				}

				this.lastDelta = undefined;
				this.gotoSlide(slideTarget);
			},

			prevSlide: function(e) {
				e.preventDefault();
				this.gotoSlide(this.activeSlide - 1);
			},

			nextSlide: function(e) {
				e.preventDefault();
				console.log("next");
				this.gotoSlide(this.activeSlide + 1);
			},

			/*
				transition to new slide based on the index
			*/
			gotoSlide: function(index) {
				var that = this,
						duration = (this.activeSlide === index ? that.settings.slideDuration / 2 : that.settings.slideDuration);

				$(this.$wrapper.children().removeClass('active-slide').get(index)).addClass('active-slide');

				that.activeSlide = index;

				this.positionX = this.$el.width() * index * -1;

				this.$wrapper.velocity({
						translateZ: 0,
	    			translateX: this.positionX,
						tween: this.positionX
					}, {
						easing: 'easeOutQuint',
						duration: duration,
						queue: false,
						complete: function() {

						},
						progress: function() {
							that.settings.onMove(that.$el, parseFloat($.Velocity.hook(that.$wrapper, 'translateX')));
						}
					});

			}

		} );

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, "plugin_" + pluginName ) ) {
					$.data( this, "plugin_" +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );

$(function() {
	$('.ultra-slider').ultraSlider({

	});
});

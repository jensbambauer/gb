var Swivel = (function( $, window, document, undefined ) {

    var animationEngines = [];
    
	// t: current time, b: begInnIng value, c: change In value, d: duration
	var easings = {
		easeOutQuint: function (t, b, c, d) {
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		}
	};

	function Engine(el) {
	    this.el = el;
        this.queue = [];
        this.running = false;
        this.queueStop = false;
        this.transforms = {
            translateX: 0,
            translateY: 0,
            translateZ: 0
        };
        
        this._animate = function(transforms, options) {
            var that = this;
    		var start = new Date();

    		var draw = function() {
    			var now = new Date();
    			var time = now - start;
                var currentTransforms = {};
                
                for (var translate in that.transforms) {
                    currentTransforms[translate] = transforms[translate] !== undefined ? easings[options.easing]( time, that.transforms[translate], transforms[translate] - that.transforms[translate], options.duration ) : that.transforms[translate];
                }

    			$(that.el).css({
    				'transform': 'translate3d('+ currentTransforms.translateX +'px,'+ currentTransforms.translateY +'px,'+ currentTransforms.translateZ +'px)'
    			});
                
                if (typeof(options.progress) === 'function') {
                    options.progress(that.transforms, currentTransforms, transforms);
                }
                
                
        			if ( (time + 10) < options.duration ) {
        				requestAnimationFrame(draw);
        			} else {
        				$(that.el).css({
        					'transform': 'translate3d('+ currentTransforms.translateX +'px,'+ currentTransforms.translateY +'px,'+ currentTransforms.translateZ +'px)'
        				});
                        that.transforms = currentTransforms;
                        that._startQueue();
        			}
                
    		};
    		requestAnimationFrame(draw);
        };
        
        this._transform = function(transforms) {
            var currentTransforms = {};
            var that = this;
            
            for (var translate in that.transforms) {
                currentTransforms[translate] = transforms[translate] !== undefined ? transforms[translate] : that.transforms[translate];
            }
            
			$(this.el).css({
				'transform': 'translate3d('+ currentTransforms.translateX +'px,'+ currentTransforms.translateY +'px,'+ currentTransforms.translateZ +'px)'
			});
            
            that.transforms = currentTransforms;
        },
        
        this._startQueue = function() {
            if ( this.queue.length > 0 ) {
                var current = this.queue.shift();
                this.running = true;
                
                if ( current.options.duration === 0) {
                    this._transform(current.transforms);
                } else {
                    this._animate(current.transforms , current.options );
                }
            } else {
                this.running = false;
            }
        };
	};
        
    Engine.prototype.animate = function(transforms, options) {
        var clearQueue = options.queue === false ? true : false;

        if (clearQueue) {
            this.queue = [];
            this.queueStop = true;
        }

        this.queue.push({
            transforms: transforms,
            options: options
        });


        if (!this.running || clearQueue) {
            this._startQueue();
        }
        
        return this;
    };
    
    Engine.prototype.getTransforms = function() {
        return this.transforms;
    }
    
    var getEngine = function(el) {
        var currentEngine;
        
        if (!el.getAttribute('swivel-id')) {
            currentEngine = new Engine(el);
            animationEngines.push(currentEngine);
            el.setAttribute('swivel-id', animationEngines.length - 1 );
        } else {
            currentEngine = animationEngines[+el.getAttribute('swivel-id')];
        }
        return currentEngine;
    };
    
    return {
        animate: function(el, transforms, options) {
            getEngine(el).animate(transforms, options);
            return Swivel;
        },
        getTransforms: function(el) {
            return getEngine(el).getTransforms();
        },
        stop: function() {
            console.log(2);
        }
    }

})( jQuery, window, document );


;( function( $, window, document, undefined ) {

	"use strict";

		// Create the defaults once
		var pluginName = "ultraSlider",
			defaults = {
				slideDuration: 1800,
				onMove: function($el, positionX) {
					/*
					var active = Math.abs(parseInt(positionX / $el.width()));
					var newPositionX = Math.abs(positionX) - (active * $el.width());
					var completed = newPositionX / $el.width();

					$el.find('.slides').children().find('.slide-content').css({
						'transform': 'translate3d(0,0,0)'
					});

					$($el.find('.slides').children().get(active)).find('.slide-content').css({
							'transform': 'translate3d('+ newPositionX +'px,0,0)', // scale('+ Math.max(1 - (0.50 * completed), 0.95) +')',
							'opacity': Math.max(Math.min(Math.abs((completed - 1) * 1), 1), 0.35),
							'filter': 'grayscale('+ (completed * 200) +'%)',
							//'filter': 'blur('+ (completed * 10 ) +'px)'
						});
						*/
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

				this.$el.on('mousedown', $.proxy(this.onMouseDown, this));
				this.$el.on('mousemove', $.proxy(this.onMouseMove, this));
				this.$el.on('mouseup', $.proxy(this.onMouseUp, this));


				this.activeSlide = 0;
                this.$wrapper.data('positionX', 0);
                
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
				callbacks for mouse events
			*/
			onMouseDown: function(e) {
				this.mouseStartX = e.originalEvent.layerX;
				this.$el.addClass('grabbing');
			},

			onMouseMove: function(e) {
				if (this.mouseStartX) {
					this.shiftSlider(e.originalEvent.layerX - this.mouseStartX);
				}
			},

			onMouseUp: function(e) {
				this.mouseStartX = undefined;
				this.$el.removeClass('grabbing');
				this.shiftEnd();
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

				newPositionX = Math.min( parseFloat( Swivel.getTransforms(this.$wrapper.get(0)).translateX + (delta - this.lastDelta)), 100);

				Swivel.animate(this.$wrapper.get(0), {
                        translateX: newPositionX
				    }, {
						easing: 'easeOutQuint',
						duration: 0,
						queue: false
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

				Swivel.animate(this.$wrapper.get(0), {
                        translateX: this.positionX
				    }, {
						easing: 'easeOutQuint',
						duration: duration,
						queue: false,
						complete: function() {

						},
						progress: function(a,b,c) {
//                            console.log(a.translateX,b.translateX,c.translateX);
							that.settings.onMove(that.$el, parseFloat($.Velocity.hook(that.$wrapper, 'translateX')));
						}
					});

			},

			// t: current time, b: begInnIng value, c: change In value, d: duration
			easings: {
				easeOutQuint: function (t, b, c, d) {
					return c*((t=t/d-1)*t*t*t*t + 1) + b;
				}
			},

			animate: function($el, endPositionX, options) {
				var that = this;
				var start = new Date();
				var startPositionX = $el.data('positionX') ? $el.data('positionX') : 0;
				var deltaX = endPositionX - startPositionX;

				var draw = function() {
					var now = new Date();
					var time = now - start;
					var currentPositionX = that.easings.easeOutQuint( time, startPositionX, deltaX, options.duration );

					$el.data('positionX', currentPositionX).css({
						'transform': 'translate3d('+ (currentPositionX) +'px,0,0)'
					});

					if ( (time + 10) < options.duration ) {
						requestAnimationFrame(draw);
					} else {
						$el.data('positionX', endPositionX).css({
							'transform': 'translate3d('+ endPositionX +'px,0,0)'
						});

					}
				};
				requestAnimationFrame(draw);
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

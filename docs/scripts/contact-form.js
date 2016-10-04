/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var contactForm = (function (contactForm, $, undefined) {
    'use strict';

    function init($el) {
        
        $el.find('form').on('submit', function(e) {
            e.preventDefault();
            
            $.ajax({
                url: "//formspree.io/jens.bambauer@gmx.de", 
                method: "POST",
                data: {
                    name: $el.find('.contact-name').val(),
                    email: $el.find('.contact-email').val(),                    
                    message: $el.find('.contact-text').val()
                },
                dataType: "json"
            }).then(function(data) {
                if ( data.next === '/thanks') {
                    $el.find('.contact-form').addClass('hidden');                    
                    $el.parents('.photowall').css('height', 192);
                    setTimeout(function() {
                        $el.find('.thank-you').removeClass('hidden');                    
                    }, 500);
                }
            });
        });
        
        $el.find('.contact-message button').on('click', function() {
            $el.find('.contact-message').addClass('hidden');
            $el.parents('.photowall').css('height', 392);
            setTimeout(function() {
                $el.find('.contact-form').removeClass('hidden');                    
            }, 500);
        });
        
        $el.find('.contact-form .abort').on('click', function(e) {
            e.preventDefault();
            $el.find('.contact-form').addClass('hidden');
            $el.parents('.photowall').css('height', 192);
            setTimeout(function() {
                $el.find('.contact-message').removeClass('hidden');                    
            }, 500);
        });
    }

    $('[data-role="contact-form"]').each(function() {
        init($(this));
    });
    
})(contactForm || {}, jQuery);

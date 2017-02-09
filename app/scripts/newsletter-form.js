/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var newsletterForm = (function (newsletterForm, $, undefined) {
    'use strict';
    
    function NewsletterForm($el) {
        
        $el.on('submit', onSubmit);
        
        
        function onSubmit(e) {
            e.preventDefault();
            
            var $form = $(this);
            $form.find('.error-response').text('');
            
    		$.getJSON($form.attr("action"), {EMAIL: $form.find('.email').val()}).done(function(data) {
				
    			if (data.result === 'error') {
    				onError($form, data);
    			} else {
    				onSuccess($form, data);
    			}
			
    		});
        }
        
        function onError($form, data) {
            $form.find('.error-response').html(data.msg);
        }
        
        function onSuccess($form, data) {
            
            $form.parents('.newsletter').find('.form-cols').fadeOut(300, function() {
                $form.parents('.newsletter').find('.success').text(data.msg).fadeIn(300);
            });
            
        }
        
    }
    
    var init = function () {
        $('[data-role="mailchimp-form"]').each(function() {
            new NewsletterForm($(this));
        });
        
    };

    init();
    
})(newsletterForm || {}, jQuery);

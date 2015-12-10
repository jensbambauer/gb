/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


(function ($, undefined) {
    'use strict';
    
    function RegionSelect(node) {
        var vm = this;
        
        vm.setRegion = function($data, reg) {
            overlay.api.close();

            localStorage.setItem('region', $data);
            
            $(document).trigger('regionUpdate');
            //window.location.reload();
        };
    }
    
    $('[data-ko-model="region-select"]').each(function() {
        ko.applyBindings(new RegionSelect(this), this);
    });
    
    if(!localStorage.getItem('region')) {
        $.get('/data/region-select.html', function(data) {
            $('body').append('<div class="overlay-contents">'+ data +'</div>');
            var layer = overlay.api;

            layer.open('#region-select');
            layer.removeClose();

            ko.applyBindings(new RegionSelect(this), layer.getOverlay()[0]);
        });
    } else {
        $('body').addClass('currency-' + localStorage.getItem('region'));
    }
  
})(jQuery);


            
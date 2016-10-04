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
            var layer = overlay.api;
            
            ko.cleanNode(layer.getOverlay()[0]);
            
            overlay.api.close();

            localStorage.setItem('region', $data);
            
            $('body').addClass('currency-' + $data);
            
            $(document).trigger('regionUpdate');
        };
    }
    
    function openRegionSelect() {
        $.get('/data/region-select.html', function(data) {
            $('body').append('<div class="overlay-contents">'+ data +'</div>');
            var layer = overlay.api;

            layer.open('#region-select');
            layer.removeClose();

            ko.applyBindings(new RegionSelect(this), layer.getOverlay()[0]);
        });
    }
    
    $('[data-ko-model="region-select"]').each(function() {
        ko.applyBindings(new RegionSelect(this), this);
    });
    
    $('[data-role="region-select"]').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            
            openRegionSelect();
        });
    });
    
    if(!localStorage.getItem('region')) {
        openRegionSelect();
    } else {
        $('body').addClass('currency-' + localStorage.getItem('region'));
    }
  
})(jQuery);


            
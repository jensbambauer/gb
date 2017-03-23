/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


(function ($, undefined) {
    'use strict';
    
    function ArtworkDetailsViewModel(node) {
        var vm = this;
        
        vm.priceObject = ko.observable();
        vm.price = ko.observable();
        vm.finishOptionText = ko.observable();
        vm.weight = ko.observable();
        
        vm.priceObject.subscribe(updatePrice);
        
        function updatePrice(newValue) {
            vm.price( $.parseJSON(newValue)[localStorage.getItem('region')] );
            vm.finishOptionText($(node).find('select option:selected').text());
            vm.weight($(node).find('select option:selected').data('weight'));
        }

        $(document).on('regionUpdate', function() {
            updatePrice(vm.priceObject());
        });
    }
    
    $('[data-ko-model="artwork-details"]').each(function() {
        ko.applyBindings(new ArtworkDetailsViewModel(this), this);
    });
  
})(jQuery);

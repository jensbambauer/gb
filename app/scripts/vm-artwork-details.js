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
        vm.displayPrice = ko.observable();
        vm.finishOptionText = ko.observable();
        vm.weight = ko.observable();

        vm.priceObject.subscribe(updatePrice);

        function updatePrice(newValue) {
            var price = $.parseJSON(newValue)[localStorage.getItem('region')];
            var displayPrice = price;
            if (localStorage.getItem('region') === 'eu') {
                displayPrice = Math.round(parseFloat(price) * 1.19);
            }
            vm.displayPrice(displayPrice);
            vm.price(price);
            vm.finishOptionText($(node).find('select option:selected').text());
            console.log(vm.finishOptionText())
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

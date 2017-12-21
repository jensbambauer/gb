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
        vm.id = ko.observable();
        vm.startingPrice = ko.observable();
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
            vm.id($(node).find('select option:selected').data('id'));
        }

        function updateStartingPrice() {
            var prices = [];
            $(node).find('select option').each(function() {
                prices.push($.parseJSON($(this).val())[localStorage.getItem('region')]);
            });

            var startingPrice = Math.min(...prices);
            if (localStorage.getItem('region') === 'eu') {
                startingPrice = Math.round(parseFloat(startingPrice) * 1.19);
            }
            vm.startingPrice(startingPrice);
        }

        updateStartingPrice();

        $(document).on('regionUpdate', function() {
            updatePrice(vm.priceObject());
            updateStartingPrice();
        });
    }

    $('[data-ko-model="artwork-details"]').each(function() {
        ko.applyBindings(new ArtworkDetailsViewModel(this), this);
    });
})(jQuery);

/**
 *
 * @author
 * @description
 *
 */

/*jslint browser: true*/

var FC = FC || {};
FC.override = FC.override || {};
//FC.override.debug = true;

(function ($, undefined) {
    'use strict';

    function CartItem() {
        var vm = this;
        vm.qty = ko.observable(0);
        vm.p = ko.observable(0);
        vm.displayPrice = ko.computed(function() {
            if (localStorage.getItem('region') === 'eu') {
                return Math.round(vm.p() * 1.19);
            } else {
                return vm.p();
            }
        });
        vm.increaseQty = function() {
            vm.qty(vm.qty() + 1);
        }
        vm.decreaseQty = function() {
            vm.qty(vm.qty() - 1);
        }
    }

    function FcCart() {
        var $el;

        var items = ko.observableArray([]);
        var total = ko.observable();
        var checkoutLink = ko.observable();
        var shippingCost = ko.observable();
        var totalWeight = ko.observable();
        var dhlShipping = ko.observable(false);
        var upsShipping = ko.observable(false);
        var shippingFormula = ko.observable();
        var shippingData = {};
        var region = ko.observable(localStorage.getItem('region'));

        var update = function() {
            var reg = region();
            var vat = reg === 'eu' ? 1.19 : 1;
            // TODO: nicer remove function
            items.removeAll();

            $.each(FC.json.items, function() {
                var item = new CartItem();
                $.extend(item, this);
                item.p(item.price);
                item.qty(item.quantity);
                item.qty.subscribe(function(val) {
                    updateItemQty(item, val);
                });

                // map FC options to item
                $.each(item.options, function() {
                    item[this.name] = this.value;
                });

                if ( item.name !== 'shipping') {
                    items.push(item);
                }

            });

            totalWeight(FC.json.total_weight);
            var shipping = calcShippingPrice();

            shippingCost(shipping);

            total(Math.round((FC.json.total_item_price * vat)) + shipping);

            // update navigaiton link
            $('[data-role="toggle-cart"]')
                .attr('data-item-count', FC.json.item_count);

            if(items().length) {
                $('[data-role="toggle-cart"]').addClass('hasItems');
            } else {
                closeCart();
                $('[data-role="toggle-cart"]').removeClass('hasItems');
            }
        };

        var shippingTable = {
            "small_print": {
                "eu": 36,
                "usa": 64,
                "world": 96
            },
             "small_dibond": {
                "eu": 45,
                "usa": 124,
                "world": 254
            },
            "small_frame": {
                "eu": 46,
                "usa": 136,
                "world": 277
            },
            "large_print": {
                "eu": 57,
                "usa": 126,
                "world": 230
            },
            "large_dibond": {
                "eu": 148,
                "usa": 296,
                "world": 500
            },
            "large_frame": {
                "eu": 148,
                "usa": 296,
                "world": 500
            }
        }
        var shippingDhl = {
            "eu": 17,
            "usa": 36,
            "world": 46
        }
        var calcShippingPrice = function() {
            var shippingPrices = [];
            var shippingPricesPrints = [];
            var dhlQualified = true;

            $.each(FC.json.items, function() {
                var finish_id = '';
                var regionPriceIdentifier = localStorage.getItem('region');

                $.each(this.options, function() {
                    if (this.name === 'internal id') {
                        finish_id = this.value;
                    }
                });

                if (finish_id === 'large_print') {
                    dhlQualified = false;
                }

                for (var i = 0; i < this.quantity; i++) {
                    if (finish_id.indexOf('print') > -1) {
                        shippingPricesPrints.push(shippingTable[finish_id][regionPriceIdentifier]);
                    } else {
                        shippingPrices.push(shippingTable[finish_id][regionPriceIdentifier]);
                    }
                }
            });

            var shippingPricePrints = shippingPricesPrints.length > 0 ? shippingPricesPrints[shippingPricesPrints.indexOf(Math.max(...shippingPricesPrints))] : 0;
            var shippingPriceNonPrint = shippingPrices.reduce((a,b) => a+b, 0);
            var vat = localStorage.getItem('region') === 'eu' ? 1.19 : 1;
            var discount = 1;

            if (shippingPriceNonPrint === 0 && dhlQualified) {
                // DHL shipping overwrite
                shippingPricePrints = shippingDhl[localStorage.getItem('region')];
                vat = 1;
                upsShipping(false);
                dhlShipping(true);
            } else {
                upsShipping(true);
                dhlShipping(false);

                if (FC.json.item_count === 1 && localStorage.getItem('region') === 'eu') {
                    discount = 0.85;
                }

                if (FC.json.item_count > 1) {
                    var base_discount = 0.1;
                    var item_discount = 0.1;
                    var max_discount = 0.5;

                    if (localStorage.getItem('region') === 'eu') {
                        base_discount = 0.2;
                        item_discount = 0.075;
                    }
                    if (localStorage.getItem('region') === 'world') {
                        base_discount = 0.2;
                        max_discount = 0.65;
                    }
                    discount = 1 - Math.min((base_discount) + (item_discount * shippingPrices.length), max_discount);
                }
            }
            return Math.round(((shippingPriceNonPrint * discount) + shippingPricePrints) * vat);
            /*
            var reg = region();
            var tablePrice;
            var insurance;
            var vat = reg === 'eu' ? 1.19 : 1;
            var formula;
            var shippingPrice;

            if ( totalWeight() > 5) { // UPS or DHL

                if ( reg === 'eu' && FC.json.item_count > 2) {
                    reg = 'eu_multiple';
                }

                insurance = (FC.json.total_item_price) * (shippingData.zones[reg].insurance / 100);

                tablePrice = shippingData.zones[reg].kgPrice[Math.ceil(FC.json.total_weight - 1)];

                formula = '(tableprice(' + tablePrice + ') + insurance(' + insurance + ' (itemprice * '+shippingData.zones[reg].insurance / 100+')) + fuel(' + tablePrice + ' * ' + shippingData.zones[reg].fuel / 100 + ' = '+ tablePrice * (shippingData.zones[reg].fuel / 100) +')) * vat('+ vat +')';
                shippingFormula(formula);

                shippingPrice = (tablePrice + insurance + tablePrice * (shippingData.zones[reg].fuel / 100)) * vat;
            } else {
                if ( reg === 'eu') {
                    shippingPrice = 16.19;
                } else if (reg === 'usa') {
                    shippingPrice = 35.69;
                } else if (reg === 'world') {
                    shippingPrice = 43.69;
                }
            }

            return Math.ceil(shippingPrice);
            */
        }

        var removeCartItem = function() {
            cartRequest('&cart=update&quantity=0&id=' + this.id, true);
        }

        var updateItemQty = function(item) {
            cartRequest('&cart=update&quantity='+ item.qty() +'&id=' + item.id, true);
        }

        var cartRequest = function(options, updateCart, callback) {
            FC.client.request('https://'+FC.settings.storedomain+'/cart?' + options ).done(function(data) {
                if ( updateCart ) {
                    update();
                }
                if ( typeof(callback) === 'function') {
                    callback(data);
                }
            });
        };

        var toggleCart = function(e) {
            if ( e !== undefined) {
                e.preventDefault();
            }

            $el.toggleClass('open');
            $('#navigation-toggle').attr('checked', !$el.hasClass('open'));
        };

        var closeCart = function() {
            $el.removeClass('open');
        }

        var deleteShippingItem = function(callback) {
            var shippingItem;

            // delete previous shipping item
            $.each(FC.json.items, function() {
                if ( this.name === 'Shipping & Handling') {
                    shippingItem = this;
                }
            });

            if ( shippingItem ) {
                cartRequest('&cart=update&quantity=0&id=' + shippingItem.id, false, callback);
            } else {
                callback();
            }
        }

        var checkout = function() {
            var region = localStorage.getItem('region');
            var shipping = {
                quantity: 1,
                name: "Shipping & Handling",
                price: region === 'eu' ?
                    (totalWeight() < 5 ? calcShippingPrice : calcShippingPrice() / 1.19) :
                    calcShippingPrice(),
                category: region === 'eu' && totalWeight() > 5 ? 'DEFAULT' : 'shipping'
            };

            cartRequest($.param(shipping), false, function() {
                window.location = 'http://' + FC.settings.storedomain + '/checkout?' + FC.session.get();
            });

        }

        var init = function() {

            $el = $('.overlay-cart');

            $('[data-role="toggle-cart"]').on('click', toggleCart);

            checkoutLink('http://' + FC.settings.storedomain + '/checkout?' + FC.session.get());

            //FC.client.request('https://'+FC.settings.storedomain+'/cart?name=shipping&price=10&size=asdf&edition=asf&finish=aa&quantity=1');

            deleteShippingItem(function() {
                if(region()) {
                    update();
                }
            });

        };

        $(document).on('regionUpdate', function() {
            region(localStorage.getItem('region'));
            if (FC.json.item_count > 0) {
                FC.session.reset();
                location.reload();
            }
        });

        init();

        return {
            update: update,
            toggle: toggleCart,
            items: items,
            total: total,
            checkoutLink: checkoutLink,
            removeCartItem: removeCartItem,
            updateItemQty: updateItemQty,
            shippingCost: shippingCost,
            region: region,
            checkout: checkout,
            totalWeight: totalWeight,
            upsShipping: upsShipping,
            dhlShipping: dhlShipping,
            shippingFormula: shippingFormula
        }

    }

    function FcCartAdd($el, cart) {

        var add = function(e) {
            e.preventDefault();
        };

        var onSubmit = function(e) {
            e.preventDefault();
            addToCart($el.serialize());
        };

        var addToCart = function( options ) {
            FC.client.request('//'+FC.settings.storedomain+'/cart?' + options ).done(function() {
                cart.update();
                cart.toggle();
            });
        };

        var init = function() {
            if ( $el.is('form') ) {
                $el.on('submit', onSubmit);
            }
        };

        init();

    }

    var init = function () {

        var cart = new FcCart();

        ko.applyBindings(cart, $('.overlay-cart').get(0));

        $('[data-role="fc-cart-add"]').each(function() {
            new FcCartAdd($(this), cart);
        });

        $('[data-role="add-to-cart-form"]').each(function() {
            new FcCartAdd($(this), cart);
        });

        $('[data-role="checkout"]').each(function() {
            new FcCartCheckout($(this), cart);
        });

        FC.client.on('cart-update', function() {
            //console.log('update');
        });

        $(document).on('regionUpdate', function() {
            // TODO: clear cart
        });

    };

    FC.onLoad = function () {
    	FC.client.on('ready.done', function () {
    		init();
    	});

    };

    $.getScript('//cdn.foxycart.com/geebeedev/foxycart.jsonp.min.1439929745.js');

})(jQuery);

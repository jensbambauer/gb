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
    
    function FcCart() {
        var $el;
        
        var items = ko.observableArray([]);
        var total = ko.observable();
        var checkoutLink = ko.observable();
        var shippingCost = ko.observable();
        var totalWeight = ko.observable();
        var shippingFormula = ko.observable();
        var shippingData = {};
        var region = ko.observable(localStorage.getItem('region'));
        
        var update = function() {
            
            // TODO: nicer remove function
            items.removeAll();
            
            $.each(FC.json.items, function() {
                var item = this;

                // map FC options to item
                $.each(item.options, function() {
                    item[this.name] = this.value;
                });

                if ( item.name !== 'shipping') {
                    items.push(item);
                }
            });
            
            var shipping = calcShippingPrice();
            
            shippingCost(shipping);
            totalWeight(FC.json.total_weight);
            
            total(FC.json.total_item_price + shipping);
        };
        
        var calcShippingPrice = function() {
            var reg = region();
            var tablePrice;
            var insurance;
            var vat = region() === 'eu' ? 1.19 : 1;
            var formula;
            
            if ( reg === 'eu' && FC.json.item_count > 2) {
                reg = 'eu_multiple';
            }

            insurance = (FC.json.total_item_price / vat) * (shippingData.zones[reg].insurance / 100);
            
            tablePrice = shippingData.zones[reg].kgPrice[Math.ceil(FC.json.total_weight - 1)];
            
            formula = '(tableprice(' + tablePrice + ') + insurance(' + insurance + ' (netto itemprice * '+shippingData.zones[reg].insurance / 100+')) + fuel(' + tablePrice + ' * ' + shippingData.zones[reg].fuel / 100 + ' = '+ tablePrice * (shippingData.zones[reg].fuel / 100) +')) * vat('+ vat +')';
            shippingFormula(formula);
            
            return (tablePrice + insurance + tablePrice * (shippingData.zones[reg].fuel / 100)) * vat;
        }
        
        var removeCartItem = function() {
            cartRequest('&cart=update&quantity=0&id=' + this.id, true);
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
        };
        
        var deleteShippingItem = function(callback) {
            var shippingItem;
            
            // delete previous shipping item
            $.each(FC.json.items, function() {
                if ( this.name === 'shipping') {
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
            var shipping = {
                quantity: 1,
                name: "shipping",
                price: calcShippingPrice(),
                weight: 0
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
                $.get('/data/ups.json', function(data) {
                    shippingData = data;
                    if(region()) {
                        update();
                    }
                });
            });
            
        };
        
        $(document).on('regionUpdate', function() {
            region(localStorage.getItem('region'));
        });
        
        init();
        
        return {
            update: update,
            toggle: toggleCart,
            items: items,
            total: total,
            checkoutLink: checkoutLink,
            removeCartItem: removeCartItem,
            shippingCost: shippingCost,
            region: region,
            checkout: checkout,
            totalWeight: totalWeight,
            shippingFormula: shippingFormula
        }
        
    }
    
    function FcCartAdd($el, cart) {

        var add = function(e) {
            e.preventDefault();
            
        }
        
        var onSubmit = function(e) {
            e.preventDefault();
            addToCart($el.serialize());
        }
        
        var addToCart = function( options ) {
            FC.client.request('https://'+FC.settings.storedomain+'/cart?' + options ).done(function() {
                cart.update();
                cart.toggle();
            });
        }
        
        var init = function() {
            if ( $el.is('form') ) {
                $el.on('submit', onSubmit);
            }
        }

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
            console.log('update');
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
    
})(jQuery);
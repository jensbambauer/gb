/**
 *
 * @author
 * @description
 *
 */
 
/*jslint browser: true*/


var selectbox = (function (selectbox, $, undefined) {
    'use strict';
    
    var init = function () {
        $('[data-role="selectbox"]').chosen({disable_search_threshold: 10});
    };

    init();
  
})(selectbox || {}, jQuery);

'use strict';

var fs = require('fs');

/**
 * {{include}}, alternative to {{> partial }}
 *
 * @param  {String} `name` The name of the partial to use
 * @param  {Object} `context` The context to pass to the partial
 * @return {String} Returns compiled HTML
 * @xample: {{include 'foo' bar}}
 */

module.exports.register = function(Handlebars, options, params) {
    Handlebars.registerHelper('includeSvgSprite', function(path) {
        var content = fs.readFileSync(path, 'utf8').split('<svg').join('<svg style="display: none;"');

        return new Handlebars.SafeString(content.replace(/^\s+|\s+$/g, ''));
    });
};

/// <reference path="./Util.ts" />
/// <reference path="./Core.ts" />

$.fn.extend({
    ripple: function(opt) {
        // If not supporting Browsers, finish it
        if(! im.sush.ripple.Util.caniuse()) {
            return $(this)
        }

        // Setting Event for each DOM
        $(this).each(function() {
            new im.sush.ripple.Core($(this), opt)
        })

        return $(this)
    }
})
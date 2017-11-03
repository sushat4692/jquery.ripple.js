/**
 * jquery.ripple.js
 * 
 * @version 0.1.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.ripple.js
 */
module im.sush.ripple {
    export class Util
    {
        static support:
            {
                isInit: boolean
                borderRadius: boolean
                transition: boolean
            } = {
                isInit: false,
                borderRadius: false,
                transition: false
            }
        static $textSpan:JQuery =
            $('<div>').css({position: 'relative', 'z-index': 2})
        static $rippleWrap:JQuery =
            $('<div>', { 'class': 'rippleWrap' } )
                .css({
                    display: 'block',
                    position: 'absolute',
                    zIndex: 1,
                    left: 0,
                    top: 0,
                    overflow: 'hidden'
                }).append(
                    $('<span>', {'class': 'rippleAnimate'})
                        .css({
                            display: 'block',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: 0,
                            height: 0,
                            borderRadius: '50%',
                            WebkitBorderRadius: '50%',
                            MozBorderRadius: '50%',
                            MsBorderRadius: '50%'
                        })
                )

        /**
         * Checking supported browser
         * 
         * @return boolean
         */
        static caniuse(): boolean
        {
            if(! Util.support.isInit) {
                $.each(['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'], function(i, v) {
                    if(document.body.style[v] !== undefined) Util.support.borderRadius = true
                    return (! Util.support.borderRadius)
                } )

                var el = $("<div>")
                Util.support.transition = typeof el.css("transitionProperty") === "string"

                Util.support.isInit = true
            }

            return Util.support.borderRadius && Util.support.transition
        }
    }
}
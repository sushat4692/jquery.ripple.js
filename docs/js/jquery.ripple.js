/**
 * jquery.ripple.js
 *
 * @version 0.1.0
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.ripple.js
 */
var im;
(function (im) {
    var sush;
    (function (sush) {
        var ripple;
        (function (ripple) {
            var Util = /** @class */ (function () {
                function Util() {
                }
                /**
                 * Checking supported browser
                 *
                 * @return boolean
                 */
                Util.caniuse = function () {
                    if (!Util.support.isInit) {
                        $.each(['borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'], function (i, v) {
                            if (document.body.style[v] !== undefined)
                                Util.support.borderRadius = true;
                            return (!Util.support.borderRadius);
                        });
                        var el = $("<div>");
                        Util.support.transition = typeof el.css("transitionProperty") === "string";
                        Util.support.isInit = true;
                    }
                    return Util.support.borderRadius && Util.support.transition;
                };
                Util.support = {
                    isInit: false,
                    borderRadius: false,
                    transition: false
                };
                Util.$textSpan = $('<div>').css({ position: 'relative', 'z-index': 2 });
                Util.$rippleWrap = $('<div>', { 'class': 'rippleWrap' })
                    .css({
                    display: 'block',
                    position: 'absolute',
                    zIndex: 1,
                    left: 0,
                    top: 0,
                    overflow: 'hidden'
                }).append($('<span>', { 'class': 'rippleAnimate' })
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
                }));
                return Util;
            }());
            ripple.Util = Util;
        })(ripple = sush.ripple || (sush.ripple = {}));
    })(sush = im.sush || (im.sush = {}));
})(im || (im = {}));
/// <reference path="./Util.ts" />
var im;
(function (im) {
    var sush;
    (function (sush) {
        var ripple;
        (function (ripple) {
            var Core = /** @class */ (function () {
                /**
                 * Constructor
                 *
                 * @param target JQuery
                 * @param param number
                 */
                function Core(target, param) {
                    this.v_duration = 400;
                    this.h_duration = 400;
                    this.timer = null;
                    this.$target = target;
                    // Check Parameters
                    // If there is "v_duration" param
                    if (param !== undefined &&
                        Object.prototype.hasOwnProperty.call(param, 'v_duration')) {
                        this.set_view_duration(param.v_duration);
                    }
                    // If there is "h_duration" param
                    if (param !== undefined &&
                        Object.prototype.hasOwnProperty.call(param, 'h_duration')) {
                        this.set_hide_duration(param.h_duration);
                    }
                    // Initialize
                    this.init();
                }
                /**
                 * Setting View animation duration
                 *
                 * @param param number
                 * @return im.sush.ripple.Core
                 */
                Core.prototype.set_view_duration = function (param) {
                    this.v_duration = param;
                    return this;
                };
                /**
                 * Setting Hide animation duration
                 *
                 * @param param number
                 * @return im.sush.ripple.Core
                 */
                Core.prototype.set_hide_duration = function (param) {
                    this.h_duration = param;
                    return this;
                };
                /**
                 * Initialize
                 *
                 * @return void
                 */
                Core.prototype.init = function () {
                    // If target object's position style is "static"
                    // Replace to "relative"
                    if (this.$target.css('position') === 'static') {
                        this.$target.css('position', 'relative');
                    }
                    // Remove highlight style for SmartPhone
                    this.$target.css('-webkit-tap-highlight-color', 'rgba( 0, 0, 0, 0 )');
                    // Add Necessary Doms
                    this.$target.wrapInner(im.sush.ripple.Util.$textSpan);
                    this.$target.append(im.sush.ripple.Util.$rippleWrap.clone());
                    // Add to variables
                    this.$rippleWrap = this.$target.find('.rippleWrap');
                    this.$rippleAnimate = this.$target.find('.rippleAnimate');
                    // Setting style to Mask DOM
                    // border-radius
                    this.$rippleWrap.css({
                        borderTopLeftRadius: this.$target.css('BorderTopLeftRadius'),
                        borderTopRightRadius: this.$target.css('BorderTopRightRadius'),
                        borderBottomLeftRadius: this.$target.css('BorderBottomLeftRadius'),
                        borderBottomRightRadius: this.$target.css('BorderBottomRightRadius'),
                        WebkitBorderTopLeftRadius: this.$target.css('WebkitBorderTopLeftRadius'),
                        WebkitBorderTopRightRadius: this.$target.css('WebkitBorderTopRightRadius'),
                        WebkitBorderBottomLeftRadius: this.$target.css('WebkitBorderBottomLeftRadius'),
                        WebkitBorderBottomRightRadius: this.$target.css('WebkitBorderBottomRightRadius'),
                        MozBorderTopLeftRadius: this.$target.css('MozBorderTopLeftRadius'),
                        MozBorderTopRightRadius: this.$target.css('MozBorderTopRightRadius'),
                        MozBorderBottomLeftRadius: this.$target.css('MozBorderBottomLeftRadius'),
                        MozBorderBottomRightRadius: this.$target.css('MozBorderBottomRightRadius'),
                        MsBorderTopLeftRadius: this.$target.css('MsBorderTopLeftRadius'),
                        MsBorderTopRightRadius: this.$target.css('MsBorderTopRightRadius'),
                        MsBorderBottomLeftRadius: this.$target.css('MsBorderBottomLeftRadius'),
                        MsBorderBottomRightRadius: this.$target.css('MsBorderBottomRightRadius')
                    });
                    // Border
                    var top = +this.$target.css('border-top-width').replace('px', '');
                    var left = +this.$target.css('border-left-width').replace('px', '');
                    this.$rippleWrap.css({ 'top': -top, 'left': -left });
                    // Setting Color
                    this.$rippleAnimate
                        .css('background-color', this.$target.attr('data-color'));
                    // Setting Event
                    if (('ontouchstart' in window)) {
                        this.$target.on('touchstart.ripple', function (e) {
                            this.view(e.originalEvent.touches[0]);
                        }.bind(this));
                        this.$target.on('touchend.ripple', function (e) {
                            this.hidden(e.originalEvent.touches[0]);
                        }.bind(this));
                        this.$target.on('mouseleave.ripple', this.hidden.bind(this));
                    }
                    else {
                        this.$target.on('mousedown.ripple', this.view.bind(this));
                        this.$target.on('mouseup.ripple mouseleave.ripple', this.hidden.bind(this));
                    }
                };
                /**
                 * Viwing Animation
                 *
                 * @param e MouseEvent
                 */
                Core.prototype.view = function (e) {
                    // Remove Timer
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    // Getting Mask Object size
                    var width = this.$target.outerWidth();
                    var height = this.$target.outerHeight();
                    this.$rippleWrap
                        .stop(true, false)
                        .width(width).height(height)
                        .css({
                        'opacity': 1,
                        'transition': 'none',
                        '-webkit-transition': 'none',
                        '-moz-transition': 'none',
                        '-ms-transition': 'none'
                    });
                    // Setting Size
                    var circleRatio = 2.8;
                    var size = Math.max(width, height);
                    // Getting Mouse position
                    var offsetX = e.pageX - this.$target.offset().left;
                    var offsetY = e.pageY - this.$target.offset().top;
                    this.$rippleAnimate.css({
                        'width': size,
                        'height': size,
                        'transform': 'scale3d(0, 0, 1)',
                        '-webkit-transform': 'scale3d(0, 0, 1)',
                        '-moz-transform': 'scale3d(0, 0, 1)',
                        '-ms-transform': 'scale3d(0, 0, 1)',
                        'left': offsetX - size / 2,
                        'top': offsetY - size / 2,
                        'transition': 'none',
                        '-webkit-transition': 'none',
                        '-moz-transition': 'none',
                        '-ms-transition': 'none'
                    });
                    setTimeout(function () {
                        // Animate to style
                        var animateTo = {
                            'transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                            '-webkit-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                            '-moz-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                            '-ms-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                            'transition': (this.v_duration / 1000) + 's ease-out',
                            '-webkit-transition': (this.v_duration / 1000) + 's ease-out',
                            '-moz-transition': (this.v_duration / 1000) + 's ease-out',
                            '-ms-transition': (this.v_duration / 1000) + 's ease-out'
                        };
                        // Starting Animation
                        this.$rippleAnimate.show().css(animateTo);
                    }.bind(this), 1);
                };
                /**
                 * Hiding Animation
                 *
                 * @param e MouseEvent
                 */
                Core.prototype.hidden = function (e) {
                    // Animating that reduce opacity for $rippleWrap
                    this.$rippleWrap.stop(true, false).css({
                        'opacity': 0,
                        'transition': 'opacity ' + (this.h_duration / 1000) + 's ease-out',
                        '-webkit-transition': 'opacity ' + (this.h_duration / 1000) + 's ease-out',
                        '-moz-transition': 'opacity ' + (this.h_duration / 1000) + 's ease-out',
                        '-ms-transition': 'opacity ' + (this.h_duration / 1000) + 's ease-out'
                    });
                    // When finished animating, resiging ripple DOM
                    if (this.timer) {
                        clearTimeout(this.timer);
                    }
                    this.timer = setTimeout(function () {
                        this.$rippleWrap.css({ 'opacity': 1, 'transition': 'none' });
                        this.$rippleAnimate.css({
                            'transform': 'scale3d( 0, 0, 1 )',
                            '-webkit-transform': 'scale3d( 0, 0, 1 )',
                            '-moz-transform': 'scale3d( 0, 0, 1 )',
                            '-ms-transform': 'scale3d( 0, 0, 1 )',
                            'transition': 'none',
                            '-webkit-transition': 'none',
                            '-moz-transition': 'none',
                            '-ms-transition': 'none'
                        });
                    }.bind(this), this.v_duration);
                };
                return Core;
            }());
            ripple.Core = Core;
        })(ripple = sush.ripple || (sush.ripple = {}));
    })(sush = im.sush || (im.sush = {}));
})(im || (im = {}));
/// <reference path="./Util.ts" />
/// <reference path="./Core.ts" />
$.fn.extend({
    ripple: function (opt) {
        // If not supporting Browsers, finish it
        if (!im.sush.ripple.Util.caniuse()) {
            return $(this);
        }
        // Setting Event for each DOM
        $(this).each(function () {
            new im.sush.ripple.Core($(this), opt);
        });
        return $(this);
    }
});

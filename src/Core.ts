/// <reference path="./Util.ts" />

module im.sush.ripple {
    export class Core
    {
        $target: JQuery
        $rippleWrap: JQuery
        $rippleAnimate: JQuery

        v_duration: number = 400
        h_duration: number = 400
        timer: number = null

        /**
         * Constructor
         * 
         * @param target JQuery
         * @param param number
         */
        constructor(
            target: JQuery,
            param: {v_duration: number, h_duration: number}
        )
        {
            this.$target = target;

            // Check Parameters

            // If there is "v_duration" param
            if(
                param !== undefined &&
                Object.prototype.hasOwnProperty.call(param, 'v_duration')
            ) {
                this.set_view_duration(param.v_duration)
            }

            // If there is "h_duration" param
            if(
                param !== undefined &&
                Object.prototype.hasOwnProperty.call(param, 'h_duration')
            ) {
                this.set_hide_duration(param.h_duration)
            }

            // Initialize
            this.init()
        }

        /**
         * Setting View animation duration
         * 
         * @param param number
         * @return im.sush.ripple.Core
         */
        set_view_duration(param: number)
        {
            this.v_duration = param
            return this
        }

        /**
         * Setting Hide animation duration
         * 
         * @param param number
         * @return im.sush.ripple.Core
         */
        set_hide_duration(param: number)
        {
            this.h_duration = param
            return this
        }

        /**
         * Initialize
         * 
         * @return void
         */
        init()
        {
            // If target object's position style is "static"
            // Replace to "relative"
            if(this.$target.css('position') === 'static') {
                this.$target.css('position', 'relative')
            }
            // Remove highlight style for SmartPhone
            this.$target.css('-webkit-tap-highlight-color', 'rgba( 0, 0, 0, 0 )')

            // Add Necessary Doms
            this.$target.wrapInner(im.sush.ripple.Util.$textSpan)
            this.$target.append(im.sush.ripple.Util.$rippleWrap.clone())

            // Add to variables
            this.$rippleWrap = this.$target.find('.rippleWrap')
            this.$rippleAnimate = this.$target.find('.rippleAnimate')

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
            })

            // Border
            const top:number  =
                +this.$target.css('border-top-width').replace('px', '')
            const left:number =
                +this.$target.css('border-left-width').replace('px', '')
            this.$rippleWrap.css({'top': -top, 'left': -left})
            
            // Setting Color
            this.$rippleAnimate
                .css('background-color', this.$target.attr('data-color'))

            // Setting Event
            if(('ontouchstart' in window)) {
                this.$target.on('touchstart.ripple', function(e) {
                    this.view(e.originalEvent.touches[0])
                }.bind(this))
                this.$target.on('touchend.ripple', function(e) {
                    this.hidden(e.originalEvent.touches[0])
                }.bind(this))
                this.$target.on('mouseleave.ripple', this.hidden.bind(this))
            } else {
                this.$target.on('mousedown.ripple', this.view.bind(this))
                this.$target.on(
                    'mouseup.ripple mouseleave.ripple',
                    this.hidden.bind(this)
                )
            }
        }

        /**
         * Viwing Animation
         * 
         * @param e MouseEvent
         */
        view(e:MouseEvent)
        {
            // Remove Timer
            if(this.timer) {
                clearTimeout(this.timer)
            }

            // Getting Mask Object size
            const width  = this.$target.outerWidth()
            const height = this.$target.outerHeight()
            this.$rippleWrap
                .stop(true, false)
                .width(width).height(height)
                .css({
                    'opacity': 1,
                    'transition': 'none',
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none'
                })
            
            // Setting Size
            const circleRatio = 2.8
            const size        = Math.max(width, height)

            // Getting Mouse position
            const offsetX = e.pageX - this.$target.offset().left
            const offsetY = e.pageY - this.$target.offset().top
            this.$rippleAnimate.css({
                'width': size,
                'height': size,
                'transform': 'scale3d(0, 0, 1)',
                '-webkit-transform': 'scale3d(0, 0, 1)',
                '-moz-transform': 'scale3d(0, 0, 1)',
                '-ms-transform': 'scale3d(0, 0, 1)',
                'left': offsetX-size/2,
                'top': offsetY-size/2,
                'transition': 'none',
                '-webkit-transition': 'none',
                '-moz-transition': 'none',
                '-ms-transition': 'none'
            })

            setTimeout(function() {
                // Animate to style
                let animateTo = {
                    'transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                    '-webkit-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                    '-moz-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                    '-ms-transform': 'scale3d(' + circleRatio + ', ' + circleRatio + ', 1)',
                    'transition': (this.v_duration/1000)+'s ease-out',
                    '-webkit-transition': (this.v_duration/1000)+'s ease-out',
                    '-moz-transition': (this.v_duration/1000)+'s ease-out',
                    '-ms-transition': (this.v_duration/1000)+'s ease-out'
                }

                // Starting Animation
                this.$rippleAnimate.show().css(animateTo)
            }.bind(this), 1)
        }

        /**
         * Hiding Animation
         * 
         * @param e MouseEvent
         */
        hidden(e:MouseEvent)
        {
            // Animating that reduce opacity for $rippleWrap
            this.$rippleWrap.stop(true, false).css({
                'opacity': 0,
                'transition': 'opacity '+( this.h_duration/1000 )+'s ease-out',
                '-webkit-transition': 'opacity '+( this.h_duration/1000 )+'s ease-out',
                '-moz-transition': 'opacity '+( this.h_duration/1000 )+'s ease-out',
                '-ms-transition': 'opacity '+( this.h_duration/1000 )+'s ease-out'
            })

            // When finished animating, resiging ripple DOM
            if(this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = setTimeout(function() {
                this.$rippleWrap.css({'opacity': 1, 'transition': 'none'})
                this.$rippleAnimate.css({
                    'transform': 'scale3d( 0, 0, 1 )',
                    '-webkit-transform': 'scale3d( 0, 0, 1 )',
                    '-moz-transform': 'scale3d( 0, 0, 1 )',
                    '-ms-transform': 'scale3d( 0, 0, 1 )',
                    'transition': 'none',
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none'
                })
            }.bind(this), this.v_duration)
        }
    }
}
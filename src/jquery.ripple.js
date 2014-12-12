/**
 * jquery.ripple.js
 * 
 * @version 0.0.1
 * @author SUSH <sush@sus-happy.ner>
 * https://github.com/sus-happy/jquery.ripple.js
 */

( function( $, U ) {
    // border-radiusが使えるか？
    $.support.borderRadius = false;
    $( function() {
        $.each( [ 'borderRadius', 'BorderRadius', 'MozBorderRadius', 'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius' ], function( i, v ) {
            if( document.body.style[v] !== undefined ) $.support.borderRadius = true;
            return (! $.support.borderRadius );
        } );
    } );

    $.extend( {
        // jquery.ripple用の関数
        ripple: {
            // アニメーションの裏に隠れないようにするDOM
            $textSpan: $('<span>').css( { position: 'relative', 'z-index': 2 } ),
            // アニメーション用のDOM
            $rippleWrap: $('<span>', { 'class': 'rippleWrap' } ).css( { position: 'absolute', 'z-index': 1, 'left': 0, 'top': 0, 'overflow': 'hidden' } ).append(
                            $('<span>', { 'class': 'rippleAnimate' } ).css( { position: 'absolute', 'left': 0, 'top': 0, 'border-radius': '50%' } )
                         ),
            // jquery.rippleが利用できるか？
            is: function() {
                return $.support.borderRadius;
            },
            // coreクラス
            core: function( target, param ) {
                this.$target   = target;
                this._v_duration = 400;
                this._h_duration = 400;

                // paramに値があれば設定変更
                if( param !== U && Object.prototype.hasOwnProperty.call( param, 'v_duration' ) ) {
                    this.set_view_duration( param.v_duration );
                }
                if( param !== U && Object.prototype.hasOwnProperty.call( param, 'h_duration' ) ) {
                    this.set_hide_duration( param.h_duration );
                }

                // イベント初期設定
                this.init();
            }
        }
    } );

    // coreクラスを拡張しておく
    $.ripple.core.prototype = {
        // 設定変更
        set_view_duration: function( v_duration ) {
            this._v_duration = v_duration;
        },
        set_hide_duration: function( h_duration ) {
            this._h_duration = h_duration;
        },

        // イベント初期設定
        init: function() {
            var that = this;

            // position staticだったらrelativeにしておく
            if( this.$target.css( 'position' ) === 'static' ) {
                this.$target.css( 'position', 'relative' );
            }
            // スマホ端末のハイライトを切る
            this.$target.css( '-webkit-tap-highlight-color', 'rgba( 0, 0, 0, 0 )' );

            // 必要DOMを追加
            this.$target.wrapInner( $.ripple.$textSpan );
            this.$target.append( $.ripple.$rippleWrap.clone() );

            // 必要DOMを変数に入れておく
            this.$rippleWrap    = this.$target.find( '.rippleWrap' );
            this.$rippleAnimate = this.$target.find( '.rippleAnimate' );

            // 色を指定
            this.$target.find( '.rippleAnimate' ).css( 'background-color', this.$target.attr( 'data-color' ) );

            // イベントを登録
            if( ('ontouchstart' in window) ) {
                this.$target.bind( 'touchstart.ripple', function( e ) {
                    that.view( e.originalEvent.touches[0] );
                } );
                this.$target.bind( 'touchend.ripple', function( e ) {
                    that.hidden( e.originalEvent.touches[0] );
                } );
                this.$target.bind( 'mouseleave.ripple', function( e ) {
                    that.hidden( e );
                } );
            } else {
                this.$target.bind( 'mousedown.ripple', function( e ) {
                    that.view( e );
                } );
                this.$target.bind( 'mouseup.ripple mouseleave.ripple', function( e ) {
                    that.hidden( e );
                } );
            }
        },

        // イベント廃止
        remove: function() {
        },

        // アニメーション開始
        view: function( e ) {
            // マスク要素のサイズを再取得（変わる可能性も考慮して）
            var width  = this.$target.outerWidth();
            var height = this.$target.outerHeight();
            this.$rippleWrap.stop( true, false ).width( width ).height( height ).css( 'opacity', 1 );

            // マスクに関係するスタイルを反映する
            // border-radius
            this.$rippleWrap.css( 'border-radius', this.$target.css( 'border-radius' ) );

            // マウスボタンの位置を取得
            // offsetX, offsetYがおかしいのでpageX, pageYから計算する
            var offsetX = e.pageX - this.$target.offset().left;
            var offsetY = e.pageY - this.$target.offset().top;
            this.$rippleAnimate.css( { 'left': offsetX, 'top': offsetY } );

            // サイズを指定（縦横の大きい値）
            var circleRatio  = 2.8;
            var animateTo    = { 'width': Math.max( width, height )*circleRatio };
            animateTo.height = animateTo.width;
            animateTo.left   = offsetX-animateTo.width/2;
            animateTo.top    = offsetY-animateTo.height/2;

            // アニメーション開始
            this.$rippleAnimate.show()
                .width( 0 ).height( 0 )
                .stop( true, false ).animate( animateTo, { 'duration': this._v_duration } );
        },

        // アニメーション終了
        hidden: function( e ) {
            // Wrapの透明度を下げて隠していく
            this.$rippleWrap.stop( true, false ).animate( { 'opacity': 0 }, { 'duration': this._h_duration } );
        }
    };

    $.fn.extend( {
        // jquery.ripple
        ripple: function( opt ) {
            // 必要条件に満たさなければ終了
            // border-radiusが使えればたぶん動く
            if(! $.ripple.is() ) {
                return $(this);
            }

            // 対象DOMに対してイベントを登録する
            $(this).each( function() {
                new $.ripple.core( $(this), opt );
            } );

            return $(this);
        }
    } );
} )( jQuery );

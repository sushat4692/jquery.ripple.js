( function( $ ) {
    $( function() {

        $( '.ripple' ).ripple();
        $( '.ripple-fast' ).ripple( { 'v_duration': 150, 'h_duration': 150 } );
        $( '.ripple-slow' ).ripple( { 'v_duration': 1000, 'h_duration': 1000 } );
        $( '.ripple-fast-slow' ).ripple( { 'v_duration': 600, 'h_duration': 150 } );

    } );
} )( jQuery );
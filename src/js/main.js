/* exported foundation, BioJoint, fullpage */
/* global Foundation */

var BIOJOINT_VERSION = '1.0.0';

// 
// We always need jQuery
// 

import jQuery from 'jquery';

//
// Foundation Framework
// 

import 'foundation-sites/js/foundation.core';
import 'foundation-sites/js/foundation.accordion';
import 'foundation-sites/js/foundation.equalizer';
import 'foundation-sites/js/foundation.reveal';
import 'foundation-sites/js/foundation.sticky';
import 'foundation-sites/js/foundation.toggler';
import 'foundation-sites/js/foundation.util.box';
import 'foundation-sites/js/foundation.util.keyboard';
import 'foundation-sites/js/foundation.util.mediaQuery';
import 'foundation-sites/js/foundation.util.motion';
import 'foundation-sites/js/foundation.util.nest';
import 'foundation-sites/js/foundation.util.timerAndImageLoader';
import 'foundation-sites/js/foundation.util.touch';
import 'foundation-sites/js/foundation.util.triggers';

// 
// Vendor Libs
// 

import fullpage from 'fullpage.js';

// 
// Initialize Foundation
// 

jQuery(document).foundation();

// 
// Main Script
// 

(($, Foundation, window, document, undefined) => {
	'use strict';

	// Common elements
	let $window 	= $(window);
	let $document = $(document);
	let $html 		= $('html');
	let $body 		= $('body');
	let $header 	= $('header');
	let $footer 	= $('footer');
	let $content 	= $('main');

	var Main = {

		/**
		 * Website version
		 * @type {String}
		 */
		version: BIOJOINT_VERSION,

		/**
		 * Common settings
		 * @type {Object}
		 */
		defaults : {

			/**
			 * Default CSS property for the colorFade method
			 * @type {String}
			 */
			colorFadeProp : 'backgroundColor',

			/**
			 * Default alpha for the colorFade method
			 * @type {Number}
			 */
			colorFadeAlpha : 0.85,

			/**
			 * Default transition duration
			 * @type {Number}
			 */
			transitionDuration : 700,

			/**
			 * Default transition timing, also known as easing
			 * @type {String}
			 */
			transitionTiming : 'easeInOutCubic',

			/**
			 * Default transition delay
			 * @type {Number}
			 */
			transitionDelay : 700,
		},

		/**
		 * Sets the body class and header background shade
		 *
		 * @public
		 * @param  {String} shade Dark or light shade
		 */
		setShade ( shade ) {

			if ( !shade ) { return; }

			// Additional shade class
			var klass = '-shade';

			// If the class is already set, then no need to change it
			if ( ! $body.hasClass( shade + klass ) ) {

				// Opposite shade
				var opposite = ( 'dark' === shade ) ? 'light' : 'dark';

				// Shade to rgba color object
				var color = ( 'dark' === shade ) ? [0,0,0] : [255,255,255];

				// Set the body shade class for elements to use
				$body.removeClass( opposite + klass ).addClass( shade + klass );

				// Fade Header background color
				this._colorFade( $header, this.defaults.colorFadeProp, color, this.defaults.colorFadeAlpha );
			}

		}, // end of Main.setShade

		/**
		 * Fades the property to the color given.
		 *
		 * @private
		 * @param  {Object} $el   The element to change
		 * @param  {String} prop  The property to change
		 * @param  {Object|String} color The target hex or rgb color
		 * @param  {Number} alpha The target alpha/opacity
		 */
		_colorFade ( $el, prop, color, alpha ) {

			// Conform the original and target colors to our specs
			let original = this._conformColor( $el.css( prop ) );
			let target 	 = this._conformColor( color );
			let duration = this.defaults.transitionDuration;
			let easing 	 = this.defaults.transitionTiming;

			// Create a dummy element to animate so we can use a step function
			// This element will not be inserted into the DOM
			$( '<div />' ).animate({ 'width': 100 }, {

				duration 	: duration,
				easing 		: easing,

				// Fade the colors in the strp function
				step : function ( now, fx ) {
					var completion = ( now - fx.start ) / ( fx.end - fx.start );
					$el.css( prop, Main._rgbCalc( original, target, completion, alpha ));
				}

			});
		
		}, // end of Main._colorFade

		/**
		 * Conforms the color input to the format needed
		 *
		 * @private
		 * @param  {Object|String} color The color to conform
		 * @return {Object}       An array with the RGB values
		 */
		_conformColor ( color ) {

			// If it's already an array, no need to mess with it
			if ( 'object' === typeof color ) { return color; }

			// Make sure we actually have a color, otherwise return white
			if ( 'string' !== typeof color || !color || !color.match( /rgb(a?)/ ) ) {
				return [255,255,255];
			}

			// Convert hex to rgb if necessary
			if ( '#' === color.substring( 0, 1 ) ) {
				color = this._hexToRgb().join();
			}

			// Convert original color into array of number strings
			color = color.replace( /[^0-9,]/gi, '' ).split( ',' );

			// Parse array of number strings into array of integers
			return $.map( color, ( str ) => parseInt( str ) );
		
		}, // end of Main._conformColor

		/**
		 * Calculates RGB[A] for CSS
		 *
		 * @private
		 * @param  {Object} original   The original color
		 * @param  {Object} target     The target color
		 * @param  {Number} completion The percent completed in the loop
		 * @param  {Number} alpha      The target alpha/opacity
		 * @return {String}            CSS RGB[A] string
		 */
		_rgbCalc ( original, target, completion, alpha = null ) {

			// Calculate our red, green and blue values
			var r = Math.round( original[0] + ( ( target[0] - original[0] ) * completion ) );
			var g = Math.round( original[1] + ( ( target[1] - original[1] ) * completion ) );
			var b = Math.round( original[2] + ( ( target[2] - original[2] ) * completion ) );

			// return rgba(0,0,0,0) string
			return this._rgbaToString( r, g, b, alpha );
		
		}, // end of Main._rgbCalc

		/**
		 * Converts rgba values into string
		 *
		 * @private
		 * @param  {Number} r Red value
		 * @param  {Number} g Green value
		 * @param  {Number} b Blue value
		 * @param  {Number} a Alpha value
		 * @return {String}   rgb(a) value in string format
		 */
		_rgbaToString ( r, g, b, a = null ) {
			return 'rgb'+(a?'a':null)+'('+r+','+g+','+b+(a?','+a:null)+')';
		},

		/**
		 * Converts hexadecimal string into rgb object
		 *
		 * @private
		 * @param  {String} hex Hexadecimal color
		 * @return {Object}     RGB object
		 */
		_hexToRgb ( hex ) {

			if ( '#' === hex.substring( 0, 1 ) ) {
				var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        hex = [r, g, b];
			}

			return hex;

		}, // end of Main._hexToRgb

	}; // end of Main

	window.Main = Main;

	/**
	 * Initialize FullPage.js
	 * @see: https://github.com/alvarotrigo/fullPage.js#initialization
	 */
	$content.fullpage({

		/**
		 * A selector used to specify the menu to link with the sections
		 * @type {String}
		 */
		menu: 					'#page-menu',

		/**
		 * SHow a navigation bar made up of small circles
		 * @type {Boolean}
		 */
		navigation: 		true,

		/**
		 * This callback is fired once the user leaves a section, in the transition to the new section.
		 * 
		 * @param  {Number} index     Index of the leaving section, starting from 1
		 * @param  {Number} nextIndex Index of the destination section, starting from 1
		 * @param  {String} direction "up" or "down" depensing on the scrolling direction
		 */
		onLeave: function (index, nextIndex, direction) {
			
			// Determine which section will be next
			var $next = $(this).parent().children(':eq(' + (nextIndex - 1) + ')');

			// Set the shade
			Main.setShade( $next.data('shade') );
		},

		/**
		 * Callback fired once the sections have been loaded, after the scrolling has ended.
		 * 
		 * @param  {String} anchorLink Anchor link corresponding to the section
		 * @param  {Number} index      Index of the section, starting from 1
		 */
    afterLoad: function (anchorLink, index) {},
    
    /**
     * This callback is fired just after the structure of the page is generated.
     * This is the callback you want to use to initialize other plugins or fire any code which requires 
     * the document to be ready (as this plugin modifies the DOM to create the resulting structure).
     */
    afterRender: function () {

    	// This animates the header fade in and slide down
    	$header.animate({ top: 0, opacity: 1 }, Main.defaults.transitionDuration, Main.defaults.transitionTiming);
    },
    
    /**
     * This callback is fired after resizing the browser's window. Just after the sections are resized.
     */
    afterResize: function () {},
    
    /**
     * Callback fired once the slide of a section have been loaded, after the scrolling has ended.
     * @param  {String} anchorLink  Anchor Link corresponding to the loaded section
     * @param  {Number} index       Index of the section, starting from 1
     * @param  {String} slideAnchor Anchor corresponding to the slide, if there is one
     * @param  {Number} slideIndex  Index of the slide, starting from 1
     */
    afterSlideLoad: function (anchorLink, index, slideAnchor, slideIndex) {},
    
    /**
     * This callback is fired once the user leaves an slide to go to another, in the transition to the new slide. 
     * Returning false will cancel the move before it takes place.
     * @param  {String} anchorLink 			Anchor link corresponding to the section
		 * @param  {Number} index      			Index of the section, starting from 1
     * @param  {Number} slideIndex  		Index of the slide, starting from 0
     * @param  {String} direction 			"left" or "right" depensing on the scrolling direction
     * @param  {Number} nextSlideIndex 	Index of the destination slide
     */
    onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {}

	});

})(jQuery, Foundation, window, window.document);
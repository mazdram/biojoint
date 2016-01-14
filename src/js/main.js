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

	/**
	 * BioJoint Class
	 */
	class BioJoint {

		/**
		 * BioJoint constructor
		 * @return {object} BioJoint
		 */
		constructor() {
			this.version 		= BIOJOINT_VERSION;

			this.options = {
				fullpage: {
					element: 'main[role="main"]',

					// @see: https://github.com/alvarotrigo/fullPage.js#initialization
					options: {
						// Navigation
						menu: '#page-menu',

						// Scrolling

						// Accessibility

						// Design
						fixedElements: 'header,footer',

						// Custom selectors

						// Events
						onLeave: 				() => this.$document.trigger('BioJoint.fp.onLeave'),
						afterLoad: 			() => this.$document.trigger('BioJoint.fp.afterLoad'),
						afterRender: 		() => this.$document.trigger('BioJoint.fp.afterRender'),
						afterResize: 		() => this.$document.trigger('BioJoint.fp.afterResize'),
						afterSlideLoad: () => this.$document.trigger('BioJoint.fp.afterSlideLoad'),
						onSlideLeave: 	() => this.$document.trigger('BioJoint.fp.onSlideLeave')
					}
				}
			};

			// Common elements
			this.$window 		= $(window);
			this.$document 	= $(document);
			this.$html 			= $('html');
			this.$body 			= $('body');

			// Initialize FullPage.js
			$(this.options.fullpage.element).fullpage(this.options.fullpage.options);

			// Bind events
			this.bindEvents();

			return this;
		}

		bindEvents() {

		}

	} // End of BioJoint class

	// Initialize Main
	$(document).ready(new BioJoint());

})(jQuery, Foundation, window, window.document);
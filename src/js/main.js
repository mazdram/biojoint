'use strict';

// 
// We always need jQuery
// 

import jQuery from 'jquery';

//
// Framework
// 

import foundation from 'foundation-sites';

// 
// Vendor Libs
// 

import fullpage from 'fullpage.js';

// Main Script
//

(function ($, window, document) {
  
  window.Main = {
    
    options : {
      
    },
    
    init : () => {
      
      // Bootstrap Foundation
      $(document).foundation();
      
      // Your code...
      
    }
    
  };
  
  // Bootstrap your website
  $(document).ready(window.Main.init);
  
}($, window, window.document));
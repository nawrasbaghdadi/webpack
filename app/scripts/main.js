
/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
 var skrollr = require('./skrollr.js');
  require('../styles/main.css');
(function () {
  'use strict';
  $("#skrollr-body").css("background","green");
  require('../node_modules/offline-plugin/runtime').install();

 if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {scope: './'}).then(function(registration) {
    
    document.querySelector('#status').textContent = 'succeeded';
  }).catch(function(error) {
    console.log('ersror');
    document.querySelector('#status').textContent = error;
  });
} else {
  // The current browser doesn't support service workers.
  var aElement = document.createElement('a');
  aElement.href = 'http://www.chromium.org/blink/serviceworker/service-worker-faq';
  aElement.textContent = 'unavailable';
  document.querySelector('#status').appendChild(aElement);
}
  
  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');
  var scripts = querySelector('#scripts');
  var hasMenu = querySelector('.has-menu');

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    navdrawerContainer.classList.add('opened');
  }

  main.addEventListener('click', closeMenu);
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if(event.target.className === 'dropd'){
    }else{
      
      closeMenu();
    }
  });


 var $window = $(window),
    $image = $('.container-logo,.container.logo-section');
    $window.on('scroll', function() {
      var top = $window.scrollTop();

      if (top < 0 || top > 500) { return; }
      $image
        .css('transform', 'translate3d(0px, '+top/50+'px, 0px)')
        .css('opacity', 1-Math.max(top/700, 0));
    });
    $window.trigger('scroll');

    var s = skrollr.init({
      smoothScrolling: true,
      smoothScrollingDuration: 500,
      forceHeight: false,
        render: function(data) {
            //Debugging - Log the current scroll position.
            //console.log(data.curTop);
        }
        ,mobileCheck: function() {
                //hack - forces mobile version to be off
                return false;
            }
             
    });





})();



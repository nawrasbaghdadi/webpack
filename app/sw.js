var __wpo = {
  "assets": {
    "main": [
      "././scripts/bundle.js"
    ],
    "additional": [],
    "optional": []
  },
  "hashesMap": {
    "e57ff6179e74459457ad06e6c5004ea9": "././scripts/bundle.js"
  },
  "strategy": "all",
  "version": "9/18/2016, 5:41:44 PM",
  "name": "webpack-offline",
  "relativePaths": true
};

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**************************************************************************************************************!*\
  !*** ../~/offline-plugin/lib/misc/sw-loader.js?{"data_var_name":"__wpo"}!../~/offline-plugin/empty-entry.js ***!
  \**************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	eval("\n      'use strict';\n\nif (false) {\n  var DEBUG = false;\n}\n\nfunction WebpackServiceWorker(params) {\n  var strategy = params.strategy;\n  var assets = params.assets;\n  var hashesMap = params.hashesMap;\n\n  // Not used yet\n  // const alwaysRevalidate = params.alwaysRevalidate;\n  // const ignoreSearch = params.ignoreSearch;\n  // const preferOnline = params.preferOnline;\n\n  var tagMap = {\n    all: params.version,\n    changed: params.version\n  };\n\n  var CACHE_PREFIX = params.name;\n  var CACHE_TAG = tagMap[strategy];\n  var CACHE_NAME = CACHE_PREFIX + ':' + CACHE_TAG;\n\n  var STORED_DATA_KEY = '__offline_webpack__data';\n\n  mapAssets();\n\n  var allAssets = [].concat(assets.main, assets.additional, assets.optional);\n  var navigateFallbackURL = params.navigateFallbackURL;\n\n  self.addEventListener('install', function (event) {\n    console.log('[SW]:', 'Install event');\n\n    var installing = undefined;\n\n    if (strategy === 'changed') {\n      installing = cacheChanged('main');\n    } else {\n      installing = cacheAssets('main');\n    }\n\n    event.waitUntil(installing);\n  });\n\n  self.addEventListener('activate', function (event) {\n    console.log('[SW]:', 'Activate event');\n\n    var activation = cacheAdditional();\n\n    // Delete all assets which name starts with CACHE_PREFIX and\n    // is not current cache (CACHE_NAME)\n    activation = activation.then(storeCacheData);\n    activation = activation.then(deleteObsolete);\n    activation = activation.then(function () {\n      if (self.clients && self.clients.claim) {\n        return self.clients.claim();\n      }\n    });\n\n    event.waitUntil(activation);\n  });\n\n  function cacheAdditional() {\n    if (!assets.additional.length) {\n      return Promise.resolve();\n    }\n\n    if (true) {\n      console.log('[SW]:', 'Caching additional');\n    }\n\n    var operation = undefined;\n\n    if (strategy === 'changed') {\n      operation = cacheChanged('additional');\n    } else {\n      operation = cacheAssets('additional');\n    }\n\n    // Ignore fail of `additional` cache section\n    return operation['catch'](function (e) {\n      console.error('[SW]:', 'Cache section `additional` failed to load');\n    });\n  }\n\n  function cacheAssets(section) {\n    var batch = assets[section];\n\n    return caches.open(CACHE_NAME).then(function (cache) {\n      return addAllNormalized(cache, batch, {\n        bust: params.version\n      });\n    }).then(function () {\n      logGroup('Cached assets: ' + section, batch);\n    })['catch'](function (e) {\n      console.error(e);\n      throw e;\n    });\n  }\n\n  function cacheChanged(section) {\n    return getLastCache().then(function (args) {\n      if (!args) {\n        return cacheAssets(section);\n      }\n\n      var lastCache = args[0];\n      var lastKeys = args[1];\n      var lastData = args[2];\n\n      var lastMap = lastData.hashmap;\n      var lastVersion = lastData.version;\n\n      if (!lastData.hashmap || lastVersion === params.version) {\n        return cacheAssets(section);\n      }\n\n      var lastHashedAssets = Object.keys(lastMap).map(function (hash) {\n        return lastMap[hash];\n      });\n\n      var lastUrls = lastKeys.map(function (req) {\n        var url = new URL(req.url);\n        url.search = '';\n\n        return url.toString();\n      });\n\n      var sectionAssets = assets[section];\n      var moved = [];\n      var changed = sectionAssets.filter(function (url) {\n        if (lastUrls.indexOf(url) === -1 || lastHashedAssets.indexOf(url) === -1) {\n          return true;\n        }\n\n        return false;\n      });\n\n      Object.keys(hashesMap).forEach(function (hash) {\n        var asset = hashesMap[hash];\n\n        // Return if not in sectionAssets or in changed or moved array\n        if (sectionAssets.indexOf(asset) === -1 || changed.indexOf(asset) !== -1 || moved.indexOf(asset) !== -1) return;\n\n        var lastAsset = lastMap[hash];\n\n        if (lastAsset && lastUrls.indexOf(lastAsset) !== -1) {\n          moved.push([lastAsset, asset]);\n        } else {\n          changed.push(asset);\n        }\n      });\n\n      logGroup('Changed assets: ' + section, changed);\n      logGroup('Moved assets: ' + section, moved);\n\n      var movedResponses = Promise.all(moved.map(function (pair) {\n        return lastCache.match(pair[0]).then(function (response) {\n          return [pair[1], response];\n        });\n      }));\n\n      return caches.open(CACHE_NAME).then(function (cache) {\n        var move = movedResponses.then(function (responses) {\n          return Promise.all(responses.map(function (pair) {\n            return cache.put(pair[0], pair[1]);\n          }));\n        });\n\n        return Promise.all([move, addAllNormalized(cache, changed, {\n          bust: params.version\n        })]);\n      });\n    });\n  }\n\n  function deleteObsolete() {\n    return caches.keys().then(function (keys) {\n      var all = keys.map(function (key) {\n        if (key.indexOf(CACHE_PREFIX) !== 0 || key.indexOf(CACHE_NAME) === 0) return;\n\n        console.log('[SW]:', 'Delete cache:', key);\n        return caches['delete'](key);\n      });\n\n      return Promise.all(all);\n    });\n  }\n\n  function getLastCache() {\n    return caches.keys().then(function (keys) {\n      var index = keys.length;\n      var key = undefined;\n\n      while (index--) {\n        key = keys[index];\n\n        if (key.indexOf(CACHE_PREFIX) === 0) {\n          break;\n        }\n      }\n\n      if (!key) return;\n\n      var cache = undefined;\n\n      return caches.open(key).then(function (_cache) {\n        cache = _cache;\n        return _cache.match(new URL(STORED_DATA_KEY, location).toString());\n      }).then(function (response) {\n        if (!response) return;\n\n        return Promise.all([cache, cache.keys(), response.json()]);\n      });\n    });\n  }\n\n  function storeCacheData() {\n    return caches.open(CACHE_NAME).then(function (cache) {\n      var data = new Response(JSON.stringify({\n        version: params.version,\n        hashmap: hashesMap\n      }));\n\n      return cache.put(new URL(STORED_DATA_KEY, location).toString(), data);\n    });\n  }\n\n  self.addEventListener('fetch', function (event) {\n    var url = new URL(event.request.url);\n    url.search = '';\n    var urlString = url.toString();\n\n    // Match only GET and known caches, otherwise just ignore request\n    if (event.request.method !== 'GET' || allAssets.indexOf(urlString) === -1) {\n      if (navigateFallbackURL && isNavigateRequest(event.request)) {\n        event.respondWith(handleNavigateFallback(fetch(event.request)));\n\n        return;\n      }\n\n      // Fix for https://twitter.com/wanderview/status/696819243262873600\n      if (url.origin !== location.origin && navigator.userAgent.indexOf('Firefox/44.') !== -1) {\n        event.respondWith(fetch(event.request));\n      }\n\n      return;\n    }\n\n    var resource = cachesMatch(urlString, CACHE_NAME).then(function (response) {\n      if (response) {\n        if (true) {\n          console.log('[SW]:', 'URL [' + urlString + '] from cache');\n        }\n\n        return response;\n      }\n\n      // Load and cache known assets\n      var fetching = fetch(event.request).then(function (response) {\n        if (!response || !response.ok) {\n          if (true) {\n            console.log('[SW]:', 'URL [' + urlString + '] wrong response: [' + response.status + '] ' + response.type);\n          }\n\n          return response;\n        }\n\n        if (true) {\n          console.log('[SW]:', 'URL [' + urlString + '] fetched');\n        }\n\n        var responseClone = response.clone();\n\n        caches.open(CACHE_NAME).then(function (cache) {\n          return cache.put(urlString, responseClone);\n        }).then(function () {\n          console.log('[SW]:', 'Cache asset: ' + urlString);\n        });\n\n        return response;\n      });\n\n      if (navigateFallbackURL && isNavigateRequest(event.request)) {\n        return handleNavigateFallback(fetching);\n      }\n\n      return fetching;\n    });\n\n    event.respondWith(resource);\n  });\n\n  self.addEventListener('message', function (e) {\n    var data = e.data;\n    if (!data) return;\n\n    switch (data.action) {\n      case 'skipWaiting':\n        {\n          if (self.skipWaiting) self.skipWaiting();\n        }break;\n    }\n  });\n\n  function handleNavigateFallback(fetching) {\n    return fetching['catch'](function () {}).then(function (response) {\n      if (!response || !response.ok) {\n        if (true) {\n          console.log('[SW]:', 'Loading navigation fallback [' + navigateFallbackURL + '] from cache');\n        }\n\n        return cachesMatch(navigateFallbackURL, CACHE_NAME);\n      }\n\n      return response;\n    });\n  }\n\n  function mapAssets() {\n    Object.keys(assets).forEach(function (key) {\n      assets[key] = assets[key].map(function (path) {\n        var url = new URL(path, location);\n        url.search = '';\n\n        return url.toString();\n      });\n    });\n\n    hashesMap = Object.keys(hashesMap).reduce(function (result, hash) {\n      var url = new URL(hashesMap[hash], location);\n      url.search = '';\n\n      result[hash] = url.toString();\n      return result;\n    }, {});\n  }\n}\n\nfunction addAllNormalized(cache, requests, options) {\n  var bustValue = options && options.bust;\n\n  return Promise.all(requests.map(function (request) {\n    if (bustValue) {\n      request = applyCacheBust(request, bustValue);\n    }\n\n    return fetch(request);\n  })).then(function (responses) {\n    if (responses.some(function (response) {\n      return !response.ok;\n    })) {\n      return Promise.reject(new Error('Wrong response status'));\n    }\n\n    var addAll = responses.map(function (response, i) {\n      return cache.put(requests[i], response);\n    });\n\n    return Promise.all(addAll);\n  });\n}\n\nfunction cachesMatch(request, cacheName) {\n  return caches.match(request, {\n    cacheName: cacheName\n  })\n  // Return void if error happened (cache not found)\n  ['catch'](function () {});\n}\n\nfunction applyCacheBust(asset, key) {\n  var hasQuery = asset.indexOf('?') !== -1;\n  return asset + (hasQuery ? '&' : '?') + '__uncache=' + encodeURIComponent(key);\n}\n\nfunction getClientsURLs() {\n  if (!self.clients) {\n    return Promise.resolve([]);\n  }\n\n  return self.clients.matchAll({\n    includeUncontrolled: true\n  }).then(function (clients) {\n    if (!clients.length) return [];\n\n    var result = [];\n\n    clients.forEach(function (client) {\n      var url = new URL(client.url);\n      url.search = '';\n      url.hash = '';\n      var urlString = url.toString();\n\n      if (!result.length || result.indexOf(urlString) === -1) {\n        result.push(urlString);\n      }\n    });\n\n    return result;\n  });\n}\n\nfunction isNavigateRequest(request) {\n  return request.mode === 'navigate' || request.headers.get('Upgrade-Insecure-Requests') || (request.headers.get('Accept') || '').indexOf('text/html') !== -1;\n}\n\nfunction logGroup(title, assets) {\n  console.groupCollapsed('[SW]:', title);\n\n  assets.forEach(function (asset) {\n    console.log('Asset:', asset);\n  });\n\n  console.groupEnd();\n}\n      __webpack_require__(/*! !./lib/misc/sw-polyfill.js */ 1)\n      WebpackServiceWorker(__wpo);\n      module.exports = __webpack_require__(/*! ./empty-entry.js */ 2)\n    \n\n/*****************\n ** WEBPACK FOOTER\n ** ../~/offline-plugin/lib/misc/sw-loader.js?{\"data_var_name\":\"__wpo\"}!../~/offline-plugin/empty-entry.js\n ** module id = 0\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../~/offline-plugin/empty-entry.js?../~/offline-plugin/lib/misc/sw-loader.js?%7B%22data_var_name%22:%22__wpo%22%7D");

/***/ },
/* 1 */
/*!***************************************************!*\
  !*** ../~/offline-plugin/lib/misc/sw-polyfill.js ***!
  \***************************************************/
/***/ function(module, exports) {

	eval("\"use strict\";\n\n/*****************\n ** WEBPACK FOOTER\n ** ../~/offline-plugin/lib/misc/sw-polyfill.js\n ** module id = 1\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../~/offline-plugin/lib/misc/sw-polyfill.js?");

/***/ },
/* 2 */
/*!******************************************!*\
  !*** ../~/offline-plugin/empty-entry.js ***!
  \******************************************/
/***/ function(module, exports) {

	eval("\n\n/*****************\n ** WEBPACK FOOTER\n ** ../~/offline-plugin/empty-entry.js\n ** module id = 2\n ** module chunks = 0\n **/\n//# sourceURL=webpack:///../~/offline-plugin/empty-entry.js?");

/***/ }
/******/ ]);
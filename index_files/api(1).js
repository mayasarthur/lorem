/*! updated; 02-27-2018 04:46 PM **/


Modulr.define("core.auth:api",["require","jquery"],function(require,$){var INITIALIZED=!1;return new function(){var Proto=this;Proto.init=function(){INITIALIZED||(INITIALIZED=!0,require(["modules/navbar"]))},Proto.initLegacy=function(){INITIALIZED||(INITIALIZED=!0,require(["modules/navbar.legacy"]))},Proto.middleware=function(callback){"function"==typeof callback&&require(["models/middleware"],function(Middleware){callback(Middleware)})}}});
/*! updated; 02-27-2018 04:46 PM **/


Modulr.define("core.components:newsletter",["require","newsletter/index"],function(require,Newsletter){var App=function(){};return App.prototype.set=function(props){return new Newsletter(props)},new App});
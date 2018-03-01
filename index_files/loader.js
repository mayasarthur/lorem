/*! updated; 02-27-2018 04:46 PM **/


!function(FNC,$){FNC.Loader&&FNC.Loader.load(["/static/orion/scripts/core/auth/ag.app.js"],function(){FNC.core.auth.init(function(require){require(["jquery"],function($){var pagetype=$('meta[name="auth_type"]').attr("content")||null;pagetype&&require(["pages/"+pagetype])})})})}(window.FNC||{},window.jQuery);
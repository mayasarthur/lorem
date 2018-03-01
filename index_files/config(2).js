/*! updated; 02-27-2018 04:46 PM **/


Modulr.define("core.templates:config",["cdn","core.base:utils/environment"],function(cdn,Env){var config={};config._clone=function(){return{iframe:cdn.domain+"/static/orion/scripts/core/templates/app/iframe.html?v="+Env.getCacheParam(),readyEvent:"FOX_TPL_FRAME.ready",handlerEvent:"FOX_TPL_FRAME.handler",templateEvent:"FOX_TPL_HANDLER",frameId:"frame-template"}};var cloned=config._clone();for(var id in cloned)config[id]=cloned[id];return config});
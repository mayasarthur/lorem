/*================================================================================
The use, disclosure, reproduction, modification, transfer, or transmittal
of this work for any purpose in any form or by any means without th
written permission of Akamai Technologies is strictly prohibited.

Confidential, Unpublished Property of Akamai Technologies.
Use and Distribution Limited Solely to Authorized Personnel.

Copyright 2016 Akamai Technologies, Inc.  All Rights Reserved.
================================================================================*/

var namespace = {};
(function (ns, amp) {
  ns.MAX_WIDTH = 350;
  ns.MOBILE_MAX_WIDTH = 381;

  ns.amp = amp;
  ns.playerClickHandler;
  ns.isTouch = false;
  ns.width = 0;

  ns.setCC = function () {
    var width = ns.amp.getContainer().clientWidth;
    var ccBtn = document.getElementsByClassName('akamai-cc akamai-button').length > 0 ? document.getElementsByClassName('akamai-cc akamai-button')[0] : null;
    if (!ns.playerClickHandler && ccBtn) {
      ns.playerClickHandler = ccBtn.onclick;
    }
    if (ns.MAX_WIDTH > width || ns.isTouch) {
      ns.amp.getContainer().classList.add("akamai-small");
      if (ccBtn && ccBtn.onclick != ns.onClick) {
        ccBtn.onclick = ns.onClick;
      }
    }
    else {
      ns.amp.getContainer().classList.remove("akamai-small");
      if (ns.playerClickHandler)
        ccBtn.onclick = ns.playerClickHandler;
    }
  }

  ns.onClick = function (ev) {
    ns.amp.captioning.setHidden(!ns.amp.captioning.getHidden());
  }

  ns.onInit = function (ev) {
    var intervalID;
    if ('flash' !== akamai.amp.AMP.getPlaybackMode()) {
      ns.width = ns.amp.getContainer().clientWidth;
      ns.isTouch = akamai.amp.utils.Utils.isIPhone() || (akamai.amp.utils.Utils.isAndroid() && ns.MOBILE_MAX_WIDTH > ns.width);
      ns.amp.captioning.once("trackselected",ns.setCC);
      intervalID = window.setInterval(ns.setCC, 3000);

       //workaround issue IOS 11 unresponsive player AMPWEB-847
       /*if((_ref = akamai.amp.utils.Utils.getIOSversion()) != null ? _ref[0] == 11 : false)
       {
         ns.amp.controls.setMode('fixed')
       }*/
    }
  }

  if (ns.amp) {
    ns.amp.once("ready", ns.onInit);
  }
}(namespace, amp));
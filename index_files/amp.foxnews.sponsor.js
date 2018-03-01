/*================================================================================
The use, disclosure, reproduction, modification, transfer, or transmittal
of this work for any purpose in any form or by any means without th
written permission of Akamai Technologies is strictly prohibited.

Confidential, Unpublished Property of Akamai Technologies.
Use and Distribution Limited Solely to Authorized Personnel.

Copyright 2017 Akamai Technologies, Inc.  All Rights Reserved.
================================================================================*/

var namespace = {};
(function (ns, amp) {
    ns.amp = amp;
    ns.redirect = "";

    ns.addSponsor = function (ev) {
        var _ref;
        var wrapper = document.createElement("div"), logo, label;
        var overlay = document.getElementsByClassName('akamai-ais-preview');
        if (0 < overlay.length) {
            label = document.createElement("span");
            label.className = "akamai-flex-item akamai-ais-preview-label";
            label.textContent = "Sponsored by";

            logo = document.createElement("img");
            logo.className = 'akamai-flex-item akamai-ais-sponsor';
            logo.onclick = ns.onClick;
            logo.src = (_ref = ns.amp.getConfig().ais.sponsor != null ? ns.amp.getConfig().ais.sponsor : void 0) && _ref != null ? _ref.logo : "";
            ns.redirect = (_ref = ns.amp.getConfig().ais.sponsor != null ? ns.amp.getConfig().ais.sponsor : void 0) && _ref != null ? _ref.redirect : "";
            wrapper.className = "akamai-flex-item";
            wrapper.appendChild(label);
            wrapper.appendChild(logo);
            overlay[0].insertBefore(wrapper, document.getElementsByClassName("akamai-spacer")[0]);
        }
    }

    ns.onClick = function (ev) {
        if ("" !== ns.redirect)
            window.open(ns.redirect, '_blank');
    }

    ns.onInit = function (ev) {
        if (ns.amp.auth != null)
            ns.amp.auth.addEventListener("preview", ns.addSponsor);
    }

    if (ns.amp) {
        ns.amp.once("ready", ns.onInit)
    }
}(namespace, amp));
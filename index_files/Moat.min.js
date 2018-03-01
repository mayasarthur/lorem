(function (exports) {
'use strict';

var Moat = function (_akamai$amp$Plugin) {
  babelHelpers.inherits(Moat, _akamai$amp$Plugin);

  function Moat(player, config) {
    babelHelpers.classCallCheck(this, Moat);
    return babelHelpers.possibleConstructorReturn(this, (Moat.__proto__ || Object.getPrototypeOf(Moat)).call(this, player, config));
  }

  babelHelpers.createClass(Moat, [{
    key: "onready",
    value: function onready(event) {
      var ads = this.player.ads;
      if (ads == null) return;

      ads.addEventListener("breakstart", this.onadbreakstart.bind(this));
      ads.addEventListener("managerloaded", this.onadmanagerloaded.bind(this));
    }
  }, {
    key: "track",
    value: function track() {
      var vo = this.adsManagerVO;
      var data = this.player.evaluateBindings(this.config);

      if (initMoatTracking == null || vo == null || data == null) {
        return;
      }

      initMoatTracking(vo.adManager, { "partnerCode": data.partnerCode, "viewMode": vo.viewMode, "slicer1": data.slicer1, "slicer2": data.slicer2 }, vo.adContainer);
    }
  }, {
    key: "onmediachange",
    value: function onmediachange(event) {
      this.adsManagerVO = null;
    }
  }, {
    key: "onadbreakstart",
    value: function onadbreakstart(event) {
      this.track();
    }
  }, {
    key: "onadmanagerloaded",
    value: function onadmanagerloaded(event) {
      this.adsManagerVO = event.detail;
      this.track();
    }
  }]);
  return Moat;
}(akamai.amp.Plugin);

var MoatFlash = function (_akamai$amp$FlashPlug) {
  babelHelpers.inherits(MoatFlash, _akamai$amp$FlashPlug);

  function MoatFlash(player, config) {
    babelHelpers.classCallCheck(this, MoatFlash);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(MoatFlash).call(this, player, config));
  }

  babelHelpers.createClass(MoatFlash, [{
    key: "createXML",
    value: function createXML(event) {
      var xml = event.detail.xml;
      var application = xml.firstChild;
      var metrics = xml.getElementsByTagName("metrics")[0];

      if (metrics == null) {
        metrics = xml.createElement("metrics");
        application.appendChild(metrics);
      }

      var vendor = xml.createElement("vendor");
      vendor.setAttribute("id", "moat");
      metrics.appendChild(vendor);

      var props = [{ value: this.config.partnerCode, key: "partnerCode" }, { value: this.config.slicer1, key: "slicer1" }, { value: this.config.slicer2, key: "slicer2" }];

      props.forEach(function (prop) {
        if (prop.value == null) return;
        this.createProperty(xml, prop.key, prop.value, vendor);
      }.bind(this));
    }
  }, {
    key: "flashPlugins",
    get: function get() {
      return [{
        id: "MOATAnalyticsPlugin",
        src: "#{paths.resources}plugins/MOATAnalyticsPlugin.swf",
        blocking: false,
        host: "akamai",
        main: "MOATAnalyticsPlugin"
      }];
    }
  }]);
  return MoatFlash;
}(akamai.amp.FlashPlugin);

akamai.amp.AMP.registerPlugin("moat", "html", akamai.amp.Plugin.createFactory(Moat));
akamai.amp.AMP.registerPlugin("moat", "flash", akamai.amp.Plugin.createFactory(MoatFlash));

exports.Moat = Moat;
exports.MoatFlash = MoatFlash;

}({}));

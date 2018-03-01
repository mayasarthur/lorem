(function (exports) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var Buffering = function () {
    function Buffering() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Buffering);

      this.player = options.player;
      this.emit = options.emit;
      this.startTime = undefined;
      this.isBuffered = false;

      this.player.addEventListener('waiting', function (e) {
        return _this.waiting(e);
      });
      this.player.addEventListener('playing', function (e) {
        return _this.playing(e);
      });
    }

    _createClass(Buffering, [{
      key: 'getVideo',
      value: function getVideo() {
        return this.player.getContainer().getElementsByTagName("video")[0];
      }

      // The user agent is actively trying to download data.

    }, {
      key: 'checkNetworkStateForBuffering',
      value: function checkNetworkStateForBuffering() {
        var video = this.getVideo();
        var ISBUFFERING = true;
        var ISNOTBUFFERING = false;

        // If we don't have a video container
        if (typeof video === "undefined") return ISBUFFERING;

        // If we don't have readyState
        if (typeof video.networkState === "undefined") return ISBUFFERING;

        if (video.networkState === video.NETWORK_LOADING) return ISBUFFERING;else return ISNOTBUFFERING;
      }

      // There is not enough data to keep playing from this point

    }, {
      key: 'checkReadyStateForBuffering',
      value: function checkReadyStateForBuffering() {
        var video = this.getVideo();
        var ISBUFFERING = true;
        var ISNOTBUFFERING = false;

        // If we don't have a video container
        if (typeof video === "undefined") return ISBUFFERING;

        // If we don't have readyState
        if (typeof video.readyState === "undefined") return ISBUFFERING;

        if (video.readyState < video.HAVE_FUTURE_DATA) return ISBUFFERING;else return ISNOTBUFFERING;
      }

      /**
      * Triggered from a `waiting` event
      * We look at the state of the video object - does it think it's buffering?
      * If so, we start a timer, and emit a BUFFER_EVENT, indicating it's the start of the buffering event.
      */

    }, {
      key: 'waiting',
      value: function waiting() {
        // If we are already in a buffer state, do nothing.
        if (this.isBuffered) return;

        // Check the network state and ready state.
        if (!(this.checkNetworkStateForBuffering() && this.checkReadyStateForBuffering())) return;

        this.isBuffered = true;
        this.startTime = new Date().getTime();

        this.emit("BUFFER_EVENT", {
          bufferStart: this.startTime
        });
      }

      /**
      * Triggered from a `playing` media event.
      * This implies the video has stopped buffering, and has started playing again.
      * It fires an emit with a BUFFER_EVENT, indicating it's the end of the buffering event.
      */

    }, {
      key: 'playing',
      value: function playing() {
        // We weren't buffering, so who cares.
        if (!this.isBuffered) return;

        var currentTime = new Date().getTime();
        var diff = currentTime - this.startTime;

        if (diff < 0) {
          currentTime = this.startTime;
          diff = 0;
        }

        this.isBuffered = false;
        this.startTime = undefined;

        this.emit("BUFFER_EVENT", {
          bufferEnd: currentTime,
          bufferDuration: diff
        });
      }
    }]);

    return Buffering;
  }();

  var NewRelic = function () {
    function NewRelic(player, config) {
      var _this2 = this;

      _classCallCheck(this, NewRelic);

      if (typeof newrelic === "undefined") {
        console.log("[newrelic] The New Relic agent was not found. Video metrics will not be collected.");
        return;
      }

      if (typeof newrelic !== "undefined" && !newrelic.video) {
        newrelic.video = {};
        var fauxUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0,
              v = c == 'x' ? r : r & 0x3 | 0x8;return v.toString(16);
        });
        newrelic.video['uniqueId'] = newrelic.video['uniqueId'] || fauxUUID;
      }

      this.player = player;
      this.config = config;
      this.metadata = amp.evaluateBinding(config.metadata || {});
      this.debug = config.debug === true;

      if (this.debug) console.log("[newrelic] Plugin initializing.");

      var customerHeartbeat = config.heartbeat || 10;
      if (customerHeartbeat < 10) customerHeartbeat = 10;

      this.interval = customerHeartbeat * 1000; // convert to milliseconds;
      this.uniqueId = config.uniqueId || newrelic.video['uniqueId'];
      this.readyTime = undefined;
      this.playTime = undefined;
      this.lastHeartbeat = undefined;
      this.bitrate = undefined;
      this.realBitrate = undefined;
      this.timeContentWasRequested = undefined;
      this.timeContentWasStarted = undefined;
      this.isSeeking = undefined;
      this.isLive = false;
      this.firstFrameFired = false;
      this.isAd = false;

      this.initTime = player.initTime;
      this.customAttributes = config.customAttributes || {};

      this.buffering = new Buffering({ player: player, emit: this.pageAction.bind(this) });

      this.payload = {
        playerSoftwareName: "AMP",
        playerSoftwareVersion: player.version,
        newrelicPluginVersion: "1.0.14"
      };

      this.adDetails = {
        ads: !!this.player.ads,
        firstQuartile: false,
        midpoint: false,
        thirdQuartile: false
      };

      player.addEventListener('ready', function (e) {
        return _this2.readyHandler(e);
      });
    }

    _createClass(NewRelic, [{
      key: 'readyHandler',
      value: function readyHandler(event) {
        var _this3 = this;

        this.readyTime = new Date().getTime();
        var diff = this.readyTime - this.initTime;

        if (diff > 0) this.pageAction('PLAYER_READY', { readyTime: this.readyTime, timeToReady: diff });

        var playerEvents = [{ canplaythrough: 'VIDEO_FINISHED_LOADING' },
        // Playing fires for ads and content
        { playing: function playing(e) {
            _this3.trackContentTiming(e);
            _this3.playHandler(e);
          } }, { timeupdate: function timeupdate(e) {
            return _this3.heartbeat(e);
          } }, { error: function error(e) {
            return _this3.errorHandler(e);
          } }, { pause: 'PLAYBACK_PAUSED' }, { resume: 'PLAYBACK_RESUMED' }, { playrequest: function playrequest(e) {
            return _this3.trackRequested(e);
          } }, { seeking: function seeking(e) {
            _this3.isSeeking = new Date().getTime();
            _this3.pageAction('PLAYBACK_SEEK_START');
          } }, { ended: 'PLAYBACK_ENDED' }, { islive: function islive(e) {
            return _this3.isLive = e.data;
          } }, { mediachange: function mediachange(e) {
            return _this3.mediaChanged(e);
          } }, { bitratechange: function bitratechange(e) {
            _this3.bitrate = e.data.bitrate;
            _this3.realBitrate = e.data.realBitrate;
          } }];

        var adEvents = [{ play: function play(e) {
            return _this3.pageAction('AD_START', { adTitle: e.data.title });
          } }, { ended: function ended(e) {
            return _this3.pageAction('AD_END', { adTitle: e.data.title });
          } }, { pause: function pause(e) {
            return _this3.pageAction('AD_PAUSED', { adTitle: e.data.title });
          } }, { resume: function resume(e) {
            return _this3.pageAction('AD_RESUMED', { adTitle: e.data.title });
          } },
        // { started:       (e) => this.trackFirstFrame(e) },
        { request: function request(e) {
            return _this3.trackRequested(e);
          } }, { firstquartile: function firstquartile(e) {
            _this3.adDetails.firstQuartile = true;
            _this3.pageAction('AD_FIRST_QUARTILE', { adTitle: e.data.title });
          } }, { midpoint: function midpoint(e) {
            _this3.adDetails.midpoint = true;
            _this3.pageAction('AD_MIDPOINT', { adTitle: e.data.title });
          } }, { thirdquartile: function thirdquartile(e) {
            _this3.adDetails.thirdquartile = true;
            _this3.pageAction('AD_THIRD_QUARTILE', { adTitle: e.data.title });
          } }, { breakstart: function breakstart(e) {
            _this3.resetAdDetails();
            _this3.isAd = true;
            _this3.pageAction('AD_BREAK_START', { adTitle: e.data.title });
          } }, { breakend: function breakend(e) {
            _this3.resetAdDetails();
            _this3.pageAction('AD_BREAK_COMPLETE', { adTitle: e.data.title });
          } }, { error: function error(e) {
            return _this3.errorHandler(e);
          } }];

        var setupListeners = function setupListeners(eventTarget, eventType) {
          var key = Object.keys(eventType)[0];
          var value = eventType[key];

          if (typeof value === 'function') eventTarget.addEventListener(key, value);else eventTarget.addEventListener(key, function (e) {
            return _this3.pageAction(value);
          });
        };

        playerEvents.forEach(function (e) {
          return setupListeners(_this3.player, e);
        });
        this.player.ads && adEvents.forEach(function (e) {
          return setupListeners(_this3.player.ads, e);
        });
      }
    }, {
      key: 'resetAdDetails',
      value: function resetAdDetails() {
        this.isAd = false;
        this.adDetails = {
          firstQuartile: false,
          midpoint: false,
          thirdQuartile: false
        };
      }
    }, {
      key: 'heartbeat',
      value: function heartbeat(event) {
        var currentTime = new Date().getTime();
        var diff = this.interval + 1;

        if (this.lastHeartbeat) {
          diff = Math.floor(currentTime - this.lastHeartbeat);
        }

        if (diff > this.interval) {
          this.lastHeartbeat = new Date().getTime();
          this.pageAction("PLAYBACK_INPROGRESS");
        }
      }
    }, {
      key: 'playHandler',
      value: function playHandler(event) {
        if (this.isSeeking) {
          var currentTime = new Date().getTime();
          this.pageAction('PLAYBACK_SEEK_COMPLETE', { timeToSeek: currentTime - this.isSeeking });
          this.isSeeking = undefined;
        }

        // Pause / play / play for the first time.
        if (this.playTime) this.pageAction('PLAYBACK_RESUMED');else {
          this.playTime = new Date().getTime();
          this.pageAction('PLAYBACK_START');
        }
      }
    }, {
      key: 'trackRequested',
      value: function trackRequested(e) {
        this.timeContentWasRequested = new Date().getTime();
      }
    }, {
      key: 'trackContentTiming',
      value: function trackContentTiming(e) {
        if (this.timeContentWasRequested) {
          var currentTime = new Date().getTime();
          var diff = currentTime - this.timeContentWasRequested;

          if (diff < 0) {
            return;
          }

          if (!this.firstFrameFired) {
            // Add time since init
            // Add time since ready
            this.pageAction('FIRST_FRAME', { timeToFirstFrame: diff });
            this.firstFrameFired = true;
          }
          this.pageAction('CONTENT_STARTED', { timeToContent: diff });
          this.timeContentWasRequested = undefined;
          this.timeContentWasStarted = currentTime;
        }
      }
    }, {
      key: 'mediaChanged',
      value: function mediaChanged(e) {
        this.isLive = e.detail.temporalType === "live";
        var data = e.data || {};
        this.metadata = amp.evaluateBinding(data.metadata);
        this.title = this.metadata.videoTitle;
      }
    }, {
      key: 'errorHandler',
      value: function errorHandler(event) {
        if (typeof newrelic === "undefined") return true;

        this.pageAction('PLAYBACK_ERROR', event);
        newrelic.noticeError(event);
      }
    }, {
      key: 'pageAction',
      value: function pageAction(name) {
        var _this4 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (typeof newrelic === "undefined") return true;

        var newPayload = {};
        var player = this.player;
        var payload = this.payload || {};
        var metadata = this.metadata;

        var mediaElement = player.mediaElement;
        var container = player.container;

        var currentTime = new Date().getTime();

        Object.keys(payload).forEach(function (key) {
          // Don't copy over empty params
          if (payload[key]) newPayload[key] = payload[key];
        });

        Object.keys(options).forEach(function (key) {
          // Don't copy over empty params from options
          if (options[key] && _typeof(options[key]) !== 'object') newPayload[key] = options[key];
        });

        try {
          newPayload.title = this.metadata['media-group']['media-title'];
        } catch (e) {}

        // All the standard info we want
        newPayload.uniqueId = this.uniqueId;
        newPayload.isAd = this.isAd;
        newPayload.isFullscreen = player.displayState === "fullscreen";
        newPayload.videoLanguage = player.language;
        newPayload.videoDuration = isNaN(mediaElement.duration) ? undefined : Math.floor(mediaElement.duration);
        newPayload.videoHeight = mediaElement.videoHeight;
        newPayload.videoWidth = mediaElement.videoWidth;
        newPayload.playerIsPlaying = !player.paused;
        newPayload.playerCurrentTime = isNaN(player.getCurrentTime()) ? undefined : Math.floor(player.getCurrentTime()); // TODO: This is reporting the same as video duration.
        newPayload.playerAutoplayed = !!player.autoplay;
        newPayload.playerPreload = !!mediaElement.preload;
        newPayload.playerWidth = container.clientWidth;
        newPayload.playerHeight = container.clientHeight;
        newPayload.isLive = this.isLive;
        newPayload.bitrate = this.bitrate;
        newPayload.realBitrate = this.realBitrate;
        /*newPayload.readyTime            = this.readyTime;*/
        newPayload.timeSincePlayerInit = currentTime - newPayload.playerInitTime;
        newPayload.timeSincePlayerReady = currentTime - this.readyTime;

        if (this.timeContentWasStarted) {
          newPayload.timeSinceContentStarted = currentTime - this.timeContentWasStarted;
        }

        if (this.playTime) {
          newPayload.timeSincePlayerStart = currentTime - this.playTime;
        }

        // Pull out the ad metrics
        if (name.match(/^AD_/)) {
          newPayload.isAd = true;
          newPayload.adFirstQuartile = this.adDetails.firstQuartile;
          newPayload.adMidpoint = this.adDetails.midpoint;
          newPayload.adThirdQuartile = this.adDetails.thirdQuartile;
        }

        Object.keys(this.customAttributes).forEach(function (key) {
          // Don't copy over empty params from options
          if (_this4.customAttributes[key] && _typeof(_this4.customAttributes[key]) !== 'object') newPayload[key] = amp.evaluateBinding(_this4.customAttributes[key]);
        });

        if (this.debug) console.log("[newrelic] emitting", name, newPayload);

        newrelic.addPageAction(name, newPayload);
      }
    }], [{
      key: 'create',
      value: function create(player, config) {
        return new Promise(function (resolve, reject) {
          resolve(new NewRelic(player, config));
        });
      }
    }]);

    return NewRelic;
  }();

  akamai.amp.AMP.registerPlugin("newrelic", NewRelic.create);

  exports.NewRelic = NewRelic;
})(this.akamai.amp.newrelic = this.akamai.amp.newrelic || {});

/**
 * Updated 1st JUN TODO need refactor due 74 changes
 *@author Mav
 */
podIndex = 0;

function enableLiveAds(player) {
  var amp = player || null;
  var prevSegment = { isAdLoaded: false, key: '' };

  if (amp == null) {
    throw new ExceptionHandler('Player instance not defined');
  }

  player.hls.addEventListener(Hls.Events.FRAG_CHANGED, function (event, data) {
    var fragPlaying = event.data.frag;
    if (fragPlaying.tagList) {
      var cueRegex = /EXT-X-CUE-OUT|EXT-X-CUE-IN/i;
      var cue = "";
      var tagList = fragPlaying.tagList[0];

      for (var i = 0, j = tagList.length; i < j; i++) {
        var result = tagList[i].match(cueRegex);
        if (result) {
          cue = result[0];
        }
      }

      switch (cue) {
        case 'EXT-X-CUE-OUT':
          console.log("EXT-X-CUE-OUT", { tagList: fragPlaying.tagList });
          if (!prevSegment.isAdLoaded) {
            onAdIn(null, { tagList: fragPlaying.tagList });
            prevSegment.isAdLoaded = true;
          }
          break;

        case 'EXT-X-CUE-IN':
          console.log("EXT-X-CUE-IN", { tagList: fragPlaying.tagList });
          if (prevSegment.isAdLoaded) {
            onAdOut();
            prevSegment.isAdLoaded = false;
          }
          break;
      }
    }
  });
};

function onAdIn(event, data) {
  var duration, breakId, tag, result;
  var data = data || event.data;
  for (var i = 0, j = data.tagList.length; i < j; i++) {
    result = data.tagList[0][i].match(/([^,]+)/g);
    for (var k = 0, l = result.length; k < l; k++) {
      tag = result[k].match(/([^=]+)/g);
      if (typeof (tag) !== 'undefined' && 'DURATION' == tag[0]) {
        duration = parseInt(tag[1]) * 1000;
      } else if (typeof (tag) !== 'undefined' && 'BREAKID' == tag[0]) {
        breakId = tag[1].match(/^(2)/g) ? 0 : tag[1].indexOf('0x1') > -1 ? 0 : 1;
      }
    }
  }
  timeoutID = setTimeout(requestAd.bind(null, duration, breakId), 0);
}

function onAdOut() {
  timeoutID = setTimeout(terminateAd, 0);
}

function requestAd(duration, breakId) {
  console.log('Ad triggered', duration, breakId, "0", "xml_vast2");
  podIndex++
  amp.setParams({ adDuration: duration, adBreakId: breakId, adRule: "0", adOutput: "xml_vast2", adPod: podIndex });
  amp.ads.requestAd();
  amp.getContainer().classList.add("ad-request");
  amp.ads.once("loaded", adsLoadedHandler);
}

function terminateAd() {
  console.log('Terminate all ads');
}

function adsLoadedHandler() {
  amp.getContainer().classList.remove("ad-request");
}

function ExceptionHandler(data, type) {
  this.message = data;
  this.type = type || 'PlayerException';
}
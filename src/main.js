/* Boot: title → desk → F&I → ending. Tiny square-wave chirps. */

(function () {
  var deal;
  var stations;
  var node = "title";
  var audioCtx;

  function beep(freq, ms) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      var o = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      o.type = "square";
      o.frequency.value = freq;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      setTimeout(function () {
        o.stop();
      }, ms || 80);
    } catch (e) {}
  }

  function showTitle() {
    node = "title";
    var btn = UI.title();
    btn.addEventListener("click", function () {
      beep(220, 90);
      deal = Deal.fresh();
      goto("desk_open");
    });
  }

  function goto(id) {
    node = id;
    if (id === "end") {
      var kind = Deal.ending(deal) || "walk-soft";
      beep(kind === "fake" ? 110 : 440, 140);
      var again = UI.ending(kind, deal);
      again.addEventListener("click", showTitle);
      return;
    }
    var raw = stations[id];
    if (!raw) raw = stations.desk_open;
    var st = Script.decorate(raw, deal);
    UI.scene(st, deal, onPick);
  }

  function onPick(choice) {
    beep(330, 60);
    if (choice.action === "toFi") {
      goto("fi_menu");
      return;
    }
    var res = Deal.apply(deal, choice.action);
    if (choice.action === "freeze" && !res.ok) {
      goto("desk_freeze_fail");
      return;
    }
    if (choice.next === "end" || Deal.ending(deal)) {
      goto("end");
      return;
    }
    goto(choice.next);
  }

  function boot() {
    UI.mount(document.getElementById("game"));
    fetch("data/stations.json")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        stations = data;
        showTitle();
      })
      .catch(function () {
        document.getElementById("game").textContent =
          "Could not load data/stations.json. Serve from a local server.";
      });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();

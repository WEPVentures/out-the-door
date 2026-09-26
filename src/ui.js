/* Renders title, desk four-square, F&I, endings. */

(function (global) {
  var root;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function mount(target) {
    root = target;
  }

  function fourSquare(deal) {
    var s = Deal.snapshot(deal);
    var wrap = el("div", "sheet");
    wrap.appendChild(el("div", "sheet-title", "BUYER'S ORDER  \u00b7  FOUR SQUARE"));

    var grid = el("div", "squares");
    var cells = [
      ["VEHICLE PRICE", Deal.money(s.price), deal.pinned.price ? "PINNED \u00b7 MARKET" : "LIVE"],
      ["TRADE-IN", Deal.money(s.trade), deal.pinned.trade ? "PINNED \u00b7 OUTSIDE" : "LIVE"],
      ["DOWN PAYMENT", Deal.money(s.down), s.down > s.cash ? "CASH ONLY " + Deal.money(s.cash) : "ASKING"],
      ["MONTHLY", Deal.money(s.payment), deal.inspected || deal.frozen ? "REAL PMT" : "CIRCLED"]
    ];
    cells.forEach(function (c) {
      var box = el("div", "sq" + (deal.frozen ? " frozen" : ""));
      box.appendChild(el("small", "", c[0]));
      box.appendChild(el("b", "", c[1]));
      box.appendChild(el("em", "", c[2]));
      grid.appendChild(box);
    });
    wrap.appendChild(grid);

    var guts = el("div", "guts");
    if (deal.inspected || deal.frozen) {
      guts.appendChild(
        el(
          "p",
          "",
          "Term " +
            s.term +
            " mo  \u00b7  APR " +
            s.apr.toFixed(1) +
            "%  \u00b7  Add-ons " +
            Deal.money(s.addOns) +
            "  \u00b7  Doc " +
            Deal.money(s.doc)
        )
      );
      guts.appendChild(
        el(
          "p",
          "",
          "OTD " +
            Deal.money(s.otd) +
            "  \u00b7  Financed " +
            Deal.money(s.financed) +
            "  \u00b7  Desk gross ~" +
            Deal.money(s.gross)
        )
      );
    } else {
      guts.appendChild(el("p", "hint", "Inspect the payment to reveal term, APR, and add-ons."));
    }
    wrap.appendChild(guts);
    return wrap;
  }

  function inventory(deal) {
    var bar = el("div", "inv");
    bar.appendChild(el("span", "inv-label", "INVENTORY"));
    [
      ["MARKET $28,400", deal.pinned.price],
      ["OUTSIDE TRADE $9,800", deal.pinned.trade],
      ["BANK 6.9% / 60", deal.pinned.finance]
    ].forEach(function (c) {
      var chip = el("span", "card" + (c[1] ? " used" : ""), c[0]);
      bar.appendChild(chip);
    });
    return bar;
  }

  function title() {
    root.innerHTML = "";
    var stage = el("section", "stage title-stage");
    stage.appendChild(el("p", "kicker", "WEP VENTURES  \u00b7  1987"));
    stage.appendChild(el("h1", "", "OUT THE DOOR"));
    stage.appendChild(el("p", "sub", "A four-square morality play."));
    stage.appendChild(el("p", "blurb", "They will sell you a payment. Do not buy a payment."));
    var btn = el("button", "start", "SIT AT THE DESK");
    stage.appendChild(btn);
    root.appendChild(stage);
    return btn;
  }

  function scene(station, deal, onPick) {
    root.innerHTML = "";
    var stage = el("section", "stage desk-stage");
    var room = el("div", "room");
    room.appendChild(el("div", "lamp", ""));
    room.appendChild(el("div", "boss", "\u25a0"));
    room.appendChild(fourSquare(deal));
    stage.appendChild(room);
    stage.appendChild(inventory(deal));

    var talk = el("div", "talk");
    if (station.speaker) talk.appendChild(el("div", "who", station.speaker));
    talk.appendChild(el("p", "line", station.line));
    var menu = el("div", "choices");
    Script.filterChoices(station, deal).forEach(function (c) {
      var b = el("button", "choice", c.label);
      b.addEventListener("click", function () {
        onPick(c);
      });
      menu.appendChild(b);
    });
    talk.appendChild(menu);
    stage.appendChild(talk);
    root.appendChild(stage);
  }

  function ending(kind, deal) {
    root.innerHTML = "";
    var s = Deal.snapshot(deal);
    var stage = el("section", "stage end-stage");
    var titleMap = {
      "honest-walk": "YOU WALKED WITH A NUMBER",
      "honest-lock": "LOCKED HONEST PRICE",
      fake: "FAKE WIN",
      "walk-soft": "YOU LEFT. THEY KEPT THE PENCIL."
    };
    var bodyMap = {
      "honest-walk":
        "Out the door " +
        Deal.money(s.otd) +
        ". You did not sign a payment. The boxes froze because you made them.",
      "honest-lock":
        "Signed OTD " +
        Deal.money(s.otd) +
        " at " +
        s.apr.toFixed(1) +
        "% / " +
        s.term +
        " months. Add-ons: none. That is a car deal, not a payment.",
      fake:
        "Payment looks friendly. Term " +
        s.term +
        " months, APR " +
        s.apr.toFixed(1) +
        "%, add-ons " +
        Deal.money(s.addOns) +
        ". You bought the circle on the worksheet.",
      "walk-soft":
        "Leaving is allowed. Without one out-the-door number you taught them nothing and learned the same."
    };
    stage.appendChild(el("h1", "", titleMap[kind] || "END"));
    stage.appendChild(el("p", "blurb", bodyMap[kind] || ""));
    stage.appendChild(
      el(
        "p",
        "sub",
        "OTD " +
          Deal.money(s.otd) +
          " \u00b7 real pmt " +
          Deal.money(s.realPayment) +
          " \u00b7 gross ~" +
          Deal.money(s.gross)
      )
    );
    var btn = el("button", "start", "TRY THE DESK AGAIN");
    stage.appendChild(btn);
    root.appendChild(stage);
    return btn;
  }

  global.UI = { mount: mount, title: title, scene: scene, ending: ending };
})(window);

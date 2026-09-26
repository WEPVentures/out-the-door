/* Pre-coded dealer lines. Selected by station id + deal flags. Never invents dollars. */

(function (global) {
  function decorate(station, deal) {
    if (!station) return station;
    var s = Deal.snapshot(deal);
    var line = station.line;
    if (station.id === "desk_inspect") {
      line =
        "Term is " +
        s.term +
        " months. APR is " +
        s.apr.toFixed(1) +
        "%. Add-ons on the sheet: " +
        Deal.money(s.addOns) +
        ". Real payment is " +
        Deal.money(s.realPayment) +
        " — not the " +
        Deal.money(s.quotedPayment) +
        " I circled.";
    }
    if (station.id === "desk_freeze" && deal.frozen) {
      line =
        "One number. Out the door " +
        Deal.money(s.otd) +
        ". Trade " +
        Deal.money(s.trade) +
        ". Cash down " +
        Deal.money(Math.min(deal.down, deal.cash)) +
        ". Boxes don't move again.";
    }
    return { id: station.id, speaker: station.speaker, line: line, choices: station.choices };
  }

  function filterChoices(station, deal) {
    return station.choices.filter(function (c) {
      if (c.action === "freeze" && deal.frozen) return false;
      if (c.action === "cardMarket" && deal.pinned.price) return false;
      if (c.action === "cardTrade" && deal.pinned.trade) return false;
      if (c.action === "cardBank" && deal.pinned.finance) return false;
      return true;
    });
  }

  global.Script = { decorate: decorate, filterChoices: filterChoices };
})(window);

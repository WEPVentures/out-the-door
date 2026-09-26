/* All money lives here. Dialogue must never invent numbers. */

(function (global) {
  var DOC = 499;

  function pmt(principal, apr, months) {
    if (principal <= 0) return 0;
    var r = apr / 100 / 12;
    if (r === 0) return principal / months;
    var pow = Math.pow(1 + r, months);
    return principal * (r * pow) / (pow - 1);
  }

  function money(n) {
    var sign = n < 0 ? "-" : "";
    return sign + "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
  }

  function fresh() {
    return {
      market: 28400,
      asking: 32995,
      outsideTrade: 9800,
      cash: 3000,
      bankApr: 6.9,
      bankTerm: 60,
      price: 32995,
      trade: 7500,
      down: 5000,
      term: 75,
      apr: 17.9,
      addOns: 1995,
      quotedPayment: 489,
      pinned: { price: false, trade: false, finance: false },
      askedOtd: false,
      separated: false,
      inspected: false,
      paymentTarget: false,
      buyIfWorks: false,
      frozen: false,
      walked: false,
      signedBad: false,
      signedGood: false,
      fiAccepted: false
    };
  }

  function otd(d) {
    return d.price + d.addOns + DOC;
  }

  function financed(d) {
    var cashDown = Math.min(d.down, d.cash);
    return otd(d) - d.trade - cashDown;
  }

  function realPayment(d) {
    var apr = d.pinned.finance ? d.bankApr : d.apr;
    var term = d.pinned.finance ? d.bankTerm : d.term;
    return pmt(financed(d), apr, term);
  }

  function displayPayment(d) {
    if (d.frozen) return realPayment(d);
    if (d.inspected) return realPayment(d);
    return d.quotedPayment;
  }

  function dealerGross(d) {
    var pricePad = d.price - d.market;
    var tradeHaircut = d.outsideTrade - d.trade;
    var addonPad = d.addOns * 0.7;
    var ratePad = d.pinned.finance ? 0 : Math.max(0, financed(d) * ((d.apr - d.bankApr) / 100) * 0.35);
    return pricePad + tradeHaircut + addonPad + ratePad;
  }

  function snapshot(d) {
    return {
      price: d.price,
      trade: d.trade,
      down: d.down,
      payment: displayPayment(d),
      realPayment: realPayment(d),
      term: d.pinned.finance ? d.bankTerm : d.term,
      apr: d.pinned.finance ? d.bankApr : d.apr,
      addOns: d.addOns,
      otd: otd(d),
      financed: financed(d),
      gross: dealerGross(d),
      doc: DOC,
      cash: d.cash,
      market: d.market,
      outsideTrade: d.outsideTrade,
      bankApr: d.bankApr,
      bankTerm: d.bankTerm,
      quotedPayment: d.quotedPayment
    };
  }

  function apply(d, action) {
    if (d.frozen && action !== "walk" && action !== "signGood" && action !== "toFi" && action !== "inspect" && action !== "declineFi") {
      return { ok: false, note: "The boxes are frozen. One out-the-door number." };
    }

    switch (action) {
      case "askOtd":
        d.askedOtd = true;
        return { ok: true, note: "otd" };
      case "separate":
        d.separated = true;
        return { ok: true, note: "separate" };
      case "inspect":
        d.inspected = true;
        return { ok: true, note: "inspect" };
      case "paymentTarget":
        d.paymentTarget = true;
        d.quotedPayment = 399;
        d.term = 84;
        d.apr = 19.9;
        d.addOns = Math.max(d.addOns, 2895);
        return { ok: true, note: "trap-pay" };
      case "buyIfWorks":
        d.buyIfWorks = true;
        d.quotedPayment = 459;
        d.term = 78;
        d.addOns = Math.max(d.addOns, 2495);
        return { ok: true, note: "trap-buy" };
      case "cardMarket":
        d.pinned.price = true;
        d.price = d.market;
        return { ok: true, note: "pin-price" };
      case "cardTrade":
        d.pinned.trade = true;
        d.trade = d.outsideTrade;
        return { ok: true, note: "pin-trade" };
      case "cardBank":
        d.pinned.finance = true;
        d.down = Math.min(d.down, d.cash);
        return { ok: true, note: "pin-bank" };
      case "walk":
        d.walked = true;
        return { ok: true, note: "walk" };
      case "freeze":
        if (!d.askedOtd || !d.separated) {
          return { ok: false, note: "need-otd-separate" };
        }
        d.frozen = true;
        if (d.pinned.price) d.price = d.market;
        if (d.pinned.trade) d.trade = d.outsideTrade;
        if (d.pinned.finance) {
          d.apr = d.bankApr;
          d.term = d.bankTerm;
        }
        d.addOns = 0;
        d.down = Math.min(d.down, d.cash);
        d.quotedPayment = realPayment(d);
        return { ok: true, note: "frozen" };
      case "acceptFi":
        d.fiAccepted = true;
        d.addOns += 2200;
        d.signedBad = true;
        return { ok: true, note: "fi-yes" };
      case "declineFi":
        d.fiAccepted = false;
        return { ok: true, note: "fi-no" };
      case "signBad":
        d.signedBad = true;
        return { ok: true, note: "sign-bad" };
      case "signGood":
        d.signedGood = true;
        d.addOns = 0;
        return { ok: true, note: "sign-good" };
      default:
        return { ok: false, note: "unknown" };
    }
  }

  function canFreeze(d) {
    return d.askedOtd && d.separated && d.pinned.price && d.pinned.trade;
  }

  function ending(d) {
    var honest = d.frozen && d.pinned.price && d.pinned.trade;
    if (d.signedBad || d.fiAccepted) return "fake";
    if (d.signedGood && honest) return "honest-lock";
    if (d.walked && honest) return "honest-walk";
    if (d.walked) return "walk-soft";
    if (d.signedGood) return "fake";
    return null;
  }

  global.Deal = {
    DOC: DOC,
    fresh: fresh,
    pmt: pmt,
    money: money,
    otd: otd,
    financed: financed,
    realPayment: realPayment,
    displayPayment: displayPayment,
    dealerGross: dealerGross,
    snapshot: snapshot,
    apply: apply,
    canFreeze: canFreeze,
    ending: ending
  };
})(window);

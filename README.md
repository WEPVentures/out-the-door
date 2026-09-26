# Out the Door

Satirical-but-educational car-buying game. Maniac Mansion desk energy. You vs. a four-square worksheet.

Beat the pencil, or get a cheap payment and a rotten deal.

## What this slice is

Title → one desk scene → short F&I menu → two endings.

- **Honest ending:** freeze one out-the-door number, walk away or lock market price + outside trade + your bank rate.
- **Fake-win ending:** you chase a monthly payment. Term, APR, and add-ons do the dirty work.

No free roam. No 3D lot. No generated dealer chat. All lines are pre-coded.

## How to run locally

Open `index.html` in a browser, or from this folder:

```
npx serve .
```

Fetching `data/stations.json` needs a local server (file:// will fail).

## Netlify

Import `WEPVentures/out-the-door`. Publish directory is `.` (see `netlify.toml`). No build step.

## MVP rules

- Dialogue never invents numbers. `src/deal.js` owns every dollar.
- Four-square boxes: vehicle price, trade-in, down payment, monthly payment.
- Hidden: term months, APR, add-ons, out-the-door, dealer gross.
- Tempting choices drop the payment and worsen the deal.
- Correct choices freeze boxes onto one OTD.

## Starting numbers

| | |
|---|---|
| Market price | $28,400 |
| Dealer asking | $32,995 |
| Outside trade | $9,800 |
| Dealer first trade | $7,500 |
| Cash on hand | $3,000 |
| Preapproval | 6.9% / 60 mo |
| First pencil | $5,000 down, $489/mo, ugly term/rate hidden |

## How to play the slice

Honest path: ask for one OTD → separate the squares → play market card → play trade card → freeze → decline F&I → sign or walk.

Trap path: give a payment target or "I'll buy if numbers work" → sign the pretty payment.

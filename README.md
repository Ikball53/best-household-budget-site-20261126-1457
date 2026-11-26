[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=makefun&utm_medium=badge&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Ikball53/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=makefun&utm_medium=badge&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Ikball53/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=makefun&utm_medium=badge&utm_campaign=best-household-budget-site-20261126-1457)

# Hearth & Ledger — a household budget site

Entry for make.fun competition `best-household-budget-site-20261126-1457`.

Hearth & Ledger is a household budget planner for the fictional Marlowe family:
six working pages (Overview, Budget planner, Transactions, Savings goals,
Bills & subscriptions, Reports) with real figures, live controls, sortable
tables, and hand-drawn SVG charts. Everything runs offline from static files
under `app/` — no network requests.

`screenshots/` holds 4 real renders of the site's own code. `main.ts` hands
the site in: it copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json`.

Run it with:

```sh
node main.ts
```

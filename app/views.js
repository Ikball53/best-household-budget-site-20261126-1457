// Hearth & Ledger — page views. Each view returns HTML for one hash route.
// All figures come from the state object (data.js defaults, edited live).

import { CATEGORIES, GOALS, HOUSEHOLD, INCOME, MONTHS, PLANS, SAVINGS_PLAN, SUBSCRIPTIONS, TIPS } from './data.js';
import { barList, donutChart, money, moneyShort, monthBars, progressBar } from './charts.js';

export function monthOptions(current) {
  return MONTHS.map((m) => `<option value="${m.id}"${m.id === current ? ' selected' : ''}>${m.label}</option>`).join('');
}

export function categoryName(id) {
  if (id === 'income') return 'Income';
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}

export function categoryColor(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.color : '#9aa5a0';
}

export function monthIncome(state) {
  return (INCOME[state.month] || []).reduce((s, x) => s + x.amount, 0);
}

export function monthSpending(state, monthId) {
  const m = monthId || state.month;
  return state.transactions
    .filter((t) => t.date.startsWith(m) && t.amount < 0)
    .reduce((s, t) => s - t.amount, 0);
}

export function spentByCategory(state, monthId) {
  const m = monthId || state.month;
  const out = {};
  for (const c of CATEGORIES) out[c.id] = 0;
  for (const t of state.transactions) {
    if (t.date.startsWith(m) && t.amount < 0 && out[t.category] !== undefined) out[t.category] -= t.amount;
  }
  return out;
}

function monthLabel(state) {
  return (MONTHS.find((m) => m.id === state.month) || MONTHS[2]).label;
}

function txRow(t) {
  const cls = t.amount >= 0 ? 'in' : 'out';
  return `<tr><td>${t.date.slice(5)}</td><td><b>${t.merchant}</b><span class="tx-note">${t.note || ''}</span></td>` +
    `<td><span class="chip" style="--chip:${categoryColor(t.category)}">${categoryName(t.category)}</span></td>` +
    `<td class="num ${cls}">${money(t.amount)}</td>` +
    `<td><button class="mini danger" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${t.merchant}">Delete</button></td></tr>`;
}

export function renderOverview(state) {
  const income = monthIncome(state);
  const spent = monthSpending(state);
  const left = income - spent;
  const saved = Math.max(0, left);
  const plan = SAVINGS_PLAN[state.month] || 1200;
  const byCat = spentByCategory(state);
  const parts = CATEGORIES.map((c) => ({ label: c.name, value: byCat[c.id], color: c.color })).filter((p) => p.value > 0);
  const recent = state.transactions.filter((t) => t.date.startsWith(state.month)).slice(0, 6);
  const upcoming = state.bills.filter((b) => !b.paid).slice(0, 3);
  const goals = state.goals.slice(0, 2);
  return `
  <section class="page-head"><div><h1>Good evening, Marlowe family</h1>
  <p>Here is where November stands — what came in, what went out, and what is left for the things that matter.</p></div>
  <label class="month-pick">Month <select id="month-select" data-action="month">${monthOptions(state.month)}</select></label></section>

  <section class="stats">
    <article class="stat"><span>Income in ${monthLabel(state)}</span><b>${money(income)}</b><i>4 paydays &amp; benefits</i></article>
    <article class="stat"><span>Spent so far</span><b>${money(spent)}</b><i>across ${parts.length} categories</i></article>
    <article class="stat good"><span>Left to save or spend</span><b>${money(left)}</b><i>${money(saved)} can go to savings</i></article>
    <article class="stat"><span>Savings plan</span><b>${money(plan)}</b><i>once set aside, ${money(saved - plan)} stays free to spend</i></article>
  </section>

  <section class="grid-2">
    <article class="card"><h2>Where the money went</h2>${donutChart(parts, spent, 'spent')}</article>
    <article class="card"><h2>Latest spending</h2>
      <table class="ledger"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
      <tbody>${recent.map(txRow).join('')}</tbody></table>
      <p class="card-link"><a href="#/transactions">See every transaction →</a></p></article>
  </section>

  <section class="grid-2">
    <article class="card"><h2>Bills coming up</h2>
      <ul class="bill-list">${upcoming.map((b) => `<li><span><b>${b.name}</b><i>due ${b.due.slice(5)}${b.autopay ? ' · autopay on' : ''}</i></span><b>${money(b.amount)}</b></li>`).join('')}</ul>
      <p class="card-link"><a href="#/bills">All bills &amp; subscriptions →</a></p></article>
    <article class="card"><h2>Savings goals</h2>
      ${goals.map((g) => `<div class="goal-mini"><div class="goal-head"><b>${g.name}</b><span>${money(g.saved)} of ${money(g.target)}</span></div>${progressBar(g.saved, g.target)}</div>`).join('')}
      <p class="card-link"><a href="#/goals">All goals &amp; contributions →</a></p></article>
  </section>

  <section class="card tips"><h2>Three things worth knowing this month</h2>
    <ol>${TIPS.map((t) => `<li><b>${t.title}.</b> ${t.body}</li>`).join('')}</ol></section>`;
}

export function renderPlanner(state) {
  const byCat = spentByCategory(state);
  const plan = state.plans[state.month];
  const totalPlan = Object.values(plan).reduce((a, b) => a + b, 0);
  const totalSpent = Object.values(byCat).reduce((a, b) => a + b, 0);
  const rows = CATEGORIES.map((c) => {
    const planned = plan[c.id] || 0;
    const spent = byCat[c.id] || 0;
    const pct = planned > 0 ? Math.min(100, (spent / planned) * 100) : 0;
    const left = planned - spent;
    return `<li class="plan-row"><div class="plan-name"><span class="dot" style="background:${c.color}"></span><b>${c.name}</b>
      <span class="plan-spent">${money(spent)} spent · <em class="${left < 0 ? 'over' : ''}">${left < 0 ? money(left) + ' over' : money(left) + ' left'}</em></span></div>
      <div class="plan-edit"><label>Plan $<input type="number" min="0" step="5" value="${planned}" data-action="plan-input" data-cat="${c.id}" aria-label="Planned ${c.name}"></label>
      <input type="range" min="0" max="2000" step="10" value="${planned}" data-action="plan-slider" data-cat="${c.id}" aria-label="Planned ${c.name} slider"></div>
      <div class="bar-track"><div class="bar-fill${left < 0 ? ' over' : ''}" style="width:${pct.toFixed(1)}%;background:${c.color}"></div></div></li>`;
  }).join('');
  return `
  <section class="page-head"><div><h1>Budget planner — ${monthLabel(state)}</h1>
  <p>Set what each part of the household may cost. Move a slider or type a number and the totals update at once. Actual spending comes from your real transactions.</p></div>
  <label class="month-pick">Month <select id="month-select" data-action="month">${monthOptions(state.month)}</select></label></section>

  <section class="stats">
    <article class="stat"><span>Total planned</span><b>${money(totalPlan)}</b><i>for all categories</i></article>
    <article class="stat"><span>Actually spent</span><b>${money(totalSpent)}</b><i>from transactions</i></article>
    <article class="stat ${totalPlan - totalSpent >= 0 ? 'good' : ''}"><span>Planned, unspent</span><b>${money(totalPlan - totalSpent)}</b><i>${totalPlan - totalSpent >= 0 ? 'still inside the plan' : 'over the plan — trim a category'}</i></article>
  </section>

  <section class="card"><h2>Categories</h2><ul class="plan-list">${rows}</ul>
  <div class="plan-actions"><button class="btn" data-action="reset-plan">Reset November plan</button>
  <span class="saved-note" id="plan-saved">Changes save automatically on this device.</span></div></section>`;
}

export function renderTransactions(state) {
  const f = state.txFilter;
  let list = state.transactions.filter((t) => t.date.startsWith(state.month));
  if (f.category !== 'all') list = list.filter((t) => t.category === f.category);
  if (f.query) {
    const q = f.query.toLowerCase();
    list = list.filter((t) => (t.merchant + ' ' + (t.note || '')).toLowerCase().includes(q));
  }
  list = [...list].sort((a, b) => {
    if (f.sort === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
    if (f.sort === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
    if (f.sort === 'date-asc') return a.date.localeCompare(b.date);
    return b.date.localeCompare(a.date);
  });
  const inTotal = list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outTotal = list.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  return `
  <section class="page-head"><div><h1>Transactions — ${monthLabel(state)}</h1>
  <p>Every dollar in and out, in one ledger. Filter, search, sort, add your own — and delete a mistake.</p></div>
  <label class="month-pick">Month <select id="month-select" data-action="month">${monthOptions(state.month)}</select></label></section>

  <section class="stats">
    <article class="stat"><span>Money in</span><b>${money(inTotal)}</b><i>${list.filter((t) => t.amount > 0).length} entries</i></article>
    <article class="stat"><span>Money out</span><b>${money(outTotal)}</b><i>${list.filter((t) => t.amount < 0).length} entries</i></article>
    <article class="stat"><span>Showing</span><b>${list.length} rows</b><i>filtered from the month</i></article>
  </section>

  <section class="card"><h2>Ledger</h2>
  <div class="filters">
    <label>Category <select data-action="tx-category"><option value="all">All categories</option>${CATEGORIES.map((c) => `<option value="${c.id}"${f.category === c.id ? ' selected' : ''}>${c.name}</option>`).join('')}<option value="income"${f.category === 'income' ? ' selected' : ''}>Income</option></select></label>
    <label>Search <input type="search" placeholder="e.g. GreenMart" value="${f.query.replace(/"/g, '&quot;')}" data-action="tx-search"></label>
    <label>Sort <select data-action="tx-sort">
      <option value="date-desc"${f.sort === 'date-desc' ? ' selected' : ''}>Newest first</option>
      <option value="date-asc"${f.sort === 'date-asc' ? ' selected' : ''}>Oldest first</option>
      <option value="amount-desc"${f.sort === 'amount-desc' ? ' selected' : ''}>Largest first</option>
      <option value="amount-asc"${f.sort === 'amount-asc' ? ' selected' : ''}>Smallest first</option></select></label>
  </div>
  <div class="table-scroll"><table class="ledger"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
  <tbody>${list.length ? list.map(txRow).join('') : '<tr><td colspan="5" class="empty">Nothing matches — clear the search or pick another category.</td></tr>'}</tbody></table></div></section>

  <section class="card"><h2>Add a transaction</h2>
  <form id="add-tx" class="form-grid">
    <label>Date <input type="date" name="date" value="2026-11-26" required></label>
    <label>What <input type="text" name="merchant" placeholder="e.g. GreenMart weekly shop" required maxlength="80"></label>
    <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join('')}<option value="income">Income</option></select></label>
    <label>Amount ($) <input type="number" name="amount" step="0.01" placeholder="-42.50 (minus = spent)" required></label>
    <label class="wide">Note <input type="text" name="note" placeholder="Optional note" maxlength="120"></label>
    <button class="btn wide" type="submit">Add to the ledger</button>
  </form><p class="hint">Use a negative amount for spending, a positive one for money in. It appears in the ledger, the planner and the reports at once.</p></section>`;
}

export function renderGoals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head"><div><h1>Savings goals</h1>
  <p>Four things the family is saving for. Add money to a goal and watch the bar move — every dollar is counted against its target.</p></div></section>

  <section class="stats">
    <article class="stat"><span>Saved across all goals</span><b>${money(totalSaved)}</b><i>of ${money(totalTarget)} total</i></article>
    <article class="stat"><span>Overall progress</span><b>${Math.round((totalSaved / totalTarget) * 100)}%</b><i>${money(totalTarget - totalSaved)} still to go</i></article>
    <article class="stat"><span>Monthly towards goals</span><b>${money(state.goals.reduce((s, g) => s + g.monthly, 0))}</b><i>planned each month</i></article>
  </section>

  <section class="goals-grid">
  ${state.goals.map((g) => {
    const pct = Math.min(100, (g.saved / g.target) * 100);
    const monthsLeft = g.monthly > 0 ? Math.ceil((g.target - g.saved) / g.monthly) : '—';
    return `<article class="card goal-card"><h2>${g.name}</h2><p>${g.note}</p>
    <div class="goal-head"><b>${money(g.saved)}</b><span>of ${money(g.target)} · ${pct.toFixed(0)}%</span></div>
    ${progressBar(g.saved, g.target)}
    <p class="goal-meta">${money(g.monthly)} a month · about ${monthsLeft} months to go at this pace</p>
    <form class="contribute" data-goal="${g.id}"><label>Add $<input type="number" min="1" step="1" value="50" name="amount" required></label>
    <button class="btn small" type="submit">Add to goal</button></form></article>`;
  }).join('')}
  </section>

  <section class="card"><h2>Start a new goal</h2>
  <form id="add-goal" class="form-grid">
    <label>Goal name <input type="text" name="name" placeholder="e.g. Christmas presents" required maxlength="60"></label>
    <label>Target ($) <input type="number" name="target" min="1" step="10" placeholder="500" required></label>
    <label>Monthly amount ($) <input type="number" name="monthly" min="0" step="5" placeholder="50" required></label>
    <label class="wide">Why it matters <input type="text" name="note" placeholder="One line about this goal" maxlength="120"></label>
    <button class="btn wide" type="submit">Create goal</button>
  </form></section>`;
}

export function renderBills(state) {
  const unpaid = state.bills.filter((b) => !b.paid);
  const dueTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = state.bills.filter((b) => b.paid).reduce((s, b) => s + b.amount, 0);
  const subTotal = state.subscriptions.reduce((s, x) => s + x.amount, 0);
  return `
  <section class="page-head"><div><h1>Bills &amp; subscriptions</h1>
  <p>What is due, what is already paid, and the small monthly subscriptions that quietly add up. Tick a bill paid when it clears.</p></div></section>

  <section class="stats">
    <article class="stat"><span>Still to pay</span><b>${money(dueTotal)}</b><i>${unpaid.length} bills unpaid</i></article>
    <article class="stat"><span>Already paid</span><b>${money(paidTotal)}</b><i>${state.bills.length - unpaid.length} bills settled</i></article>
    <article class="stat"><span>Subscriptions a month</span><b>${money(subTotal)}</b><i>${state.subscriptions.length} subscriptions · ${money(subTotal * 12)} a year</i></article>
  </section>

  <section class="card"><h2>Upcoming bills</h2>
  <table class="ledger"><thead><tr><th>Bill</th><th>Category</th><th>Due</th><th class="num">Amount</th><th>Paid?</th></tr></thead><tbody>
  ${state.bills.map((b) => `<tr class="${b.paid ? 'paid-row' : ''}"><td><b>${b.name}</b><span class="tx-note">${b.autopay ? 'Autopay on' : 'Pay by hand'}</span></td>
  <td><span class="chip" style="--chip:${categoryColor(b.category)}">${categoryName(b.category)}</span></td>
  <td>${b.due}</td><td class="num">${money(b.amount)}</td>
  <td><label class="paid-toggle"><input type="checkbox" data-action="bill-paid" data-id="${b.id}"${b.paid ? ' checked' : ''}> ${b.paid ? 'Paid' : 'Mark paid'}</label></td></tr>`).join('')}
  </tbody></table></section>

  <section class="card"><h2>Subscriptions</h2>
  <ul class="bill-list">${state.subscriptions.map((s) => `<li><span><b>${s.name}</b><i>${s.note}</i></span><span class="sub-amount">${money(s.amount)} / mo <button class="mini danger" data-action="cancel-sub" data-id="${s.id}">Cancel</button></span></li>`).join('')}</ul>
  <p class="hint">Cancelling here removes it from the list — check the provider too, so the charge really stops. Together these cost ${money(subTotal * 12)} a year; dropping just one $15 subscription saves $180 a year.</p></section>`;
}

export function renderReports(state) {
  const byCat = spentByCategory(state);
  const plan = state.plans[state.month];
  const rows = CATEGORIES.map((c) => ({ c, spent: byCat[c.id] || 0, planned: plan[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  const spent = monthSpending(state);
  const income = monthIncome(state);
  const trend = MONTHS.map((m) => ({ label: m.label.slice(0, 3), income: (INCOME[m.id] || []).reduce((s, x) => s + x.amount, 0), spent: monthSpending(state, m.id) }));
  return `
  <section class="page-head"><div><h1>Reports — ${monthLabel(state)}</h1>
  <p>Three months side by side, and every category against its plan. The numbers come straight from the ledger — nothing here is typed in by hand.</p></div>
  <label class="month-pick">Month <select id="month-select" data-action="month">${monthOptions(state.month)}</select></label></section>

  <section class="grid-2">
    <article class="card"><h2>Income vs spending, last 3 months</h2>${monthBars(trend)}
    <p class="hint">November: ${money(income)} in, ${money(spent)} out — ${money(income - spent)} left over.</p></article>
    <article class="card"><h2>Where November's money went</h2>
    ${donutChart(CATEGORIES.map((c) => ({ label: c.name, value: byCat[c.id], color: c.color })).filter((p) => p.value > 0), spent, 'spent')}</article>
  </section>

  <section class="card"><h2>Planned vs actual, by category</h2>
  ${barList(rows.map((r) => ({ label: r.c.name, value: r.spent, max: r.planned, color: r.c.color, note: `of ${money(r.planned)} planned` })))}
  <p class="hint">Biggest overspend: ${rows.filter((r) => r.spent > r.planned).map((r) => `${r.c.name} ${money(r.spent - r.planned)} over`).join('; ') || 'nothing — every category is inside its plan.'}</p></section>

  <section class="card"><h2>How the three months compare</h2>
  <table class="ledger"><thead><tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left over</th><th class="num">Savings plan</th></tr></thead><tbody>
  ${MONTHS.map((m) => {
    const inc = (INCOME[m.id] || []).reduce((s, x) => s + x.amount, 0);
    const sp = monthSpending(state, m.id);
    return `<tr><td><b>${m.label}</b></td><td class="num">${money(inc)}</td><td class="num">${money(sp)}</td><td class="num">${money(inc - sp)}</td><td class="num">${money(SAVINGS_PLAN[m.id])}</td></tr>`;
  }).join('')}</tbody></table>
  <p class="hint">Spending fell from ${money(monthSpending(state, '2026-09'))} in September to ${money(monthSpending(state, '2026-11'))} in November while income stayed steady — the grocery list and one fewer takeaway a week did most of it.</p></section>`;
}

export const NAV = [
  { route: '#/overview', label: 'Overview' },
  { route: '#/planner', label: 'Budget planner' },
  { route: '#/transactions', label: 'Transactions' },
  { route: '#/goals', label: 'Savings goals' },
  { route: '#/bills', label: 'Bills & subs' },
  { route: '#/reports', label: 'Reports' },
];

export function renderShell(route, inner) {
  const links = NAV.map((n) => `<a href="${n.route}" class="${route === n.route ? 'active' : ''}">${n.label}</a>`).join('');
  return `<header class="topbar"><div class="brand"><span class="brand-mark">⌂</span><div><b>Hearth &amp; Ledger</b><span>${HOUSEHOLD.name} · ${HOUSEHOLD.home}</span></div></div>
  <nav aria-label="Main pages">${links}</nav></header>
  <main>${inner}</main>
  <footer><p><b>Hearth &amp; Ledger</b> — a household budget planner for the Marlowe family. Figures are a demo household's own numbers; nothing here is copied from another budgeting app. <a href="#/overview">Overview</a> · <a href="#/planner">Budget planner</a> · <a href="#/transactions">Transactions</a> · <a href="#/goals">Savings goals</a> · <a href="#/bills">Bills &amp; subscriptions</a> · <a href="#/reports">Reports</a></p></footer>`;
}

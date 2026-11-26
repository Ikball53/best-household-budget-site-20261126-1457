// Hearth & Ledger — app controller: routing, state and every control.
// State starts from data.js and is saved to localStorage so edits survive
// a reload. The site works fully without localStorage too.

import { BILLS, GOALS, MONTHS, PLANS, SUBSCRIPTIONS, TRANSACTIONS } from './data.js';
import { renderBills, renderGoals, renderOverview, renderPlanner, renderReports, renderShell, renderTransactions } from './views.js';

const STORE_KEY = 'hearth-and-ledger-v1';

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function loadState() {
  const base = {
    month: '2026-11',
    plans: clone(PLANS),
    transactions: clone(TRANSACTIONS),
    goals: clone(GOALS),
    bills: clone(BILLS),
    subscriptions: clone(SUBSCRIPTIONS),
    txFilter: { category: 'all', query: '', sort: 'date-desc' },
  };
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        for (const k of ['month', 'plans', 'transactions', 'goals', 'bills', 'subscriptions']) {
          if (saved[k] !== undefined) base[k] = saved[k];
        }
      }
    }
  } catch (e) { /* private mode or blocked storage: keep the built-in figures */ }
  return base;
}

function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({
      month: state.month,
      plans: state.plans,
      transactions: state.transactions,
      goals: state.goals,
      bills: state.bills,
      subscriptions: state.subscriptions,
    }));
  } catch (e) { /* storage unavailable: the site still works in memory */ }
}

const state = loadState();

const ROUTES = {
  '#/overview': renderOverview,
  '#/planner': renderPlanner,
  '#/transactions': renderTransactions,
  '#/goals': renderGoals,
  '#/bills': renderBills,
  '#/reports': renderReports,
};

function currentRoute() {
  const hash = location.hash || '#/overview';
  return ROUTES[hash] ? hash : '#/overview';
}

function render() {
  const route = currentRoute();
  const root = document.getElementById('app');
  root.innerHTML = renderShell(route, ROUTES[route](state));
  document.title = 'Hearth & Ledger — ' + route.replace('#/', '').replace(/^\w/, (c) => c.toUpperCase());
  window.scrollTo(0, 0);
}

function rerender() {
  saveState(state);
  render();
}

function moneyInput(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

document.addEventListener('change', (event) => {
  const el = event.target;
  const action = el.dataset.action;
  if (action === 'month' && MONTHS.some((m) => m.id === el.value)) {
    state.month = el.value;
    state.txFilter.query = '';
    rerender();
  } else if (action === 'plan-input' || action === 'plan-slider') {
    const plan = state.plans[state.month];
    plan[el.dataset.cat] = Math.max(0, moneyInput(el.value));
    rerender();
  } else if (action === 'tx-category') {
    state.txFilter.category = el.value;
    render();
  } else if (action === 'tx-sort') {
    state.txFilter.sort = el.value;
    render();
  } else if (action === 'bill-paid') {
    const bill = state.bills.find((b) => b.id === el.dataset.id);
    if (bill) bill.paid = el.checked;
    rerender();
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.dataset.action === 'tx-search') {
    state.txFilter.query = el.value;
    const pos = el.selectionStart;
    render();
    const next = document.querySelector('[data-action="tx-search"]');
    if (next) { next.focus(); next.setSelectionRange(pos, pos); }
  } else if (el.dataset.action === 'plan-slider') {
    const plan = state.plans[state.month];
    plan[el.dataset.cat] = Math.max(0, moneyInput(el.value));
    const num = document.querySelector(`[data-action="plan-input"][data-cat="${el.dataset.cat}"]`);
    if (num) num.value = el.value;
    const totals = document.querySelectorAll('.stats .stat b');
    if (totals.length >= 3) {
      const totalPlan = Object.values(plan).reduce((a, b) => a + b, 0);
      totals[0].textContent = '$' + totalPlan.toLocaleString('en-US', { minimumFractionDigits: 2 });
    }
    saveState(state);
  }
});

document.addEventListener('click', (event) => {
  const el = event.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== el.dataset.id);
    rerender();
  } else if (action === 'cancel-sub') {
    state.subscriptions = state.subscriptions.filter((s) => s.id !== el.dataset.id);
    rerender();
  } else if (action === 'reset-plan') {
    state.plans[state.month] = clone(PLANS[state.month]);
    rerender();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();
  if (form.id === 'add-tx') {
    const data = new FormData(form);
    const amount = moneyInput(data.get('amount'));
    const tx = {
      id: 'u' + Date.now(),
      date: String(data.get('date') || '2026-11-26'),
      merchant: String(data.get('merchant') || '').trim() || 'Untitled',
      category: String(data.get('category') || 'other'),
      amount,
      note: String(data.get('note') || '').trim(),
    };
    state.transactions.unshift(tx);
    if (tx.date.startsWith(state.month) === false) state.month = tx.date.slice(0, 7);
    state.txFilter = { category: 'all', query: '', sort: 'date-desc' };
    location.hash = '#/transactions';
    rerender();
  } else if (form.id === 'add-goal') {
    const data = new FormData(form);
    state.goals.push({
      id: 'g' + Date.now(),
      name: String(data.get('name') || '').trim() || 'New goal',
      target: Math.max(1, moneyInput(data.get('target'))),
      saved: 0,
      monthly: Math.max(0, moneyInput(data.get('monthly'))),
      note: String(data.get('note') || '').trim(),
    });
    rerender();
  } else if (form.classList.contains('contribute')) {
    const data = new FormData(form);
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    const amount = moneyInput(data.get('amount'));
    if (goal && amount > 0) goal.saved = Math.min(goal.target, goal.saved + amount);
    rerender();
  }
});

window.addEventListener('hashchange', render);
render();

// Hearth & Ledger — hand-drawn SVG charts. No libraries, no network.
// Every chart is built from plain numbers and returned as an SVG string.

export function money(n) {
  const sign = n < 0 ? '−' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function moneyShort(n) {
  if (Math.abs(n) >= 1000) return '$' + (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return '$' + Math.round(n);
}

// Donut chart: parts = [{label, value, color}]. Centre shows the total.
export function donutChart(parts, total, centreLabel) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const stroke = 30;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let arcs = '';
  for (const p of parts) {
    if (p.value <= 0) continue;
    const frac = p.value / total;
    const len = Math.max(frac * circ - 2, 0.5);
    arcs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}" stroke-width="${stroke}" stroke-dasharray="${len.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(-offset).toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"><title>${p.label}: ${money(p.value)}</title></circle>`;
    offset += frac * circ;
  }
  const legend = parts.filter((p) => p.value > 0).map((p) =>
    `<li><span class="dot" style="background:${p.color}"></span>${p.label}<b>${money(p.value)}</b></li>`).join('');
  return `<div class="donut-wrap"><svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, total ${money(total)}">${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${moneyShort(total)}</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">${centreLabel}</text></svg><ul class="legend">${legend}</ul></div>`;
}

// Horizontal bars: rows = [{label, value, max, color, note}]
export function barList(rows) {
  return '<ul class="bars">' + rows.map((r) => {
    const pct = r.max > 0 ? Math.min(100, (r.value / r.max) * 100) : 0;
    const over = r.value > r.max;
    return `<li><div class="bar-head"><span>${r.label}</span><b class="${over ? 'over' : ''}">${money(r.value)}${r.note ? ` <i>${r.note}</i>` : ''}</b></div>` +
      `<div class="bar-track"><div class="bar-fill${over ? ' over' : ''}" style="width:${pct.toFixed(1)}%;background:${r.color}"></div></div></li>`;
  }).join('') + '</ul>';
}

// Vertical month bars: months = [{label, income, spent}]
export function monthBars(months) {
  const max = Math.max(...months.flatMap((m) => [m.income, m.spent]), 1);
  const h = 150;
  const bars = months.map((m, i) => {
    const x = 30 + i * 110;
    const ih = (m.income / max) * h;
    const sh = (m.spent / max) * h;
    return `<g><rect x="${x}" y="${(h - ih).toFixed(1)}" width="34" height="${ih.toFixed(1)}" rx="4" fill="#1f4d3a"><title>${m.label} income ${money(m.income)}</title></rect>` +
      `<rect x="${x + 40}" y="${(h - sh).toFixed(1)}" width="34" height="${sh.toFixed(1)}" rx="4" fill="#c96f3f"><title>${m.label} spending ${money(m.spent)}</title></rect>` +
      `<text x="${x + 37}" y="${h + 18}" text-anchor="middle" class="axis">${m.label}</text>` +
      `<text x="${x + 17}" y="${(h - ih - 6).toFixed(1)}" text-anchor="middle" class="axis-num">${moneyShort(m.income)}</text>` +
      `<text x="${x + 57}" y="${(h - sh - 6).toFixed(1)}" text-anchor="middle" class="axis-num">${moneyShort(m.spent)}</text></g>`;
  }).join('');
  return `<svg class="month-chart" viewBox="0 0 380 ${h + 26}" role="img" aria-label="Income versus spending by month"><line x1="8" y1="${h}" x2="372" y2="${h}" stroke="#d8cfc0" stroke-width="1"/>${bars}</svg>` +
    `<p class="chart-key"><span><i style="background:#1f4d3a"></i>Income</span><span><i style="background:#c96f3f"></i>Spending</span></p>`;
}

// Simple progress bar used by goals and savings.
export function progressBar(saved, target) {
  const pct = Math.min(100, (saved / target) * 100);
  return `<div class="bar-track big"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:#1f4d3a"></div></div>`;
}

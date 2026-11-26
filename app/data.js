// Hearth & Ledger — household data for the Marlowe family.
// All figures are invented for this demo household: two earners,
// two children, one home, November 2026 as the current month.

export const HOUSEHOLD = {
  name: 'The Marlowe Household',
  members: ['Maya Marlowe', 'Tom Marlowe', 'June (9)', 'Leo (6)'],
  home: '3-bed house, Willow Lane',
  currency: 'USD',
};

export const MONTHS = [
  { id: '2026-09', label: 'September 2026' },
  { id: '2026-10', label: 'October 2026' },
  { id: '2026-11', label: 'November 2026' },
];

export const CATEGORIES = [
  { id: 'housing', name: 'Housing', color: '#1f4d3a', icon: '⌂' },
  { id: 'groceries', name: 'Groceries', color: '#c96f3f', icon: '◍' },
  { id: 'transport', name: 'Transport', color: '#2e6f8e', icon: '➤' },
  { id: 'utilities', name: 'Utilities', color: '#8a6d3b', icon: '⚡' },
  { id: 'dining', name: 'Dining out', color: '#b8455a', icon: '🍽' },
  { id: 'kids', name: 'Kids & school', color: '#6a5a9e', icon: '✎' },
  { id: 'health', name: 'Health', color: '#3d8a5f', icon: '✚' },
  { id: 'fun', name: 'Fun & streaming', color: '#d9a441', icon: '♪' },
  { id: 'clothing', name: 'Clothing', color: '#7a7a72', icon: '✂' },
  { id: 'other', name: 'Everything else', color: '#9aa5a0', icon: '○' },
];

export const INCOME = {
  '2026-09': [
    { source: 'Maya — salary (school office)', amount: 3850 },
    { source: 'Tom — salary (delivery depot)', amount: 3420 },
    { source: 'Tom — weekend overtime', amount: 310 },
    { source: 'Refund — energy credit', amount: 85 },
  ],
  '2026-10': [
    { source: 'Maya — salary (school office)', amount: 3850 },
    { source: 'Tom — salary (delivery depot)', amount: 3420 },
    { source: 'Tom — weekend overtime', amount: 265 },
    { source: 'Sold — kids bikes (2nd hand)', amount: 140 },
  ],
  '2026-11': [
    { source: 'Maya — salary (school office)', amount: 3850 },
    { source: 'Tom — salary (delivery depot)', amount: 3420 },
    { source: 'Tom — weekend overtime', amount: 290 },
    { source: 'Child benefit', amount: 290 },
  ],
};

// Planned monthly budget per category (November is the editable one;
// September and October keep their original plans for comparison).
export const PLANS = {
  '2026-09': { housing: 1850, groceries: 700, transport: 420, utilities: 260, dining: 240, kids: 300, health: 150, fun: 140, clothing: 90, other: 120 },
  '2026-10': { housing: 1850, groceries: 720, transport: 410, utilities: 275, dining: 260, kids: 330, health: 170, fun: 150, clothing: 110, other: 130 },
  '2026-11': { housing: 1850, groceries: 740, transport: 410, utilities: 290, dining: 260, kids: 340, health: 180, fun: 150, clothing: 120, other: 140 },
};

export const SAVINGS_PLAN = { '2026-09': 1150, '2026-10': 1200, '2026-11': 1200 };

export const TRANSACTIONS = [
  // November 2026 — the live month
  { id: 't101', date: '2026-11-25', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -86.40, note: 'Weekly shop, incl. Leo’s lunchbox bits' },
  { id: 't102', date: '2026-11-24', merchant: 'City Power & Light', category: 'utilities', amount: -132.10, note: 'Electricity, November bill' },
  { id: 't103', date: '2026-11-23', merchant: 'Maya — salary', category: 'income', amount: 3850.00, note: 'Payday' },
  { id: 't104', date: '2026-11-22', merchant: 'Riverside Pizzeria', category: 'dining', amount: -48.75, note: 'Saturday family pizza night' },
  { id: 't105', date: '2026-11-21', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -92.15, note: 'Weekly shop' },
  { id: 't106', date: '2026-11-20', merchant: 'Sunrise Pharmacy', category: 'health', amount: -34.60, note: 'Leo’s inhaler refill' },
  { id: 't107', date: '2026-11-19', merchant: 'Tom — salary', category: 'income', amount: 3420.00, note: 'Payday' },
  { id: 't108', date: '2026-11-18', merchant: 'School — June art club', category: 'kids', amount: -45.00, note: 'Autumn term art club' },
  { id: 't109', date: '2026-11-17', merchant: 'Petrol — Route 9 station', category: 'transport', amount: -52.30, note: 'Full tank, Tom’s van' },
  { id: 't110', date: '2026-11-16', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -78.90, note: 'Weekly shop' },
  { id: 't111', date: '2026-11-15', merchant: 'Willow Lane Cinema', category: 'fun', amount: -31.50, note: 'Family film, 4 tickets' },
  { id: 't112', date: '2026-11-14', merchant: 'Kids Shoes Co.', category: 'clothing', amount: -64.00, note: 'June’s winter boots' },
  { id: 't113', date: '2026-11-13', merchant: 'Water & Sewerage', category: 'utilities', amount: -58.40, note: 'Quarterly water bill' },
  { id: 't114', date: '2026-11-12', merchant: 'Tom — overtime', category: 'income', amount: 290.00, note: 'Weekend overtime pay' },
  { id: 't115', date: '2026-11-11', merchant: 'Corner Bakery', category: 'groceries', amount: -18.25, note: 'Bread, milk, eggs top-up' },
  { id: 't116', date: '2026-11-10', merchant: 'Bus passes — Maya', category: 'transport', amount: -62.00, note: 'Monthly bus pass' },
  { id: 't117', date: '2026-11-09', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -84.55, note: 'Weekly shop' },
  { id: 't118', date: '2026-11-08', merchant: 'Noodle House', category: 'dining', amount: -36.20, note: 'Takeaway after football' },
  { id: 't119', date: '2026-11-07', merchant: 'Dentist — checkups', category: 'health', amount: -90.00, note: 'June + Leo checkups' },
  { id: 't120', date: '2026-11-06', merchant: 'Mortgage — Willow Bank', category: 'housing', amount: -1850.00, note: 'Monthly mortgage' },
  { id: 't121', date: '2026-11-05', merchant: 'StreamBox subscription', category: 'fun', amount: -14.99, note: 'Monthly streaming' },
  { id: 't122', date: '2026-11-04', merchant: 'Child benefit', category: 'income', amount: 290.00, note: 'Monthly benefit' },
  { id: 't123', date: '2026-11-03', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -81.70, note: 'Weekly shop' },
  { id: 't124', date: '2026-11-02', merchant: 'School lunches — Leo', category: 'kids', amount: -58.00, note: 'November lunch money' },
  { id: 't125', date: '2026-11-01', merchant: 'Petrol — Route 9 station', category: 'transport', amount: -48.75, note: 'Full tank' },
  // October 2026
  { id: 't201', date: '2026-10-28', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -88.30, note: 'Weekly shop' },
  { id: 't202', date: '2026-10-24', merchant: 'Mortgage — Willow Bank', category: 'housing', amount: -1850.00, note: 'Monthly mortgage' },
  { id: 't203', date: '2026-10-21', merchant: 'Riverside Pizzeria', category: 'dining', amount: -52.10, note: 'Birthday pizza for June' },
  { id: 't204', date: '2026-10-15', merchant: 'City Power & Light', category: 'utilities', amount: -118.60, note: 'Electricity, October bill' },
  { id: 't205', date: '2026-10-10', merchant: 'Kids Shoes Co.', category: 'clothing', amount: -71.50, note: 'Leo’s school shoes' },
  { id: 't206', date: '2026-10-06', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -95.40, note: 'Weekly shop' },
  { id: 't207', date: '2026-10-02', merchant: 'Petrol — Route 9 station', category: 'transport', amount: -55.80, note: 'Full tank' },
  // September 2026
  { id: 't301', date: '2026-09-27', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -79.85, note: 'Weekly shop' },
  { id: 't302', date: '2026-09-24', merchant: 'Mortgage — Willow Bank', category: 'housing', amount: -1850.00, note: 'Monthly mortgage' },
  { id: 't303', date: '2026-09-18', merchant: 'School — uniforms', category: 'kids', amount: -112.00, note: 'New term uniforms' },
  { id: 't304', date: '2026-09-12', merchant: 'City Power & Light', category: 'utilities', amount: -104.20, note: 'Electricity, September bill' },
  { id: 't305', date: '2026-09-05', merchant: 'GreenMart weekly shop', category: 'groceries', amount: -83.60, note: 'Weekly shop' },
];

export const GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 6000, saved: 4720, monthly: 400, note: 'Six months of essentials, for peace of mind.' },
  { id: 'g2', name: 'Summer holiday — seaside cottage', target: 2400, saved: 1350, monthly: 250, note: 'One week by the sea next July, kids included.' },
  { id: 'g3', name: 'New family car deposit', target: 5000, saved: 1980, monthly: 350, note: 'Replace Tom’s van before it gives up.' },
  { id: 'g4', name: 'June’s bike fund', target: 320, saved: 265, monthly: 40, note: 'June is saving half herself from pocket money.' },
];

export const BILLS = [
  { id: 'b1', name: 'Mortgage — Willow Bank', amount: 1850.00, due: '2026-12-06', category: 'housing', autopay: true, paid: false },
  { id: 'b2', name: 'City Power & Light', amount: 128.00, due: '2026-12-15', category: 'utilities', autopay: true, paid: false },
  { id: 'b3', name: 'Water & Sewerage', amount: 61.00, due: '2026-12-18', category: 'utilities', autopay: false, paid: false },
  { id: 'b4', name: 'Home insurance — SafeRoof', amount: 74.50, due: '2026-12-20', category: 'housing', autopay: true, paid: false },
  { id: 'b5', name: 'Internet — FastLane 300', amount: 59.00, due: '2026-12-22', category: 'utilities', autopay: true, paid: false },
  { id: 'b6', name: 'School lunches — Leo', amount: 58.00, due: '2026-12-02', category: 'kids', autopay: false, paid: true },
  { id: 'b7', name: 'Dentist — Maya checkup', amount: 65.00, due: '2026-12-09', category: 'health', autopay: false, paid: false },
];

export const SUBSCRIPTIONS = [
  { id: 's1', name: 'StreamBox', amount: 14.99, period: 'monthly', category: 'fun', note: 'Films & series, whole family' },
  { id: 's2', name: 'TuneWave Family', amount: 16.99, period: 'monthly', category: 'fun', note: 'Music for all four of us' },
  { id: 's3', name: 'Cloud Photos 200 GB', amount: 2.99, period: 'monthly', category: 'other', note: 'Family photo backup' },
  { id: 's4', name: 'Kids Reading App', amount: 7.99, period: 'monthly', category: 'kids', note: 'June + Leo reading club' },
  { id: 's5', name: 'Gym — Maya', amount: 32.00, period: 'monthly', category: 'health', note: 'Off-peak membership' },
  { id: 's6', name: 'Meal Plan Magazine', amount: 5.50, period: 'monthly', category: 'groceries', note: 'Weekly recipe ideas' },
];

export const TIPS = [
  { title: 'Groceries are running $38 over plan', body: 'Four weekly shops averaged $85.80. A written list before GreenMart usually pulls this back under $80 a shop.' },
  { title: 'Dining out is your easiest win', body: 'Two takeaways cost $84.95 this month. One home-cooked Friday a month frees about $40 for the holiday fund.' },
  { title: 'You are $212 ahead on savings', body: 'Income minus spending leaves $1,412 against a $1,200 savings plan. Move the extra to the emergency fund now.' },
];

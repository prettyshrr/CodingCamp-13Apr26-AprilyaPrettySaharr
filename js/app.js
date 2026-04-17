/**
 * Expense & Budget Visualizer
 * Single-file vanilla JS app — no frameworks, no build tools.
 */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = {
  transactions: [],   // Transaction[]
  theme: 'light',     // 'light' | 'dark'
  sortOrder: 'none',  // 'none' | 'amount-asc' | 'amount-desc' | 'category-asc'
  spendingLimit: null // number | null
};

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'expense-app-state';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Storage unavailable (e.g. private mode quota) — silently continue
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.transactions)) state.transactions = saved.transactions;
    if (saved.theme === 'light' || saved.theme === 'dark') state.theme = saved.theme;
    if (['none', 'amount-asc', 'amount-desc', 'category-asc'].includes(saved.sortOrder)) {
      state.sortOrder = saved.sortOrder;
    }
    state.spendingLimit = (typeof saved.spendingLimit === 'number' && saved.spendingLimit >= 0)
      ? saved.spendingLimit
      : null;
  } catch (e) {
    // Malformed JSON or storage error — fall back to defaults already set above
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateForm() {
  const nameEl     = document.getElementById('item-name');
  const amountEl   = document.getElementById('item-amount');
  const categoryEl = document.getElementById('item-category');
  const errName    = document.getElementById('error-name');
  const errAmount  = document.getElementById('error-amount');
  const errCat     = document.getElementById('error-category');

  // Clear previous errors
  errName.textContent   = '';
  errAmount.textContent = '';
  errCat.textContent    = '';

  const errors = {};
  let valid = true;

  const name     = nameEl.value.trim();
  const amount   = parseFloat(amountEl.value);
  const category = categoryEl.value;

  if (!name) {
    errors.name = 'Item name is required.';
    errName.textContent = errors.name;
    valid = false;
  }

  if (!amountEl.value || isNaN(amount) || amount <= 0) {
    errors.amount = 'Please enter a positive amount.';
    errAmount.textContent = errors.amount;
    valid = false;
  }

  if (!category) {
    errors.category = 'Please select a category.';
    errCat.textContent = errors.category;
    valid = false;
  }

  return { valid, errors };
}

// ---------------------------------------------------------------------------
// Transaction CRUD
// ---------------------------------------------------------------------------

function addTransaction(name, amount, category) {
  const id = generateId();
  state.transactions.push({ id, name, amount, category });
  saveState();
  renderAll();
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t => t.id !== id);
  saveState();
  renderAll();
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

function onFormSubmit(e) {
  e.preventDefault();
  const { valid } = validateForm();
  if (!valid) return;

  const name     = document.getElementById('item-name').value.trim();
  const amount   = parseFloat(document.getElementById('item-amount').value);
  const category = document.getElementById('item-category').value;

  addTransaction(name, amount, category);

  // Reset form
  document.getElementById('item-name').value     = '';
  document.getElementById('item-amount').value   = '';
  document.getElementById('item-category').value = '';
}

function onThemeToggle() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(state.theme);
  saveState();

  const btn = document.getElementById('theme-toggle');
  btn.textContent = state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function onSortChange(e) {
  state.sortOrder = e.target.value;
  // Sort is not persisted per spec
  renderTransactionList();
}

function onLimitChange(e) {
  const val = parseFloat(e.target.value);
  state.spendingLimit = (!isNaN(val) && val >= 0) ? val : null;
  saveState();
  applyHighlights();
}

// ---------------------------------------------------------------------------
// Rendering — Balance
// ---------------------------------------------------------------------------

function renderBalance() {
  const total = state.transactions.reduce((sum, t) => sum + t.amount, 0);
  document.getElementById('balance-display').textContent = formatIDR(total);
}

// ---------------------------------------------------------------------------
// Rendering — Sorting
// ---------------------------------------------------------------------------

function getSortedTransactions() {
  const copy = [...state.transactions];
  switch (state.sortOrder) {
    case 'amount-asc':
      return copy.sort((a, b) => a.amount - b.amount);
    case 'amount-desc':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'category-asc':
      return copy.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return copy; // insertion order
  }
}

// ---------------------------------------------------------------------------
// Rendering — Highlights
// ---------------------------------------------------------------------------

function applyHighlights() {
  const items = document.querySelectorAll('#transaction-list li');
  items.forEach(li => {
    const amount = parseFloat(li.dataset.amount);
    if (state.spendingLimit !== null && amount > state.spendingLimit) {
      li.classList.add('over-limit');
    } else {
      li.classList.remove('over-limit');
    }
  });
}

// ---------------------------------------------------------------------------
// Rendering — Transaction list
// ---------------------------------------------------------------------------

function renderTransactionList() {
  const list       = document.getElementById('transaction-list');
  const emptyState = document.getElementById('empty-state');
  const sorted     = getSortedTransactions();

  list.innerHTML = '';

  if (sorted.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    sorted.forEach(t => {
      const li = document.createElement('li');
      li.dataset.id     = t.id;
      li.dataset.amount = t.amount;

      li.innerHTML = `
        <div class="transaction-info">
          <span class="transaction-name">${escapeHtml(t.name)}</span>
          <span class="transaction-meta">${escapeHtml(t.category)}</span>
        </div>
        <span class="transaction-amount">${formatIDR(t.amount)}</span>
        <button class="delete-btn" aria-label="Delete transaction">🗑</button>
      `;

      li.querySelector('.delete-btn').addEventListener('click', () => deleteTransaction(t.id));
      list.appendChild(li);
    });
  }

  applyHighlights();
}

// Format a number as Indonesian Rupiah (e.g. Rp 12.500)
function formatIDR(amount) {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

// Simple HTML escape to prevent XSS from user-entered names
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Rendering — Chart
// ---------------------------------------------------------------------------

// Category colours
const CATEGORY_COLORS = {
  Food:      '#4a90e2',
  Transport: '#f5a623',
  Fun:       '#7ed321'
};
const DEFAULT_COLOR = '#9b59b6';

let chartInstance = null;

function renderChart() {
  const chartSection = document.getElementById('chart-section');
  const canvas       = document.getElementById('spending-chart');
  const chartEmpty   = document.getElementById('chart-empty');

  // Guard: Chart.js not loaded
  if (typeof window.Chart === 'undefined') {
    chartSection.classList.add('hidden');
    return;
  }

  if (state.transactions.length === 0) {
    canvas.classList.add('hidden');
    chartEmpty.classList.remove('hidden');
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    return;
  }

  // Aggregate amounts by category
  const totals = {};
  state.transactions.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const labels     = Object.keys(totals);
  const data       = labels.map(l => totals[l]);
  const colors     = labels.map(l => CATEGORY_COLORS[l] || DEFAULT_COLOR);

  canvas.classList.remove('hidden');
  chartEmpty.classList.add('hidden');

  if (chartInstance) {
    // Update existing chart
    chartInstance.data.labels                        = labels;
    chartInstance.data.datasets[0].data             = data;
    chartInstance.data.datasets[0].backgroundColor  = colors;
    chartInstance.update();
  } else {
    // Create new chart
    chartInstance = new window.Chart(canvas, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ---------------------------------------------------------------------------
// renderAll
// ---------------------------------------------------------------------------

function renderAll() {
  renderBalance();
  renderTransactionList();
  renderChart();
}

// ---------------------------------------------------------------------------
// init
// ---------------------------------------------------------------------------

function init() {
  loadState();
  applyTheme(state.theme);

  // Restore persisted UI control values
  const limitInput = document.getElementById('spending-limit');
  if (state.spendingLimit !== null) {
    limitInput.value = state.spendingLimit;
  }
  document.getElementById('sort-select').value = state.sortOrder;

  // Sync theme button label
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.textContent = state.theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';

  renderAll();

  // Attach event listeners
  document.getElementById('transaction-form').addEventListener('submit', onFormSubmit);
  document.getElementById('theme-toggle').addEventListener('click', onThemeToggle);
  document.getElementById('sort-select').addEventListener('change', onSortChange);
  document.getElementById('spending-limit').addEventListener('input', onLimitChange);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', init);

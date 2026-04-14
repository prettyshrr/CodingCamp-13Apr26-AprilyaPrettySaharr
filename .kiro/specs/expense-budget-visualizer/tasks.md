# Implementation Plan: Expense & Budget Visualizer

## Overview

Implement a single-page, client-side expense tracker using plain HTML, CSS, and Vanilla JavaScript across exactly three files: `index.html`, `css/style.css`, and `js/app.js`. The app uses a data-driven rendering pattern with a single `state` object, `localStorage` persistence, and Chart.js loaded via CDN.

## Tasks

- [x] 1. Scaffold HTML structure and link assets
  - Write the full `index.html` markup as specified in the design: header with theme toggle, balance section, transaction form with inline error spans, spending limit input, sort controls, transaction list with empty-state paragraph, and chart canvas with placeholder paragraph
  - Add `<link rel="stylesheet" href="css/style.css">` in `<head>`
  - Add Chart.js CDN `<script>` tag and `<script src="js/app.js">` before `</body>`
  - Create empty `css/style.css` and `js/app.js` files
  - _Requirements: 7.5, 7.6, 7.7_

- [x] 2. Implement CSS styling and theme system
  - [x] 2.1 Write base styles and CSS custom properties
    - Define `:root` variables (`--bg`, `--text`, `--card-bg`, `--accent`, `--highlight`) for the light theme
    - Define `html.dark` overrides for the dark theme
    - Apply variables to all elements (body background, text color, card backgrounds, buttons, inputs)
    - _Requirements: 9.2, 9.5_

  - [x] 2.2 Write responsive and mobile-friendly layout styles
    - Single-column layout using flexbox or block flow
    - Ensure all interactive elements have a minimum tap target of 44×44 CSS pixels
    - Add a media query for `max-width: 480px` to enforce single-column layout
    - Ensure no horizontal scrolling at 375px viewport width
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 2.3 Write transaction list item styles including over-limit highlight
    - Style each `<li>` to display name, amount, and category clearly
    - Add `.over-limit` class style using `--highlight` variable for background
    - Add `.hidden` utility class (`display: none`)
    - _Requirements: 11.2_

- [x] 3. Implement core state, storage, and initialization in `js/app.js`
  - [x] 3.1 Define the `state` object and storage helpers
    - Declare `state` with fields: `transactions`, `theme`, `sortOrder`, `spendingLimit`
    - Implement `saveState()` — wraps `JSON.stringify(state)` into `localStorage` with `try/catch`
    - Implement `loadState()` — reads and parses `localStorage` with `try/catch`; falls back to defaults on any error (missing key, malformed JSON, quota exceeded)
    - Add `crypto.randomUUID` fallback for ID generation
    - _Requirements: 5.1, 5.2, 5.3, 7.3_

  - [ ]* 3.2 Write property test for state persistence round-trip (Property 6)
    - **Property 6: State persistence round-trip**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random full state objects (transactions, theme, sortOrder, spendingLimit); call `saveState()` then `loadState()`; assert resulting state equals original

  - [x] 3.3 Implement `init()` function
    - Call `loadState()` to populate `state` from `localStorage`
    - Call `applyTheme(state.theme)` before any rendering
    - Apply stored spending limit value to the input field
    - Apply stored sort order to the sort select
    - Call `renderAll()` to perform the initial render
    - Attach all event listeners
    - _Requirements: 5.1, 9.4, 11.6_

- [x] 4. Implement form validation and transaction CRUD
  - [x] 4.1 Implement `validateForm()`
    - Read values from `#item-name`, `#item-amount`, `#item-category`
    - Return `{ valid: boolean, errors: { name?, amount?, category? } }` with an error entry for each missing or invalid field
    - Clear all inline error spans before re-validating
    - Display error messages in the corresponding `#error-*` spans when invalid
    - _Requirements: 1.3_

  - [ ]* 4.2 Write property test for form validation (Property 2)
    - **Property 2: Form validation rejects incomplete inputs**
    - **Validates: Requirements 1.3**
    - Generate all combinations of missing/empty name, amount, and category; assert `validateForm()` returns `valid: false` with an error entry for each missing field

  - [x] 4.3 Implement `addTransaction(name, amount, category)`
    - Generate a unique `id` using `crypto.randomUUID()` (with fallback)
    - Push the new transaction object onto `state.transactions`
    - Call `saveState()`
    - Call `renderAll()`
    - _Requirements: 1.2, 5.2_

  - [ ]* 4.4 Write property test for transaction add round-trip (Property 1)
    - **Property 1: Transaction add round-trip**
    - **Validates: Requirements 1.2, 5.2**
    - Generate random valid transactions; call `addTransaction`; assert transaction appears in `state.transactions` and in the serialized `localStorage` entry

  - [x] 4.5 Implement `deleteTransaction(id)`
    - Filter `state.transactions` to remove the transaction with the matching `id`
    - Call `saveState()`
    - Call `renderAll()`
    - _Requirements: 2.3, 5.2_

  - [ ]* 4.6 Write property test for transaction delete round-trip (Property 5)
    - **Property 5: Transaction delete round-trip**
    - **Validates: Requirements 2.3, 5.2**
    - Generate random transaction lists; pick a random transaction; call `deleteTransaction(id)`; assert the id is absent from `state.transactions` and from the serialized `localStorage` entry

  - [x] 4.7 Implement `onFormSubmit(e)` event handler
    - Prevent default form submission
    - Call `validateForm()`; abort if invalid
    - Call `addTransaction` with trimmed name, parsed float amount, and selected category
    - Reset all form fields to their default empty state after successful submission
    - _Requirements: 1.2, 1.4_

- [x] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement render functions
  - [x] 6.1 Implement `renderBalance()`
    - Sum all `state.transactions` amounts
    - Update `#balance-display` text content with the formatted total (e.g., `$12.50`)
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 6.2 Write property test for balance calculation (Property 3)
    - **Property 3: Balance equals sum of all transaction amounts**
    - **Validates: Requirements 3.1, 3.2, 3.3**
    - Generate random arrays of transactions with arbitrary positive amounts; assert the balance calculation equals the arithmetic sum of all amounts

  - [x] 6.3 Implement `getSortedTransactions()`
    - Return a sorted copy of `state.transactions` based on `state.sortOrder`
    - `amount-asc`: sort by amount ascending
    - `amount-desc`: sort by amount descending
    - `category-asc`: sort by category alphabetically
    - `none`: return transactions in insertion order
    - Must not mutate `state.transactions`
    - _Requirements: 10.2, 10.3_

  - [ ]* 6.4 Write property test for sort correctness (Property 7)
    - **Property 7: Sort correctness**
    - **Validates: Requirements 10.2, 10.3, 10.4**
    - Generate random transaction arrays and each sort option; assert `getSortedTransactions()` returns the correct order for each option and that `state.transactions` is unchanged

  - [x] 6.5 Implement `applyHighlights()`
    - For each `<li>` in `#transaction-list`, read the transaction's amount from a data attribute
    - Add `.over-limit` class if `state.spendingLimit !== null` and `amount > state.spendingLimit`
    - Remove `.over-limit` class otherwise
    - _Requirements: 11.2, 11.3, 11.4_

  - [ ]* 6.6 Write property test for spending limit highlight correctness (Property 8)
    - **Property 8: Spending limit highlight correctness**
    - **Validates: Requirements 11.2, 11.3, 11.4**
    - Generate random limit values and transaction amounts; assert every transaction with `amount > limit` is classified as over-limit and every other transaction is not

  - [x] 6.7 Implement `renderTransactionList()`
    - Call `getSortedTransactions()` to get the display-ordered list
    - Clear `#transaction-list` and rebuild `<li>` elements; each `<li>` should include item name, amount, category, a delete button, and a `data-amount` attribute for highlight evaluation
    - Show `#empty-state` paragraph when the list is empty; hide it otherwise
    - Call `applyHighlights()` after rendering
    - Wire each delete button to call `onDeleteClick(id)`
    - _Requirements: 2.1, 2.2, 2.4, 10.2, 10.4, 11.2_

  - [x] 6.8 Implement `renderChart()`
    - Aggregate transaction amounts by category from `state.transactions`
    - If no transactions exist, hide `#spending-chart`, show `#chart-empty`, and destroy any existing Chart.js instance
    - Otherwise show `#spending-chart`, hide `#chart-empty`, and create or update a Chart.js pie chart on `#spending-chart` with one segment per category
    - Guard against Chart.js not being loaded (CDN failure): hide chart section if `window.Chart` is undefined
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 6.9 Write property test for chart data aggregation (Property 4)
    - **Property 4: Chart data reflects current transactions**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Generate random sets of transactions; assert the chart data object contains exactly one entry per category present, with each value equal to the sum of amounts for that category

  - [x] 6.10 Implement `applyTheme(theme)` and `renderAll()`
    - `applyTheme(theme)`: add `'dark'` class to `<html>` when `theme === 'dark'`; remove it otherwise
    - `renderAll()`: call `renderBalance()`, `renderTransactionList()`, and `renderChart()` in sequence
    - _Requirements: 9.2_

- [x] 7. Implement optional feature event handlers
  - [x] 7.1 Implement `onThemeToggle()`
    - Toggle `state.theme` between `'light'` and `'dark'`
    - Call `applyTheme(state.theme)`
    - Call `saveState()`
    - Update the toggle button label to reflect the current theme
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 7.2 Write property test for theme toggle round-trip (Property 9)
    - **Property 9: Theme toggle is a round-trip**
    - **Validates: Requirements 9.2, 9.3, 9.4**
    - Generate random starting themes; assert calling `onThemeToggle()` once applies the opposite theme and persists it; assert calling it twice restores the original theme

  - [x] 7.3 Implement `onSortChange(e)` event handler
    - Update `state.sortOrder` from the select value
    - Call `renderTransactionList()` (does not call `saveState()` — sort order is not persisted per Req 10.3)
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 7.4 Implement `onLimitChange(e)` event handler
    - Parse the input value as a float; set `state.spendingLimit` to the parsed value or `null` if empty/invalid/negative
    - Call `saveState()`
    - Call `applyHighlights()` to re-evaluate all current list items
    - _Requirements: 11.1, 11.4, 11.5_

- [x] 8. Wire all event listeners and finalize `init()`
  - Attach `onFormSubmit` to `#transaction-form` submit event
  - Attach `onThemeToggle` to `#theme-toggle` click event
  - Attach `onSortChange` to `#sort-select` change event
  - Attach `onLimitChange` to `#spending-limit` input event
  - Call `init()` at the bottom of `js/app.js` (or on `DOMContentLoaded`)
  - Verify the app works when opened as a local `file://` URL with no web server
  - _Requirements: 7.3, 8.1, 8.2_

- [x] 9. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests use [fast-check](https://github.com/dubzzz/fast-check) with a minimum of 100 iterations each
- Each property test file should include the tag comment: `// Feature: expense-budget-visualizer, Property N: <property_text>`
- Checkpoints ensure incremental validation before moving to the next phase

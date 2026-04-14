# Requirements Document

## Introduction

The Expense & Budget Visualizer is a mobile-friendly, client-side web application that helps users track their daily spending. It provides a transaction input form, a scrollable transaction history, a live total balance display, and a pie chart visualizing spending by category. All data is persisted in the browser's Local Storage with no backend required.

## Glossary

- **App**: The Expense & Budget Visualizer single-page web application.
- **Transaction**: A single spending record consisting of an item name, a monetary amount, and a category.
- **Category**: One of three predefined spending labels — Food, Transport, or Fun.
- **Transaction_List**: The scrollable UI component that displays all recorded transactions.
- **Balance_Display**: The UI component at the top of the page that shows the current total balance.
- **Input_Form**: The UI component containing the fields and submit button for adding a new transaction.
- **Chart**: The pie chart UI component that visualizes spending distribution by category.
- **Storage**: The browser's Local Storage API used to persist transaction data client-side.
- **Validator**: The client-side logic that checks form field completeness before submission.

---

## Requirements

### Requirement 1: Transaction Input

**User Story:** As a user, I want to enter a transaction with a name, amount, and category, so that I can record my spending.

#### Acceptance Criteria

1. THE Input_Form SHALL provide a text field for the item name, a numeric field for the amount, and a dropdown selector for the category (Food, Transport, Fun).
2. WHEN the user submits the Input_Form with all fields filled, THE App SHALL add the transaction to the Transaction_List and persist it to Storage.
3. WHEN the user submits the Input_Form with one or more empty fields, THE Validator SHALL display an inline error message indicating which fields are missing.
4. WHEN a transaction is successfully added, THE Input_Form SHALL reset all fields to their default empty state.

---

### Requirement 2: Transaction List

**User Story:** As a user, I want to see a scrollable list of all my transactions, so that I can review my spending history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display each transaction's item name, amount, and category.
2. THE Transaction_List SHALL be scrollable when the number of transactions exceeds the visible area.
3. WHEN the user deletes a transaction, THE App SHALL remove that transaction from the Transaction_List and from Storage.
4. WHEN the Transaction_List contains no transactions, THE App SHALL display an empty-state message indicating no transactions have been recorded.

---

### Requirement 3: Total Balance

**User Story:** As a user, I want to see my total amount spent at the top of the page, so that I always know my current balance at a glance.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the sum of all transaction amounts.
2. WHEN a transaction is added, THE Balance_Display SHALL update to reflect the new total without requiring a page reload.
3. WHEN a transaction is deleted, THE Balance_Display SHALL update to reflect the new total without requiring a page reload.

---

### Requirement 4: Spending Chart

**User Story:** As a user, I want to see a pie chart of my spending by category, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL display a pie chart with one segment per category that has at least one transaction.
2. WHEN a transaction is added, THE Chart SHALL update to reflect the new spending distribution without requiring a page reload.
3. WHEN a transaction is deleted, THE Chart SHALL update to reflect the new spending distribution without requiring a page reload.
4. WHEN all transactions are removed, THE Chart SHALL display an empty or placeholder state.

---

### Requirement 5: Data Persistence

**User Story:** As a user, I want my transactions to be saved between sessions, so that I do not lose my data when I close or refresh the browser.

#### Acceptance Criteria

1. WHEN the App loads, THE Storage SHALL be read and all previously saved transactions SHALL be rendered in the Transaction_List, Balance_Display, and Chart.
2. WHEN a transaction is added or deleted, THE App SHALL write the updated transaction list to Storage immediately.
3. THE App SHALL store all data client-side only, with no data transmitted to any external server.

---

### Requirement 6: Mobile-Friendly Layout

**User Story:** As a user on a mobile device, I want the app to be usable on a small screen, so that I can track spending on the go.

#### Acceptance Criteria

1. THE App SHALL render a single-column layout on screens with a viewport width of 480px or less.
2. THE Input_Form, Transaction_List, Balance_Display, and Chart SHALL each be fully visible and operable without horizontal scrolling on a 375px wide viewport.
3. THE App SHALL use touch-friendly tap targets with a minimum size of 44x44 CSS pixels for all interactive elements.

---

### Requirement 7: Technology and Compatibility

**User Story:** As a developer, I want the app built with plain HTML, CSS, and Vanilla JavaScript with a clean, predictable file structure, so that it requires no build tools, frameworks, or backend server and is easy to maintain.

#### Acceptance Criteria

1. THE App SHALL be implemented using only HTML, CSS, and Vanilla JavaScript with no frontend frameworks or build tools required.
2. THE App SHALL function correctly in the latest stable versions of Chrome, Firefox, Edge, and Safari.
3. THE App SHALL be operable as a standalone file opened directly in a browser without a web server.
4. WHERE a charting library is used, THE App SHALL load it via a CDN script tag with no local installation required.
5. THE App SHALL consist of exactly one HTML entry point at `index.html`, exactly one CSS file at `css/style.css`, and exactly one JavaScript file at `js/app.js`.
6. THE `index.html` file SHALL link the stylesheet via `<link rel="stylesheet" href="css/style.css">` and load the script via `<script src="js/app.js">`.
7. THE App SHALL contain no additional CSS or JavaScript files outside of `css/style.css` and `js/app.js` respectively.

---

### Requirement 8: Performance

**User Story:** As a user, I want the app to respond instantly to my interactions, so that using it feels smooth and fast.

#### Acceptance Criteria

1. WHEN the App is opened, THE App SHALL render the full initial UI within 2 seconds on a standard broadband connection.
2. WHEN a transaction is added or deleted, THE App SHALL update the Transaction_List, Balance_Display, and Chart within 100ms.

---

### Requirement 9: Dark/Light Mode Toggle

**User Story:** As a user, I want to switch between dark and light themes, so that I can use the app comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE App SHALL provide a toggle button that switches the UI between dark and light themes.
2. WHEN the user activates the toggle, THE App SHALL apply the selected theme by adding or removing a CSS class on the root element.
3. WHEN the user activates the toggle, THE App SHALL save the selected theme preference to Storage.
4. WHEN the App loads, THE App SHALL read the theme preference from Storage and apply it before rendering the UI.
5. IF no theme preference exists in Storage, THE App SHALL apply the light theme by default.

---

### Requirement 10: Sort Transactions

**User Story:** As a user, I want to sort my transaction list by amount or category, so that I can quickly find and compare my spending entries.

#### Acceptance Criteria

1. THE Transaction_List SHALL provide controls that allow the user to sort transactions by amount in ascending order, by amount in descending order, or by category in alphabetical order.
2. WHEN the user selects a sort option, THE Transaction_List SHALL re-render the transactions in the chosen order without requiring a page reload.
3. WHEN the user selects a sort option, THE App SHALL not modify the order in which transactions are persisted in Storage.
4. WHEN a new transaction is added while a sort option is active, THE Transaction_List SHALL display the updated list in the currently selected sort order.

---

### Requirement 11: Highlight Spending Over a Set Limit

**User Story:** As a user, I want to set a spending limit and see which transactions exceed it, so that I can quickly identify overspending.

#### Acceptance Criteria

1. THE App SHALL provide a numeric input that allows the user to set a spending limit value.
2. WHEN the spending limit is set, THE Transaction_List SHALL apply a visual highlight to every transaction whose amount exceeds the limit.
3. WHEN a transaction is added while a spending limit is active, THE Transaction_List SHALL immediately evaluate the new transaction against the limit and apply the highlight if the amount exceeds it.
4. WHEN the user changes the spending limit value, THE Transaction_List SHALL re-evaluate all transactions and update highlights accordingly without requiring a page reload.
5. WHEN the user sets the spending limit, THE App SHALL save the limit value to Storage.
6. WHEN the App loads, THE App SHALL read the spending limit from Storage and apply highlights to any transactions that exceed it.
7. IF no spending limit exists in Storage, THE App SHALL display no highlights by default.

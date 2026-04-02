# Finance Dashboard UI

A responsive finance dashboard built for a frontend evaluation using React, Tailwind CSS, Redux Toolkit, Recharts, and Framer Motion.

## Overview

This project demonstrates how I would approach a small finance dashboard assignment without adding unnecessary backend complexity. The app uses seeded mock transactions, derives metrics through Redux selectors, and simulates frontend-only roles so the interface feels complete and interactive on first load.

## Website Explanation

This website is a personal finance dashboard demo built as a frontend-only assignment project. Its goal is to help a user quickly understand their financial position by combining summary cards, charts, transactions, and simple insights in one screen.

The dashboard is designed around a simple idea:

- show important numbers first
- let the user explore the transaction data
- adapt the interface based on the selected role
- generate quick observations from the currently visible records

The interface is intentionally built so a reviewer can understand the project quickly:

- the top area introduces the dashboard and shows the active role
- the overview cards summarize the current financial state
- the charts visualize trends and category splits
- the insights section explains what the data means
- the transactions section gives direct control through search, filters, sorting, export, and CRUD actions for admins

Because this is a frontend-only project, all data behavior is simulated locally through Redux state and persisted in local storage.

## Assignment Coverage

### 1. Dashboard Overview

- Summary cards for total balance, income, expenses, and savings rate
- A time-based visualization for balance trend
- A categorical visualization for spending breakdown

### 2. Transactions Section

- Transaction list with date, amount, category, type, and description
- Search across description, category, and type
- Filtering by category and transaction type
- Sorting by date and amount
- Empty states when no transactions exist or no results match filters

### 3. Basic Role-Based UI

- `viewer` role can inspect the dashboard in read-only mode
- `admin` role can add, edit, delete, and restore transactions
- Role switching is simulated with a dropdown in the header

### 4. Insights Section

- Highest spending category
- Month-over-month expense comparison
- Largest transaction
- A plain-language observation generated from the visible data

### 5. State Management

Redux Toolkit manages:

- Transactions
- Filters and sorting
- Selected role
- Selected currency and exchange-rate metadata

### 6. UI and UX

- Responsive layout for desktop, tablet, and mobile
- Graceful empty states across charts and transaction views
- Clear status messaging for role behavior and filtered results

## Optional Enhancements Included

- Dark mode with local storage persistence
- Local storage persistence for transactions, filters, role, and currency
- Live USD to INR conversion with a fallback rate
- CSV export for the currently visible transactions
- Motion-based transitions for cards, charts, and modal interactions

## Tech Stack

- React 19 + Vite
- Tailwind CSS
- Redux Toolkit + React Redux
- Recharts
- Framer Motion

## Technologies Used And Why

### React

React is used to build the interface in a component-based way. Each part of the dashboard such as the overview cards, charts, role switcher, and transaction list is built as a reusable component. This makes the code easier to organize, test, and extend.

### Vite

Vite is used as the development and build tool. It provides a fast local development server and a simple production build process, which is ideal for a frontend assignment.

### Tailwind CSS

Tailwind CSS is used for styling. It helps create a responsive layout quickly while keeping styling close to the components. It is also used to support:

- responsive spacing and layout
- dark mode styles
- consistent buttons, inputs, cards, and panels
- polished UI states for hover, empty, and disabled behavior

### Redux Toolkit

Redux Toolkit is used for application state management. It keeps the important app state in one predictable store and makes the code cleaner than manually passing state through many components.

It manages:

- transaction records
- filter and sort options
- selected role
- selected currency
- exchange-rate loading state

### React Redux

React Redux connects the React components to the Redux store using hooks like `useSelector` and `useDispatch`. Components can read the exact data they need and dispatch actions when the user interacts with the UI.

### Recharts

Recharts is used for data visualization. It powers:

- the balance trend line chart
- the spending breakdown pie chart

This helps transform raw transaction data into visuals that are easier to understand.

### Framer Motion

Framer Motion is used to add subtle animations. It improves the user experience by making cards, lists, and modal interactions feel smoother without overcomplicating the app.

### Local Storage

Local storage is used to persist user changes in the browser. This means that transactions, filters, role, currency choice, and theme can remain available even after a refresh.

## APIs Used And Their Work

This project is frontend-focused, so it uses a small number of APIs in a practical way.

### 1. Exchange Rate API

External endpoint used:

- `https://open.er-api.com/v6/latest/USD`

Purpose:

- fetch the latest USD base currency exchange data
- read the INR conversion rate from the response
- update the dashboard so amounts can be viewed in both USD and INR

How it works in this project:

- the app calls this endpoint when it loads
- the response is processed inside `src/features/settings/settingsSlice.js`
- the INR rate is saved in Redux state
- the currency switcher and formatted amounts use that rate for conversion
- if the request fails, the app falls back to a saved default rate so the UI still works

Why it is useful:

- it makes the dashboard feel more realistic
- it shows async state handling in a frontend assignment
- it demonstrates safe fallback behavior when a live API is unavailable

### 2. Fetch API

Browser API used:

- `fetch()`

Purpose:

- send the request to the exchange-rate service
- receive live JSON data from the external endpoint

How it works in this project:

- `fetch()` is used inside the async thunk in `settingsSlice.js`
- the app checks whether the response is successful
- the JSON body is parsed and validated before being stored

### 3. Local Storage API

Browser API used:

- `window.localStorage`

Purpose:

- persist user-related state across refreshes

How it works in this project:

- the Redux store reads saved values during initialization
- the app writes updated state back to local storage whenever the store changes
- the dark mode toggle also stores the selected theme

Data persisted in this project:

- transactions
- filters
- selected role
- selected currency
- exchange-rate metadata
- theme mode

### 4. Blob API And URL API

Browser APIs used:

- `Blob`
- `URL.createObjectURL()`
- `URL.revokeObjectURL()`

Purpose:

- create downloadable CSV files directly in the browser

How it works in this project:

- the visible transaction rows are converted into CSV text
- a Blob is created from that content
- a temporary object URL is generated
- the browser downloads the file when the user clicks `Export CSV`

### 5. Crypto API

Browser API used:

- `crypto.randomUUID()`

Purpose:

- generate a unique ID for newly added transactions

How it works in this project:

- when an admin adds a new transaction, the app creates a unique transaction ID
- if `crypto.randomUUID()` is unavailable, the app falls back to a timestamp-based value

## API Flow In The App

The API-related flow of the website is simple:

1. The app starts.
2. The settings slice requests live exchange-rate data using `fetch()`.
3. The response is stored in Redux.
4. Currency formatting and conversion use the returned INR rate.
5. User changes are saved through local storage APIs.
6. Export actions use Blob and URL browser APIs to download CSV data.

This keeps the app lightweight while still showing real-world API usage.

## State Management Approach

The store is intentionally small and split by concern:

- `transactions` keeps the source transaction list plus current filters
- `role` stores the simulated UI role
- `settings` stores currency selection and exchange-rate state

Selectors are used to compute:

- Dashboard summary numbers
- Filtered and sorted transactions
- Monthly trend data
- Spending breakdown data
- Insights derived from the visible dataset

This keeps components presentational and prevents duplicate calculation logic across the app.

## How The Website Works

The website works by starting from a base set of mock transactions and then deriving everything else from that source of truth.

### Core Flow

1. The app loads and creates the Redux store.
2. The store reads any saved state from local storage if it exists.
3. The transaction list becomes the main source data for the dashboard.
4. Selectors calculate summaries, filtered records, chart data, and insights from that source.
5. Components read those derived values and render the UI.
6. When the user changes a filter, role, theme, currency, or transaction, Redux updates the state and the UI updates automatically.
7. The updated state is saved back to local storage.

This means the website is reactive: the cards, charts, and insights always stay in sync with the currently visible data.

## Website Flow

### 1. Header And Controls

At the top of the page, the user sees:

- a heading that explains the project
- the role switcher
- the currency switcher

These controls change how the rest of the website behaves:

- the role switcher changes whether the interface is read-only or editable
- the currency switcher changes how amounts are displayed

### 2. Hero Summary Panel

Below the header is a visual summary panel. It quickly communicates:

- which role is active
- whether filters are active
- the visible balance
- how many records are in view

This gives immediate context before the user looks at detailed data.

### 3. Dashboard Overview Cards

The overview cards show:

- total balance
- income
- expenses
- savings rate

These values are not hardcoded. They are calculated from the transactions currently visible after search, filtering, and sorting.

### 4. Charts

The dashboard contains two chart sections:

- a time-based balance trend chart
- a category-based spending breakdown chart

The balance trend helps the user understand how money changes across months. The spending breakdown helps the user understand where expenses are concentrated.

### 5. Insights Section

The insights panel translates the data into plain-language takeaways. It includes:

- highest spending category
- month-over-month expense comparison
- largest transaction
- a useful observation based on the visible financial picture

This section is meant to make the dashboard feel more analytical instead of only descriptive.

### 6. Transactions Section

The transactions area is the most interactive part of the website. It allows the user to:

- review all records
- search records
- filter by type
- filter by category
- sort by date or amount
- export currently visible records as CSV

If the user is in `admin` mode, they can also:

- add a transaction
- edit a transaction
- delete a transaction
- restore the sample dataset

If the user is in `viewer` mode, those write actions are intentionally disabled.

### 7. Dark Mode Toggle

The floating dark mode toggle changes the color theme of the website. The preference is saved so the theme stays consistent after refresh.

## How To Use The Website

### Basic Usage

1. Open the app in the browser.
2. Review the summary cards and charts to understand the current financial state.
3. Scroll to the transactions section to inspect the detailed records.
4. Use search, filters, and sorting to narrow the dataset.
5. Watch the dashboard cards, charts, and insights update automatically.

### Switching Roles

Use the role dropdown in the header:

- choose `Viewer` to simulate a read-only user
- choose `Admin` to unlock add, edit, delete, and restore actions

This is useful for demonstrating frontend role-based behavior without backend permissions.

### Switching Currency

Use the currency dropdown to switch between USD and INR. The UI updates the visible formatting and conversions while keeping the underlying stored amounts consistent.

### Adding A Transaction

1. Switch to `Admin`.
2. Click `Add transaction`.
3. Fill in date, amount, description, category, and type.
4. Submit the form.

The new transaction is added to the Redux store, saved to local storage, and reflected immediately across:

- summary cards
- charts
- insights
- transaction list

### Editing A Transaction

1. Stay in `Admin`.
2. Find a transaction in the list.
3. Click `Edit`.
4. Update the values in the modal.
5. Save changes.

The dashboard recalculates automatically after the update.

### Deleting A Transaction

1. Stay in `Admin`.
2. Click `Delete` on a transaction row.
3. Confirm the action.

After deletion, all related totals and charts update immediately.

### Searching, Filtering, And Sorting

The transactions section supports:

- search by text
- filter by transaction type
- filter by category
- sort by date or amount

These controls affect not only the list but also the dashboard summaries, charts, and insights. This makes the whole website behave as one connected analytical view.

### Exporting Data

Click `Export CSV` to download the currently visible transactions. This means exports respect the active search and filters.

### Restoring The Original Data

If you are in `Admin` mode, click `Restore sample data` to reset the app back to the seeded mock dataset.

## Code Structure Explanation

The codebase is organized by feature so that related UI and state logic stay close together.

### `src/App.jsx`

This is the main composition file. It assembles the page layout and brings together:

- header controls
- hero summary
- dashboard cards
- charts
- insights
- transaction list
- dark mode toggle

### `src/app/store.js`

This file creates the Redux store, wires the reducers together, and handles local storage persistence for the app state.

### `src/features/transactions`

This folder contains the main data logic.

- `transactionSlice.js` defines transaction actions and reducers
- `selectors.js` derives filtered records, summary values, chart data, and insights
- `TransactionList.jsx` renders the transaction table and controls

This feature is the heart of the dashboard because most of the UI depends on transaction data.

### `src/features/dashboard/Dashboard.jsx`

This component renders the summary cards shown near the top of the page.

### `src/features/insights/Insights.jsx`

This component renders the analytical insight cards and the plain-language observation section.

### `src/features/role/roleSlice.js`

This file manages the simulated role state and controls whether the app behaves like `admin` or `viewer`.

### `src/features/settings/settingsSlice.js`

This file manages currency selection and exchange-rate state. It also handles the async fetch for the USD to INR rate and falls back safely if a live rate is unavailable.

### `src/components/Charts.jsx`

This file contains the chart panels for:

- balance trend
- spending breakdown

### `src/components/AddTransactionModal.jsx`

This component handles the form used to add and edit transactions.

### `src/components/RoleSwitcher.jsx`

This component provides the role dropdown and describes the behavior of the selected role.

### `src/components/CurrencySwitcher.jsx`

This component lets the user change currency and see exchange-rate information.

### `src/components/DarkModeToggle.jsx`

This component manages the dark theme toggle and stores the selected theme in local storage.

### `src/lib/formatters.js`

This file centralizes common formatting and conversion helpers such as:

- currency formatting
- compact number formatting
- date formatting
- USD and INR conversion

Keeping these helpers in one place makes the UI more consistent.

## Data Flow Explanation

The data flow of the app is straightforward and unidirectional:

1. Mock transactions are loaded into Redux state.
2. UI controls dispatch Redux actions.
3. Reducers update the store.
4. Selectors compute derived values from the store.
5. Components re-render with the new values.
6. The store subscription persists the latest state to local storage.

This pattern makes the application predictable and easier to debug.

## Local Setup

### Prerequisites

- Node.js 18+ recommended

### Install and Run

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  app/
    store.js
  components/
    AddTransactionModal.jsx
    Charts.jsx
    CurrencySwitcher.jsx
    DarkModeToggle.jsx
    RoleSwitcher.jsx
  data/
    mockTransactions.js
  features/
    dashboard/
      Dashboard.jsx
    insights/
      Insights.jsx
    role/
      roleSlice.js
    settings/
      settingsSlice.js
    transactions/
      selectors.js
      TransactionList.jsx
      transactionSlice.js
  lib/
    formatters.js
```


# Finance Dashboard UI

## 1. Project Title
Finance Dashboard UI

## 2. Overview
Finance Dashboard UI is a frontend-only dashboard built with React + Vite.
It focuses on expense tracking and role-based interaction using mock transaction data.

### Live Demo
- https://finance-ui-sigma.vercel.app/

The current implementation includes:
- Dashboard summary cards
- Trend and category charts
- Transaction search/filter/sort
- Role-based add/edit controls
- Light/Dark theme toggle

## 3. Features ✅
Only features that are currently implemented in the codebase are listed here.

- Dashboard overview
	- Total Balance card
	- Total Income card
	- Total Expenses card
- Charts with Recharts
	- Line chart for monthly balance trend
	- Donut chart for expense distribution by category
- Transactions section
	- Search by category or note
	- Filter by type (all/income/expense)
	- Filter by category
	- Sort by date or amount
	- Desktop table view + mobile card view
	- Empty state message when no records match
- Role-based UI
	- Viewer mode: view-only
	- Admin mode: can add and edit transactions
	- Role status messaging in UI
- Insights section
	- Highest spending category
	- Month-over-month expense comparison text
	- Simple recommendation text
- Theme
	- Light/Dark mode toggle in header controls
	- Theme preference persisted in localStorage
- UX polish
	- Responsive layout
	- Hover states for cards, rows, and controls

## 4. Tech Stack
- React 19
- Vite 8
- Tailwind CSS 3
- Zustand (state management)
- Recharts (charts)
- ESLint

## 5. Project Structure

src/
	components/
		Charts.jsx
		DashboardCards.jsx
		Insights.jsx
		RoleSwitcher.jsx
		TransactionsTable.jsx
	data/
		mockData.js
	pages/
		Dashboard.jsx
	store/
		useStore.js
	App.jsx
	main.jsx
	index.css

Notes:
- mockData.js includes 20 transactions.
- useStore.js contains app state and actions.
- App.css and src/assets files are leftover scaffold files and are not used by the current dashboard UI.

## 6. Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm

### Install
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Lint
```bash
npm run lint
```

## 7. Key Implementation Details

### State Management (Zustand)
Global state is managed in src/store/useStore.js.

State fields:
- transactions
- role
- filters
- theme

Actions:
- addTransaction
- updateTransaction
- setRole
- setFilter
- setTheme

Theme handling:
- Uses a class-based dark mode approach.
- Dashboard applies or removes the dark class on documentElement.
- Theme is stored in localStorage under dashboard-theme.

### Charts
Implemented in src/components/Charts.jsx with Recharts.

- LineChart
	- Data is aggregated month-wise from transactions.
	- Displays monthly balance (income - expense).
- PieChart (donut style)
	- Uses only expense transactions.
	- Aggregates totals by category.

### Role-Based UI
Implemented through role state and conditional rendering.

- Viewer
	- Cannot see add form
	- Cannot see edit actions
- Admin
	- Add transaction form is visible
	- Edit buttons are visible

### Debugging approach
Console logs are actively used in store actions and transaction handlers, for example:
- Adding/updating transactions
- Role changes
- Filter changes
- Theme changes

## 8. Known Limitations ⚠️
- No backend/API integration (mock data only)
- Transactions are not persisted across refresh (except theme preference)
- No delete transaction feature
- No pagination/virtualization for large transaction datasets
- Form validation is basic and currently does not show inline field error UI
- No automated tests included

## 9. Future Improvements
- Add persistent storage for transactions and filters (localStorage or API)
- Add delete action with confirmation modal
- Add toast notifications for add/edit/theme/role events
- Add richer form validation with inline messages
- Add unit/integration tests
- Improve chart accessibility and custom legends
- Split large bundle with lazy loading/code splitting

## 10. Conclusion
Finance Dashboard UI is a clean, modular, and responsive frontend project demonstrating practical React patterns:
- centralized state with Zustand,
- chart-based visualization with Recharts,
- role-based UI behavior,
- and polished light/dark theming.

It is a solid internship-level dashboard foundation and ready for backend integration as a next step.

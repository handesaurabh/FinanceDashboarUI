import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentRole } from "./features/role/roleSlice";
import {
  selectDashboardSummary,
  selectHasActiveFilters,
} from "./features/transactions/selectors";
import { convertUsdToCurrency, formatCurrency } from "./lib/formatters";
import Dashboard from "./features/dashboard/Dashboard";
import TransactionList from "./features/transactions/TransactionList";
import Insights from "./features/insights/Insights";
import RoleSwitcher from "./components/RoleSwitcher";
import DarkModeToggle from "./components/DarkModeToggle";
import CurrencySwitcher from "./components/CurrencySwitcher";
import {
  BalanceTrendPanel,
  SpendingBreakdownPanel,
} from "./components/Charts";
import {
  fetchUsdInrRate,
  selectCurrency,
  selectUsdToInrRate,
} from "./features/settings/settingsSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const role = useSelector(selectCurrentRole);
  const summary = useSelector(selectDashboardSummary);
  const hasActiveFilters = useSelector(selectHasActiveFilters);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);

  useEffect(() => {
    dispatch(fetchUsdInrRate());
  }, [dispatch]);

  const roleMessage =
    role === "admin"
      ? "Admin mode unlocks add, edit, delete, and data reset actions."
      : "Viewer mode keeps the dashboard read-only for safe walkthroughs.";

  return (
    <div className="dashboard-shell relative min-h-screen overflow-hidden text-slate-900 transition-colors duration-300 dark:text-slate-50">
      <div className="relative mx-auto max-w-7xl px-4 py-6 pb-14 sm:px-6 sm:pb-18 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <span className="chip">Finance Dashboard</span>
            <div className="space-y-2">
              <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
                Professional expense and cash flow dashboard for modern finance
                tracking
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                Monitor account balances, analyze income versus expenses,
                review category-wise spending patterns, and surface practical
                financial insights from one clear workspace. The experience is
                designed to reflect a polished expense management product with
                responsive analytics, role-aware actions, and well-structured
                frontend state.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RoleSwitcher />
            <CurrencySwitcher />
          </div>
        </header>

        <section className="panel relative mb-6 overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-20 top-0 hidden h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl lg:block" />

          <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-emerald-300 dark:text-slate-950">
                  {role} mode
                </span>
                {hasActiveFilters ? (
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200">
                    Filters active
                  </span>
                ) : null}
              </div>

              <div className="space-y-3">
                <h2 className="font-heading text-2xl font-semibold tracking-tight">
                  Built to present expenses, spending behavior, and cash health
                  with clarity
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  From high-level balance summaries to detailed transaction
                  review, the dashboard helps users understand where money is
                  coming from, where it is being spent, and how monthly expense
                  patterns are changing over time. Each section is designed to
                  support faster financial review and cleaner day-to-day
                  expense monitoring.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[24px] bg-slate-950 p-5 text-white shadow-lg dark:bg-slate-800">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Role Behavior
                </p>
                <p className="font-heading mt-3 text-2xl font-semibold capitalize">
                  {role}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {roleMessage}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-400/20 dark:bg-emerald-400/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-200">
                    Visible Balance
                  </p>
                  <p className="font-heading mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                    {formatCurrency(
                      convertUsdToCurrency(
                        summary.balance,
                        currency,
                        usdToInrRate
                      ),
                      currency
                    )}
                  </p>
                </div>

                <div className="rounded-[24px] border border-sky-200 bg-sky-50 p-5 dark:border-sky-400/20 dark:bg-sky-400/10">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-200">
                    Records In View
                  </p>
                  <p className="font-heading mt-3 text-2xl font-semibold text-slate-950 dark:text-white">
                    {summary.count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <main className="space-y-6">
          <Dashboard />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-stretch">
            <BalanceTrendPanel />
            <Insights />
          </div>

          <SpendingBreakdownPanel />

          <TransactionList />

          <footer className="mt-10 w-full border-t border-slate-200 dark:border-slate-800">
            <div className="mx-auto max-w-7xl px-4 py-5 text-center">
              <p className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                <span className="mr-1">Built by</span>
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text font-semibold text-transparent">
                  Saurabh Hande
                </span>
                <span className="ml-1 text-slate-400 dark:text-slate-500">
                  • Full Stack Developer
                </span>
              </p>
              <p className="mt-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 bg-clip-text text-sm tracking-wide text-transparent">
                Empowering smarter financial decisions through intuitive
                analytics
              </p>
            </div>
          </footer>
        </main>
      </div>

      <DarkModeToggle />
    </div>
  );
}

export default App;

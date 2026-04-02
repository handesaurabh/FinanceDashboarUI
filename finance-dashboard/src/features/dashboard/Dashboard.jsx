import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  selectDashboardSummary,
  selectHasActiveFilters,
} from "../transactions/selectors";
import {
  convertUsdToCurrency,
  formatCompactCurrency,
  formatCurrency,
} from "../../lib/formatters";
import {
  selectCurrency,
  selectUsdToInrRate,
} from "../settings/settingsSlice";

const Dashboard = () => {
  const MotionArticle = motion.article;
  const summary = useSelector(selectDashboardSummary);
  const hasActiveFilters = useSelector(selectHasActiveFilters);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);

  const cards = [
    {
      label: "Total balance",
      value: formatCurrency(
        convertUsdToCurrency(summary.balance, currency, usdToInrRate),
        currency
      ),
      helper: `${summary.count} transaction${summary.count === 1 ? "" : "s"} in view`,
      tone:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-400/10",
    },
    {
      label: "Income",
      value: formatCompactCurrency(
        convertUsdToCurrency(summary.income, currency, usdToInrRate),
        currency
      ),
      helper: "Positive cash inflow",
      tone:
        "border-sky-200 bg-sky-50 dark:border-sky-400/20 dark:bg-sky-400/10",
    },
    {
      label: "Expenses",
      value: formatCompactCurrency(
        convertUsdToCurrency(summary.expenses, currency, usdToInrRate),
        currency
      ),
      helper: "Visible money outflow",
      tone:
        "border-rose-200 bg-rose-50 dark:border-rose-400/20 dark:bg-rose-400/10",
    },
    {
      label: "Savings rate",
      value: `${summary.savingsRate}%`,
      helper: hasActiveFilters
        ? "Updated from the active filters"
        : "Based on all current records",
      tone:
        "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-400/10",
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-heading text-2xl font-semibold">
          Dashboard overview
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Summary cards reflect the same data currently visible in the
          dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <MotionArticle
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`panel border p-5 ${card.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
              {card.label}
            </p>
            <p className="font-heading mt-4 text-3xl font-semibold text-slate-950 dark:text-white">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {card.helper}
            </p>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;

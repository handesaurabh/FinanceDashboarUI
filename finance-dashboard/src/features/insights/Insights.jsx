import { useSelector } from "react-redux";
import { selectCurrentRole } from "../role/roleSlice";
import { selectInsights } from "../transactions/selectors";
import {
  convertUsdToCurrency,
  formatCurrency,
} from "../../lib/formatters";
import {
  selectCurrency,
  selectUsdToInrRate,
} from "../settings/settingsSlice";

const Insights = () => {
  const currentRole = useSelector(selectCurrentRole);
  const insights = useSelector(selectInsights);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);

  const comparisonTone =
    insights.monthlyDifference === null
      ? "text-slate-500 dark:text-slate-400"
      : insights.monthlyDifference <= 0
        ? "text-emerald-700 dark:text-emerald-200"
        : "text-rose-700 dark:text-rose-200";
  const observationTone =
    insights.monthlyDifference === null
      ? "border-sky-200 bg-sky-50/70 dark:border-sky-400/20 dark:bg-sky-400/10"
      : insights.monthlyDifference <= 0
        ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-400/10"
        : "border-amber-200 bg-amber-50/80 dark:border-amber-400/20 dark:bg-amber-400/10";

  const cards = [
    {
      title: "Highest spending category",
      value: insights.highestCategory?.name ?? "No expense data",
      description: insights.highestCategory
        ? `${formatCurrency(
            convertUsdToCurrency(
              insights.highestCategory.value,
              currency,
              usdToInrRate
            ),
            currency
          )} spent here`
        : "Add expense records to see category-level insights.",
      tone:
        "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60",
      valueTone: "text-slate-950 dark:text-white",
    },
    {
      title: "Monthly comparison",
      value:
        insights.monthlyDifference === null
          ? "Need two months of data"
          : `${insights.monthlyDifference <= 0 ? "Down" : "Up"} ${insights.monthlyChangePercentage}%`,
      description:
        insights.monthlyDifference === null
          ? "Monthly expense comparison appears once two months are visible."
          : `${insights.latestMonth.label} spending changed by ${formatCurrency(
              convertUsdToCurrency(
                Math.abs(insights.monthlyDifference),
                currency,
                usdToInrRate
              ),
              currency
            )} compared with ${insights.previousMonth.label}.`,
      tone:
        "border-emerald-200 bg-emerald-50/60 dark:border-emerald-400/20 dark:bg-emerald-400/10",
      valueTone: comparisonTone,
    },
    {
      title: "Largest transaction",
      value: insights.largestTransaction?.description ?? "No transactions yet",
      description: insights.largestTransaction
        ? `${formatCurrency(
            convertUsdToCurrency(
              insights.largestTransaction.amount,
              currency,
              usdToInrRate
            ),
            currency
          )} ${insights.largestTransaction.type}`
        : "This area updates automatically after transactions are added.",
      tone:
        "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/60",
      valueTone: "text-slate-950 dark:text-white",
    },
    {
      title: "Transactions this month",
      value: `${insights.transactionsThisMonth}`,
      description: `${insights.monthLabel} currently has ${insights.incomeTransactionsThisMonth} income and ${insights.expenseTransactionsThisMonth} expense transaction${insights.transactionsThisMonth === 1 ? "" : "s"} in this view.`,
      tone:
        "border-amber-200 bg-amber-50/60 dark:border-amber-400/20 dark:bg-amber-400/10",
      valueTone: "text-amber-700 dark:text-amber-200",
    },
  ];

  return (
    <aside className="panel h-full p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">Insights</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Small observations generated from the transactions in view.
          </p>
        </div>

        <span className="chip">{currentRole} role</span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`rounded-[24px] border p-5 ${card.tone}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <p
              className={`font-heading mt-4 text-2xl font-semibold ${card.valueTone}`}
            >
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {card.description}
            </p>
          </div>
        ))}

        <div
          className={`rounded-[24px] border p-5 md:col-span-2 ${observationTone}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Useful observation
          </p>
          <p className="font-heading mt-4 text-2xl font-semibold text-slate-950 dark:text-white">
            Snapshot summary
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
            {insights.observation}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Insights;

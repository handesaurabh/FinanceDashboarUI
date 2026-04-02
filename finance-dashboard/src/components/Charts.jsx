import {
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { useSelector } from "react-redux";
import {
  selectSpendingBreakdown,
  selectTrendData,
} from "../features/transactions/selectors";
import {
  convertUsdToCurrency,
  formatCompactCurrency,
  formatCurrency,
} from "../lib/formatters";
import {
  selectCurrency,
  selectUsdToInrRate,
} from "../features/settings/settingsSlice";

const COLORS = ["#0f766e", "#0ea5e9", "#f97316", "#eab308", "#334155"];

export const BalanceTrendPanel = () => {
  const trendData = useSelector(selectTrendData);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);

  return (
    <section className="panel overflow-hidden p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold">
            Balance trend
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Running balance built from the currently visible transactions.
          </p>
        </div>

        {trendData.length > 0 ? (
          <div className="grid min-w-[180px] grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-400/20 dark:bg-emerald-400/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-200">
                Latest
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {trendData.at(-1)?.label ?? "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 dark:border-sky-400/20 dark:bg-sky-400/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                Balance
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {formatCompactCurrency(
                  convertUsdToCurrency(
                    trendData.at(-1)?.balance ?? 0,
                    currency,
                    usdToInrRate
                  ),
                  currency
                )}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {trendData.length > 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950/60">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 16, right: 12, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#64748b33" />
                <XAxis
                  dataKey="label"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  width={68}
                  tickFormatter={(value) =>
                    formatCompactCurrency(
                      convertUsdToCurrency(
                        Number(value),
                        currency,
                        usdToInrRate
                      ),
                      currency
                    )
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 18,
                    border: "1px solid rgba(148, 163, 184, 0.2)",
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    color: "#f8fafc",
                  }}
                  formatter={(value) =>
                    formatCurrency(
                      convertUsdToCurrency(
                        Number(value),
                        currency,
                        usdToInrRate
                      ),
                      currency
                    )
                  }
                  labelFormatter={(label) => `${label} balance`}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="#5eead4"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    stroke: "#134e4a",
                    fill: "#ccfbf1",
                  }}
                  activeDot={{
                    r: 7,
                    strokeWidth: 3,
                    stroke: "#14b8a6",
                    fill: "#f0fdfa",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
          No time-based data yet. Add a few transactions to see the trend.
        </div>
      )}
    </section>
  );
};

export const SpendingBreakdownPanel = () => {
  const spendingBreakdown = useSelector(selectSpendingBreakdown);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);
  const topBreakdownItems = spendingBreakdown.slice(0, 6);
  const firstColumnItems = topBreakdownItems.slice(0, 3);
  const secondColumnItems = topBreakdownItems.slice(3, 6);

  const renderBreakdownColumn = (items, startIndex) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.name}
          className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-950/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[(startIndex + index) % COLORS.length],
                  }}
                />
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </p>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                {item.share}% of expenses
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-slate-900 dark:text-white">
              {formatCurrency(
                convertUsdToCurrency(item.value, currency, usdToInrRate),
                currency
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="panel overflow-hidden p-5 sm:p-6">
      <div className="mb-5 space-y-1">
        <h2 className="font-heading text-xl font-semibold">
          Spending breakdown
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Expense categories are grouped into a quick visual snapshot.
        </p>
      </div>

      {spendingBreakdown.length > 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950/60">
          <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)] xl:items-center">
            <div className="mx-auto h-[240px] w-full max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topBreakdownItems}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="#f8fafc"
                    strokeWidth={2}
                  >
                    {topBreakdownItems.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(
                        convertUsdToCurrency(
                          Number(value),
                          currency,
                          usdToInrRate
                        ),
                        currency
                      )
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {renderBreakdownColumn(firstColumnItems, 0)}
            {renderBreakdownColumn(secondColumnItems, 3)}
          </div>

          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Showing the top 6 categories in the visual breakdown for a cleaner
            layout.
          </p>
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-400">
          Expense categories will appear here once spending records are
          available.
        </div>
      )}
    </section>
  );
};

const Charts = () => (
  <div className="grid gap-6">
    <BalanceTrendPanel />
    <SpendingBreakdownPanel />
  </div>
);

export default Charts;

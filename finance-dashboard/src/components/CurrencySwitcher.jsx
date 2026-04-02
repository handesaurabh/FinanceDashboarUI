import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrency,
  selectRateError,
  selectRateSourceUrl,
  selectRateStatus,
  selectRateUpdatedAt,
  selectUsdToInrRate,
  setCurrency,
} from "../features/settings/settingsSlice";
import {
  currencyOptions,
  formatLiveRate,
} from "../lib/formatters";

const CurrencySwitcher = () => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);
  const rateStatus = useSelector(selectRateStatus);
  const rateError = useSelector(selectRateError);
  const rateUpdatedAt = useSelector(selectRateUpdatedAt);
  const rateSourceUrl = useSelector(selectRateSourceUrl);

  const rateCopy =
    rateStatus === "loading"
      ? "Refreshing live USD/INR rate..."
      : rateStatus === "failed"
        ? `Using saved rate. ${rateError}`
        : `Live rate: $1 = ${currencyOptions.INR.symbol}${formatLiveRate(
            usdToInrRate
          )}`;

  return (
    <div className="panel flex items-center gap-3 px-4 py-3">
      <div className="hidden min-w-[180px] sm:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Currency
        </p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {rateCopy}
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {rateUpdatedAt ? `Updated ${rateUpdatedAt}` : "Awaiting live update"}{" "}
          <a
            href={rateSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-dotted underline-offset-2"
          >
            Rates By Exchange Rate API
          </a>
        </p>
      </div>

      <select
        value={selectedCurrency}
        onChange={(event) => dispatch(setCurrency(event.target.value))}
        className="select min-w-[140px]"
        aria-label="Switch currency"
      >
        {Object.values(currencyOptions).map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} {currency.code}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySwitcher;

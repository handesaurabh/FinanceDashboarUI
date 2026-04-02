export const currencyOptions = {
  USD: {
    code: "USD",
    label: "US Dollar",
    symbol: "$",
    locale: "en-US",
  },
  INR: {
    code: "INR",
    label: "Indian Rupee",
    symbol: "\u20B9",
    locale: "en-IN",
  },
};

export const FALLBACK_USD_TO_INR_RATE = 93.552697;

const getCurrencyConfig = (currencyCode) =>
  currencyOptions[currencyCode] ?? currencyOptions.USD;

const createCurrencyFormatter = (currencyCode, compact = false) => {
  const { code, locale } = getCurrencyConfig(currencyCode);

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: code,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  });
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const formatCurrency = (value, currencyCode = "USD") =>
  createCurrencyFormatter(currencyCode).format(
    Number.isFinite(value) ? value : 0
  );

export const formatCompactCurrency = (value, currencyCode = "USD") =>
  createCurrencyFormatter(currencyCode, true).format(
    Number.isFinite(value) ? value : 0
  );

export const formatDate = (value) => dateFormatter.format(new Date(value));

export const convertUsdToCurrency = (
  value,
  currencyCode = "USD",
  usdToInrRate = FALLBACK_USD_TO_INR_RATE
) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (currencyCode === "INR") {
    return safeValue * usdToInrRate;
  }

  return safeValue;
};

export const convertCurrencyToUsd = (
  value,
  currencyCode = "USD",
  usdToInrRate = FALLBACK_USD_TO_INR_RATE
) => {
  const safeValue = Number.isFinite(value) ? value : 0;

  if (currencyCode === "INR") {
    return safeValue / usdToInrRate;
  }

  return safeValue;
};

export const formatLiveRate = (value, maximumFractionDigits = 2) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);

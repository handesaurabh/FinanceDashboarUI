import { configureStore } from "@reduxjs/toolkit";
import transactionReducer, {
  defaultFilters,
} from "../features/transactions/transactionSlice";
import roleReducer from "../features/role/roleSlice";
import settingsReducer from "../features/settings/settingsSlice";
import {
  currencyOptions,
  FALLBACK_USD_TO_INR_RATE,
} from "../lib/formatters";

const STORAGE_KEY = "finance-dashboard-state";

const loadState = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
      return undefined;
    }

    const parsedState = JSON.parse(rawState);
    const preloadedState = {};

    if (Array.isArray(parsedState?.transactions?.list)) {
      preloadedState.transactions = {
        list: parsedState.transactions.list,
        filters: {
          ...defaultFilters,
          ...parsedState.transactions.filters,
        },
      };
    }

    if (parsedState?.role?.currentRole) {
      preloadedState.role = {
        currentRole: parsedState.role.currentRole,
      };
    }

    if (currencyOptions[parsedState?.settings?.currency]) {
      preloadedState.settings = {
        currency: parsedState.settings.currency,
        usdToInrRate:
          parsedState.settings.usdToInrRate ?? FALLBACK_USD_TO_INR_RATE,
        rateStatus: parsedState.settings.rateStatus ?? "idle",
        rateError: null,
        lastUpdatedUtc:
          parsedState.settings.lastUpdatedUtc ?? "Thu, 02 Apr 2026 00:02:31 +0000",
        sourceUrl:
          parsedState.settings.sourceUrl ??
          "https://www.exchangerate-api.com/docs/free",
      };
    }

    return Object.keys(preloadedState).length ? preloadedState : undefined;
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
    role: roleReducer,
    settings: settingsReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  if (typeof window === "undefined") {
    return;
  }

  const state = store.getState();

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      transactions: {
        list: state.transactions.list,
        filters: state.transactions.filters,
      },
      role: state.role,
      settings: state.settings,
    })
  );
});

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  currencyOptions,
  FALLBACK_USD_TO_INR_RATE,
} from "../../lib/formatters";

export const fetchUsdInrRate = createAsyncThunk(
  "settings/fetchUsdInrRate",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");

      if (!response.ok) {
        throw new Error(`Rate request failed with ${response.status}`);
      }

      const data = await response.json();

      if (data?.result !== "success" || !Number.isFinite(data?.rates?.INR)) {
        throw new Error("Exchange rate response was incomplete.");
      }

      return {
        usdToInrRate: data.rates.INR,
        lastUpdatedUtc: data.time_last_update_utc,
        sourceUrl: data.documentation ?? "https://www.exchangerate-api.com/docs/free",
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unable to load live rate."
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    currency: "USD",
    usdToInrRate: FALLBACK_USD_TO_INR_RATE,
    rateStatus: "idle",
    rateError: null,
    lastUpdatedUtc: "Thu, 02 Apr 2026 00:02:31 +0000",
    sourceUrl: "https://www.exchangerate-api.com/docs/free",
  },
  reducers: {
    setCurrency(state, action) {
      if (currencyOptions[action.payload]) {
        state.currency = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsdInrRate.pending, (state) => {
        state.rateStatus = "loading";
        state.rateError = null;
      })
      .addCase(fetchUsdInrRate.fulfilled, (state, action) => {
        state.rateStatus = "succeeded";
        state.usdToInrRate = action.payload.usdToInrRate;
        state.lastUpdatedUtc = action.payload.lastUpdatedUtc;
        state.sourceUrl = action.payload.sourceUrl;
        state.rateError = null;
      })
      .addCase(fetchUsdInrRate.rejected, (state, action) => {
        state.rateStatus = "failed";
        state.rateError = action.payload ?? "Unable to load live rate.";
      });
  },
});

export const { setCurrency } = settingsSlice.actions;
export const selectCurrency = (state) => state.settings.currency;
export const selectUsdToInrRate = (state) => state.settings.usdToInrRate;
export const selectRateStatus = (state) => state.settings.rateStatus;
export const selectRateError = (state) => state.settings.rateError;
export const selectRateUpdatedAt = (state) => state.settings.lastUpdatedUtc;
export const selectRateSourceUrl = (state) => state.settings.sourceUrl;
export default settingsSlice.reducer;

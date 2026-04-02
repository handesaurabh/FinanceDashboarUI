import { createSlice } from "@reduxjs/toolkit";
import { mockTransactions } from "../../data/mockTransactions";

export const defaultFilters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "date-desc",
};

const cloneSampleTransactions = () =>
  mockTransactions.map((transaction) => ({ ...transaction }));

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: cloneSampleTransactions(),
    filters: { ...defaultFilters },
  },
  reducers: {
    addTransaction(state, action) {
      state.list.unshift(action.payload);
    },
    updateTransaction(state, action) {
      const index = state.list.findIndex(
        (transaction) => transaction.id === action.payload.id
      );

      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteTransaction(state, action) {
      state.list = state.list.filter(
        (transaction) => transaction.id !== action.payload
      );
    },
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
    },
    setTypeFilter(state, action) {
      state.filters.type = action.payload;
    },
    setCategoryFilter(state, action) {
      state.filters.category = action.payload;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
    },
    restoreSampleTransactions(state) {
      state.list = cloneSampleTransactions();
      state.filters = { ...defaultFilters };
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setSearchFilter,
  setTypeFilter,
  setCategoryFilter,
  setSortBy,
  resetFilters,
  restoreSampleTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;

import { createSelector } from "@reduxjs/toolkit";

const parseDate = (value) => new Date(`${value}T00:00:00`);

const sortTransactions = (transactions, sortBy) => {
  const sortedTransactions = [...transactions];

  switch (sortBy) {
    case "date-asc":
      return sortedTransactions.sort(
        (first, second) => parseDate(first.date) - parseDate(second.date)
      );
    case "amount-desc":
      return sortedTransactions.sort((first, second) => second.amount - first.amount);
    case "amount-asc":
      return sortedTransactions.sort((first, second) => first.amount - second.amount);
    case "date-desc":
    default:
      return sortedTransactions.sort(
        (first, second) => parseDate(second.date) - parseDate(first.date)
      );
  }
};

const buildMonthlySeries = (transactions) => {
  const monthMap = new Map();

  [...transactions]
    .sort((first, second) => parseDate(first.date) - parseDate(second.date))
    .forEach((transaction) => {
      const date = parseDate(transaction.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!monthMap.has(key)) {
        monthMap.set(key, {
          key,
          label: date.toLocaleDateString("en-US", { month: "short" }),
          income: 0,
          expense: 0,
        });
      }

      const currentMonth = monthMap.get(key);

      if (transaction.type === "income") {
        currentMonth.income += transaction.amount;
      } else {
        currentMonth.expense += transaction.amount;
      }
    });

  let runningBalance = 0;

  return [...monthMap.values()].map((month) => {
    const net = month.income - month.expense;
    runningBalance += net;

    return {
      ...month,
      net,
      balance: runningBalance,
    };
  });
};

export const selectTransactionList = (state) => state.transactions.list;
export const selectFilters = (state) => state.transactions.filters;

export const selectCategories = createSelector([selectTransactionList], (transactions) =>
  [...new Set(transactions.map((transaction) => transaction.category))].sort()
);

export const selectFilteredTransactions = createSelector(
  [selectTransactionList, selectFilters],
  (transactions, filters) => {
    const normalizedSearch = filters.search.trim().toLowerCase();

    const filteredTransactions = transactions.filter((transaction) => {
      const searchableText = `${transaction.description} ${transaction.category} ${transaction.type}`.toLowerCase();
      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesType =
        filters.type === "all" || transaction.type === filters.type;
      const matchesCategory =
        filters.category === "all" || transaction.category === filters.category;

      return matchesSearch && matchesType && matchesCategory;
    });

    return sortTransactions(filteredTransactions, filters.sortBy);
  }
);

export const selectHasActiveFilters = createSelector([selectFilters], (filters) => {
  return (
    filters.search.trim().length > 0 ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.sortBy !== "date-desc"
  );
});

export const selectDashboardSummary = createSelector(
  [selectFilteredTransactions],
  (transactions) => {
    const income = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    return {
      income,
      expenses,
      balance,
      count: transactions.length,
      savingsRate,
    };
  }
);

export const selectTrendData = createSelector(
  [selectFilteredTransactions],
  (transactions) => buildMonthlySeries(transactions)
);

export const selectSpendingBreakdown = createSelector(
  [selectFilteredTransactions],
  (transactions) => {
    const categoryMap = new Map();

    transactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        categoryMap.set(
          transaction.category,
          (categoryMap.get(transaction.category) || 0) + transaction.amount
        );
      });

    const totalExpense = [...categoryMap.values()].reduce(
      (total, amount) => total + amount,
      0
    );

    return [...categoryMap.entries()]
      .map(([name, value]) => ({
        name,
        value,
        share: totalExpense ? Math.round((value / totalExpense) * 100) : 0,
      }))
      .sort((first, second) => second.value - first.value);
  }
);

export const selectInsights = createSelector(
  [
    selectFilteredTransactions,
    selectTrendData,
    selectSpendingBreakdown,
    selectDashboardSummary,
  ],
  (transactions, trendData, spendingBreakdown, summary) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const transactionsThisMonth = transactions.filter((transaction) => {
      const transactionDate = parseDate(transaction.date);

      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    const highestCategory = spendingBreakdown[0] ?? null;
    const latestMonth = trendData.at(-1) ?? null;
    const previousMonth = trendData.at(-2) ?? null;
    const monthlyDifference =
      latestMonth && previousMonth
        ? latestMonth.expense - previousMonth.expense
        : null;
    const monthlyChangePercentage =
      monthlyDifference !== null && previousMonth?.expense
        ? Math.round(
            (Math.abs(monthlyDifference) / previousMonth.expense) * 100
          )
        : null;
    const largestTransaction =
      [...transactions].sort((first, second) => second.amount - first.amount)[0] ??
      null;
    const monthLabel = now.toLocaleDateString("en-US", { month: "long" });
    const incomeTransactionsThisMonth = transactionsThisMonth.filter(
      (transaction) => transaction.type === "income"
    ).length;
    const expenseTransactionsThisMonth = transactionsThisMonth.filter(
      (transaction) => transaction.type === "expense"
    ).length;

    let observation =
      "Add transactions or adjust filters to generate more meaningful insights.";

    if (summary.count > 0 && summary.balance >= 0) {
      observation =
        "Income is currently ahead of expenses, so the visible cash flow remains positive.";
    } else if (summary.count > 0) {
      observation =
        "Visible expenses are higher than income. Reviewing the largest categories would be a sensible next step.";
    }

    return {
      highestCategory,
      latestMonth,
      previousMonth,
      monthlyDifference,
      monthlyChangePercentage,
      largestTransaction,
      monthLabel,
      transactionsThisMonth: transactionsThisMonth.length,
      incomeTransactionsThisMonth,
      expenseTransactionsThisMonth,
      observation,
    };
  }
);

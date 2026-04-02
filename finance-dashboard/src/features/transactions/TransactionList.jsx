import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import AddTransactionModal from "../../components/AddTransactionModal";
import { selectCurrentRole } from "../role/roleSlice";
import {
  deleteTransaction,
  resetFilters,
  restoreSampleTransactions,
  setCategoryFilter,
  setSearchFilter,
  setSortBy,
  setTypeFilter,
} from "./transactionSlice";
import {
  selectCategories,
  selectFilteredTransactions,
  selectFilters,
  selectHasActiveFilters,
  selectTransactionList,
} from "./selectors";
import {
  convertUsdToCurrency,
  formatCurrency,
  formatDate,
} from "../../lib/formatters";
import {
  selectCurrency,
  selectUsdToInrRate,
} from "../settings/settingsSlice";

const exportTransactionsAsCsv = (transactions) => {
  const rows = [
    ["Date", "Description", "Category", "Type", "Amount"],
    ...transactions.map((transaction) => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount,
    ]),
  ];

  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "finance-dashboard-transactions.csv";
  link.click();
  window.URL.revokeObjectURL(url);
};

const MotionDiv = motion.div;

const TransactionList = () => {
  const dispatch = useDispatch();
  const currentRole = useSelector(selectCurrentRole);
  const allTransactions = useSelector(selectTransactionList);
  const transactions = useSelector(selectFilteredTransactions);
  const categories = useSelector(selectCategories);
  const filters = useSelector(selectFilters);
  const hasActiveFilters = useSelector(selectHasActiveFilters);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [modalAnchorRect, setModalAnchorRect] = useState(null);

  const isAdmin = currentRole === "admin";
  const emptyStateMessage = useMemo(() => {
    if (allTransactions.length === 0) {
      return "No transactions are saved right now. Restore the sample data or add a new record.";
    }

    return "No transactions match the current search or filters.";
  }, [allTransactions.length]);

  const openCreateModal = (event) => {
    if (!isAdmin) {
      return;
    }

    setEditingTransaction(null);
    setModalAnchorRect(event?.currentTarget?.getBoundingClientRect?.() ?? null);
    setIsModalOpen(true);
  };

  const openEditModal = (transaction, event) => {
    if (!isAdmin) {
      return;
    }

    setEditingTransaction(transaction);
    setModalAnchorRect(event?.currentTarget?.getBoundingClientRect?.() ?? null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTransaction(null);
    setModalAnchorRect(null);
    setIsModalOpen(false);
  };

  const handleDelete = (transactionId) => {
    if (!isAdmin) {
      return;
    }

    const shouldDelete = window.confirm(
      "Delete this transaction from the dashboard?"
    );

    if (shouldDelete) {
      dispatch(deleteTransaction(transactionId));
    }
  };

  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold">Transactions</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Search, sort, and filter records. Admin mode can add or edit
            transactions, while viewer mode stays read-only.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => exportTransactionsAsCsv(transactions)}
            disabled={transactions.length === 0}
            className="btn-secondary"
          >
            Export CSV
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary"
            >
              Add transaction
            </button>
          ) : (
            <button type="button" disabled className="btn-primary">
              Admin only
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/60">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-white">
            Current role:
          </span>{" "}
          {isAdmin
            ? "Admin can add, edit, delete, and restore transactions."
            : "Viewer can review data only. Write actions are disabled on purpose."}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-4">
        <input
          type="text"
          value={filters.search}
          onChange={(event) => dispatch(setSearchFilter(event.target.value))}
          placeholder="Search description or category"
          className="input lg:col-span-2"
        />

        <select
          value={filters.type}
          onChange={(event) => dispatch(setTypeFilter(event.target.value))}
          className="select"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => dispatch(setCategoryFilter(event.target.value))}
          className="select"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {transactions.length}
          </span>{" "}
          of {allTransactions.length} transaction
          {allTransactions.length === 1 ? "" : "s"}.
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={filters.sortBy}
            onChange={(event) => dispatch(setSortBy(event.target.value))}
            className="select min-w-[180px]"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Amount high to low</option>
            <option value="amount-asc">Amount low to high</option>
          </select>

          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            disabled={!hasActiveFilters}
            className="btn-secondary"
          >
            Reset filters
          </button>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => dispatch(restoreSampleTransactions())}
              className="btn-secondary"
            >
              Restore sample data
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="hidden grid-cols-[130px_minmax(0,1.8fr)_140px_120px_120px_110px] gap-4 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:grid">
          <p>Date</p>
          <p>Details</p>
          <p>Category</p>
          <p>Type</p>
          <p>Amount</p>
          <p>Actions</p>
        </div>

        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <MotionDiv
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="grid gap-3 rounded-[24px] border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950/60 md:grid-cols-[130px_minmax(0,1.8fr)_140px_120px_120px_110px] md:items-center"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:hidden">
                  Date
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  {formatDate(transaction.date)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:hidden">
                  Details
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {transaction.description}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  ID: {transaction.id.slice(0, 8)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:hidden">
                  Category
                </p>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                  {transaction.category}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:hidden">
                  Type
                </p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                    transaction.type === "income"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-400/10 dark:text-rose-200"
                  }`}
                >
                  {transaction.type}
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400 md:hidden">
                  Amount
                </p>
                <p
                  className={`font-semibold ${
                    transaction.type === "income"
                      ? "text-emerald-700 dark:text-emerald-200"
                      : "text-slate-900 dark:text-white"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(
                    convertUsdToCurrency(
                      transaction.amount,
                      currency,
                      usdToInrRate
                    ),
                    currency
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isAdmin ? (
                  <>
                    <button
                      type="button"
                      onClick={(event) => openEditModal(transaction, event)}
                      className="btn-secondary px-3 py-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="btn-secondary px-3 py-2"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Read only
                  </span>
                )}
              </div>
            </MotionDiv>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <h3 className="font-heading text-xl font-semibold">
              No transactions to show
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {emptyStateMessage}
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => dispatch(resetFilters())}
                  className="btn-secondary"
                >
                  Clear filters
                </button>
              ) : null}

              {isAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={() => dispatch(restoreSampleTransactions())}
                    className="btn-secondary"
                  >
                    Restore sample data
                  </button>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="btn-primary"
                  >
                    Add transaction
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <AddTransactionModal
        key={`${editingTransaction?.id ?? "new"}-${currency}-${isModalOpen ? "open" : "closed"}`}
        isOpen={isModalOpen}
        close={closeModal}
        transaction={editingTransaction}
        anchorRect={modalAnchorRect}
      />
    </section>
  );
};

export default TransactionList;

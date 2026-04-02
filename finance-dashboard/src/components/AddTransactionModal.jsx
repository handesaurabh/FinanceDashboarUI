import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addTransaction,
  updateTransaction,
} from "../features/transactions/transactionSlice";
import { selectCategories } from "../features/transactions/selectors";
import {
  selectCurrency,
  selectRateUpdatedAt,
  selectUsdToInrRate,
} from "../features/settings/settingsSlice";
import {
  convertCurrencyToUsd,
  convertUsdToCurrency,
  currencyOptions,
  formatLiveRate,
} from "../lib/formatters";

const createInitialForm = (transaction, currency, usdToInrRate) => ({
  date: transaction?.date ?? new Date().toISOString().slice(0, 10),
  description: transaction?.description ?? "",
  category: transaction?.category ?? "",
  type: transaction?.type ?? "expense",
  amount: transaction
    ? String(
        Number(
          convertUsdToCurrency(transaction.amount, currency, usdToInrRate).toFixed(2)
        )
      )
    : "",
});

const createTransactionId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());

const MotionDiv = motion.div;

const AddTransactionModal = ({ isOpen, close, transaction, anchorRect }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const currency = useSelector(selectCurrency);
  const usdToInrRate = useSelector(selectUsdToInrRate);
  const rateUpdatedAt = useSelector(selectRateUpdatedAt);
  const [form, setForm] = useState(() =>
    createInitialForm(transaction, currency, usdToInrRate)
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [close, isOpen]);

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const visibleAmount = Number(form.amount);

    if (
      !form.description.trim() ||
      !form.category.trim() ||
      !form.date ||
      !Number.isFinite(visibleAmount) ||
      visibleAmount <= 0
    ) {
      return;
    }

    const payload = {
      id: transaction?.id ?? createTransactionId(),
      date: form.date,
      description: form.description.trim(),
      category: form.category.trim(),
      type: form.type,
      amount: Number(
        convertCurrencyToUsd(visibleAmount, currency, usdToInrRate).toFixed(2)
      ),
    };

    if (transaction) {
      dispatch(updateTransaction(payload));
    } else {
      dispatch(addTransaction(payload));
    }

    close();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen ? (
        <MotionDiv
          className="fixed inset-0 z-[120] bg-slate-950/40 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={close}
            className="absolute inset-0 cursor-default"
          />

          <div className="relative flex min-h-screen items-start justify-center overflow-y-auto px-4 py-6 sm:items-center sm:py-10">
            <MotionDiv
              initial={{
                opacity: 0,
                y: anchorRect
                  ? Math.max(anchorRect.top - window.innerHeight / 2, -60)
                  : 18,
                scale: 0.98,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="panel relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-y-auto p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="chip">{transaction ? "Edit" : "Add"} transaction</p>
                  <h3 className="font-heading mt-3 text-2xl font-semibold">
                    {transaction
                      ? "Update transaction details"
                      : "Create a new transaction"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Amounts are entered in {currencyOptions[currency].label} and
                    stored using the live USD/INR rate.
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Live rate: $1 = {currencyOptions.INR.symbol}
                    {formatLiveRate(usdToInrRate)}.
                    {rateUpdatedAt ? ` Updated ${rateUpdatedAt}.` : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={close}
                  className="btn-secondary px-3 py-2"
                >
                  Close
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Date
                    </span>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) => handleChange("date", event.target.value)}
                      className="input"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Amount ({currencyOptions[currency].symbol})
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) =>
                        handleChange("amount", event.target.value)
                      }
                      className="input"
                      placeholder={currency === "INR" ? "930.00" : "10.00"}
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Description
                  </span>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(event) =>
                      handleChange("description", event.target.value)
                    }
                    className="input"
                    placeholder="Example: Grocery restock"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Category
                    </span>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) =>
                        handleChange("category", event.target.value)
                      }
                      className="input"
                      placeholder="Example: Groceries"
                      list="transaction-categories"
                    />
                    <datalist id="transaction-categories">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Type
                    </span>
                    <select
                      value={form.type}
                      onChange={(event) => handleChange("type", event.target.value)}
                      className="select"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </label>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={close}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {transaction ? "Save changes" : "Add transaction"}
                  </button>
                </div>
              </form>
            </MotionDiv>
          </div>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default AddTransactionModal;

// Transaction management section. Provides search/filter/sort for all users,
// and conditionally enables add/edit form controls when role is admin.
import { useMemo, useState } from "react";
import { useStore } from "../store/useStore";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const getUniqueCategories = (transactions) =>
  [...new Set(transactions.map((item) => item.category))].sort((a, b) => a.localeCompare(b));

const initialFormState = {
  date: "",
  amount: "",
  category: "",
  type: "expense",
  note: "",
};

function TransactionsTable() {
  const transactions = useStore((state) => state.transactions);
  const role = useStore((state) => state.role);
  const filters = useStore((state) => state.filters);
  const setFilter = useStore((state) => state.setFilter);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);

  const [formState, setFormState] = useState(initialFormState);
  const [editId, setEditId] = useState(null);

  const categories = useMemo(() => getUniqueCategories(transactions), [transactions]);

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((item) => {
      const matchesSearch =
        filters.search.trim().length === 0 ||
        item.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.note.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = filters.type === "all" || item.type === filters.type;
      const matchesCategory = filters.category === "all" || item.category === filters.category;

      return matchesSearch && matchesType && matchesCategory;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (filters.sortBy === "amountAsc") {
        return a.amount - b.amount;
      }
      if (filters.sortBy === "amountDesc") {
        return b.amount - a.amount;
      }
      if (filters.sortBy === "dateAsc") {
        return new Date(a.date) - new Date(b.date);
      }
      return new Date(b.date) - new Date(a.date);
    });

    return sorted;
  }, [transactions, filters]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setEditId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formState.date || !formState.amount || !formState.category.trim()) {
      console.log("Transaction form validation failed", formState);
      return;
    }

    const payload = {
      ...formState,
      amount: Number(formState.amount),
      category: formState.category.trim(),
      note: formState.note.trim(),
    };

    if (editId) {
      updateTransaction(editId, payload);
      console.log("Edited transaction with ID:", editId);
    } else {
      addTransaction(payload);
      console.log("Created new transaction");
    }

    resetForm();
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setFormState({
      date: transaction.date,
      amount: String(transaction.amount),
      category: transaction.category,
      type: transaction.type,
      note: transaction.note,
    });

    console.log("Preparing edit for transaction:", transaction.id);
  };

  return (
    <section className="rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200/70 transition duration-200 hover:shadow-xl sm:p-5 dark:bg-slate-950 dark:ring-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Transactions</h3>
        <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          Role: {role}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={filters.search}
          onChange={(event) => setFilter("search", event.target.value)}
          placeholder="Search by category or note"
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
        />

        <select
          value={filters.type}
          onChange={(event) => setFilter("type", event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.category}
          onChange={(event) => setFilter("category", event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(event) => setFilter("sortBy", event.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
        >
          <option value="dateDesc">Newest Date</option>
          <option value="dateAsc">Oldest Date</option>
          <option value="amountDesc">Amount High-Low</option>
          <option value="amountAsc">Amount Low-High</option>
        </select>
      </div>

      <div
        className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
          role === "admin"
            ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200"
            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200"
        }`}
      >
        {role === "admin"
          ? "Admin mode is active: Add Transaction form and Edit actions are enabled."
          : "Viewer mode is active: You can view data only. Switch to Admin to add or edit transactions."}
      </div>

      {role === "admin" && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-6 dark:bg-slate-900/70"
        >
          <input
            type="date"
            name="date"
            value={formState.date}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          />

          <input
            type="number"
            name="amount"
            value={formState.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          />

          <input
            type="text"
            name="category"
            value={formState.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          />

          <select
            name="type"
            value={formState.type}
            onChange={handleInputChange}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            name="note"
            value={formState.note}
            onChange={handleInputChange}
            placeholder="Note"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition duration-150 hover:border-slate-300 focus:border-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white transition duration-150 hover:-translate-y-0.5 hover:bg-brand-700"
            >
              {editId ? "Save" : "Add"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700 dark:hover:bg-slate-800"
            >
              Clear
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 overflow-x-auto">
        {filteredTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No transactions found for current filters.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredTransactions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl bg-slate-50 p-4 transition duration-150 hover:-translate-y-0.5 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.category}</p>
                    <p className={`text-sm font-semibold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatCurrency(item.amount)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {item.date} • {item.type}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.note}</p>
                  {role === "admin" && (
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="mt-3 rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition duration-150 hover:bg-brand-100 dark:bg-cyan-950/40 dark:text-cyan-100 dark:hover:bg-cyan-950/60"
                    >
                      Edit
                    </button>
                  )}
                </article>
              ))}
            </div>

            <table className="hidden min-w-full border-collapse text-left text-sm md:table">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Category</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Amount</th>
                  <th className="px-3 py-2 font-medium">Note</th>
                  {role === "admin" && <th className="px-3 py-2 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((item) => (
                  <tr className="border-b border-slate-100 text-slate-700 transition-colors duration-150 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900/60" key={item.id}>
                    <td className="px-3 py-2">{item.date}</td>
                    <td className="px-3 py-2">{item.category}</td>
                    <td className="px-3 py-2 capitalize">{item.type}</td>
                    <td className={`px-3 py-2 font-semibold ${item.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-3 py-2">{item.note}</td>
                    {role === "admin" && (
                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="rounded-lg bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 transition duration-150 hover:bg-brand-100 dark:bg-cyan-950/40 dark:text-cyan-100 dark:hover:bg-cyan-950/60"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}

export default TransactionsTable;

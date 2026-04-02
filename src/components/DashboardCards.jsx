// KPI card section. It derives totals from transactions and renders three
// summary cards: Total Balance, Total Income, and Total Expenses.
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function DashboardCards({ transactions }) {
  // Centralized totals keep calculations in one place and easy to debug.
  const totals = transactions.reduce(
    (acc, item) => {
      if (item.type === "income") {
        acc.totalIncome += item.amount;
      } else {
        acc.totalExpenses += item.amount;
      }

      return acc;
    },
    { totalIncome: 0, totalExpenses: 0 },
  );

  const totalBalance = totals.totalIncome - totals.totalExpenses;

  const cards = [
    { label: "Total Balance", value: totalBalance, tone: "text-brand-700" },
    { label: "Total Income", value: totals.totalIncome, tone: "text-emerald-600" },
    { label: "Total Expenses", value: totals.totalExpenses, tone: "text-rose-600" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl bg-white/95 p-5 shadow-card ring-1 ring-slate-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-200 dark:bg-slate-950 dark:ring-slate-800 dark:hover:ring-cyan-900"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
          <h2 className={`mt-3 text-2xl font-semibold ${card.tone}`}>{formatCurrency(card.value)}</h2>
        </article>
      ))}
    </section>
  );
}

export default DashboardCards;

// Insights panel that computes human-readable summaries from transactions,
// including top expense category and month-over-month spending change.
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

function Insights({ transactions }) {
  const expenseByCategory = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

  const highestCategoryEntry = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1])[0];
  const highestCategory = highestCategoryEntry?.[0] || "N/A";
  const highestCategoryAmount = highestCategoryEntry?.[1] || 0;

  const monthTotals = transactions.reduce((acc, item) => {
    const month = item.date.slice(0, 7);
    if (!acc[month]) {
      acc[month] = 0;
    }

    if (item.type === "expense") {
      acc[month] += item.amount;
    }

    return acc;
  }, {});

  const sortedMonths = Object.keys(monthTotals).sort((a, b) => a.localeCompare(b));
  const latestMonth = sortedMonths[sortedMonths.length - 1];
  const previousMonth = sortedMonths[sortedMonths.length - 2];

  const latestTotal = latestMonth ? monthTotals[latestMonth] : 0;
  const previousTotal = previousMonth ? monthTotals[previousMonth] : 0;

  const diff = latestTotal - previousTotal;
  const trendText =
    diff === 0
      ? "Spending is unchanged compared to last month."
      : diff > 0
        ? `Spending increased by ${formatCurrency(diff)} compared to last month.`
        : `Spending decreased by ${formatCurrency(Math.abs(diff))} compared to last month.`;

  return (
    <section className="rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200/70 sm:p-5 dark:bg-slate-950 dark:ring-slate-800">
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Insights</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-xl bg-slate-50 p-4 transition duration-200 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Highest Spending Category</p>
          <p className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100">
            {highestCategory} ({formatCurrency(highestCategoryAmount)})
          </p>
        </article>

        <article className="rounded-xl bg-slate-50 p-4 transition duration-200 hover:bg-slate-100 dark:bg-slate-900/80 dark:hover:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Comparison</p>
          <p className="mt-2 text-base font-semibold text-slate-800 dark:text-slate-100">{trendText}</p>
        </article>
      </div>

      <p className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-900 transition duration-200 hover:bg-brand-100 dark:bg-cyan-950/40 dark:text-cyan-100 dark:hover:bg-cyan-950/60">
        Simple Insight: Try setting a monthly budget limit for {highestCategory} to keep expenses stable.
      </p>
    </section>
  );
}

export default Insights;

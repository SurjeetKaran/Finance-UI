// Analytics chart block built with Recharts. It transforms transactions into:
// 1) monthly balance trend (line chart), and 2) expense split by category (donut).
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "../store/useStore";

const chartColors = ["#489486", "#62ae9f", "#34766a", "#8ec9bd", "#264d46", "#b9dfd7", "#90a39e"];

const formatMonth = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short" });
};

function Charts({ transactions }) {
  const theme = useStore((state) => state.theme);

  // Balance trend is generated month-wise so the chart remains readable.
  const monthlyMap = transactions.reduce((acc, item) => {
    const month = item.date.slice(0, 7);
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }

    if (item.type === "income") {
      acc[month].income += item.amount;
    } else {
      acc[month].expense += item.amount;
    }

    return acc;
  }, {});

  const lineData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month: formatMonth(`${month}-01`),
      balance: values.income - values.expense,
    }));

  const categoryTotals = transactions
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  const axisColor = theme === "dark" ? "#a3b4c9" : "#64748b";
  const tooltipStyles =
    theme === "dark"
      ? { backgroundColor: "#020617", border: "1px solid #1e293b", borderRadius: "12px", color: "#e2e8f0" }
      : { backgroundColor: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "12px", color: "#0f172a" };

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-5 dark:bg-slate-950 dark:ring-slate-800">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Balance Over Time</h3>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip contentStyle={tooltipStyles} />
              <Line type="monotone" dataKey="balance" stroke="#34766a" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-2xl bg-white/95 p-4 shadow-card ring-1 ring-slate-200/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl sm:p-5 dark:bg-slate-950 dark:ring-slate-800">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-100">Spending by Category</h3>
        <div className="mt-4 h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={105} label>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyles} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}

export default Charts;

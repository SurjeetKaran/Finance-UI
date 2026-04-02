// Main page container for the Finance Dashboard. It composes all major sections,
// and applies the dark-mode class on the document root based on store theme state.
import { useEffect } from "react";
import Charts from "../components/Charts";
import DashboardCards from "../components/DashboardCards";
import Insights from "../components/Insights";
import RoleSwitcher from "../components/RoleSwitcher";
import TransactionsTable from "../components/TransactionsTable";
import { useStore } from "../store/useStore";

function Dashboard() {
  const transactions = useStore((state) => state.transactions);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    // Class-based theming keeps Tailwind dark utilities predictable.
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
      <header className="mb-6 rounded-3xl bg-white/80 p-4 shadow-card ring-1 ring-slate-200/70 backdrop-blur sm:p-6 dark:bg-slate-950/70 dark:ring-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl dark:text-slate-100">Finance Dashboard</h1>
            <p className="mt-1 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
              Track balances, monitor expenses, and review quick insights with role-based controls.
            </p>
          </div>
          <div className="lg:self-start">
            <RoleSwitcher />
          </div>
        </div>
      </header>

      <div className="space-y-5">
        <DashboardCards transactions={transactions} />
        <Charts transactions={transactions} />
        <Insights transactions={transactions} />
        <TransactionsTable />
      </div>
    </main>
  );
}

export default Dashboard;

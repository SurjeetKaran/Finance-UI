// Header control group for role and theme. Role changes permission-based UI
// (viewer vs admin), while theme toggle switches between light and dark modes.
import { useStore } from "../store/useStore";

function RoleSwitcher() {
  const role = useStore((state) => state.role);
  const setRole = useStore((state) => state.setRole);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const handleRoleChange = (nextRole) => {
    console.log("Role switch clicked:", nextRole);
    setRole(nextRole);
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  return (
    <div className="w-full rounded-2xl bg-white/95 p-2.5 shadow-card ring-1 ring-slate-200/80 backdrop-blur dark:bg-slate-950/90 dark:ring-slate-800 lg:w-fit lg:min-w-[340px] lg:max-w-[380px]">
      <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto">
        <div className="inline-flex shrink-0 rounded-xl bg-slate-50 p-1 dark:bg-slate-900">
          {[
            { key: "viewer", label: "Viewer" },
            { key: "admin", label: "Admin" },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => handleRoleChange(option.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition duration-150 sm:px-3.5 ${
                role === option.key
                  ? "bg-brand-600 text-white shadow-sm hover:-translate-y-0.5 dark:bg-cyan-500 dark:text-slate-950"
                  : "bg-transparent text-slate-600 hover:-translate-y-0.5 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-pressed={theme === "dark"}
          className={`ml-auto relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 transition duration-200 ${
            theme === "light"
              ? "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
              : "border-brand-500 bg-brand-600 dark:border-cyan-400 dark:bg-cyan-500"
          }`}
        >
          <span
            className={`absolute top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition duration-200 ${
              theme === "light" ? "left-0.5" : "left-6"
            }`}
          >
            <span className={`h-3.5 w-3.5 rounded-full ${theme === "light" ? "bg-amber-400" : "bg-slate-700"}`} />
          </span>
        </button>
      </div>

      <p className="mt-2.5 rounded-lg bg-slate-50 px-3 py-2 text-[11px] leading-5 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
        {role === "viewer"
          ? "Viewer: You can only view charts and transactions."
          : "Admin: You can add new transactions and edit existing ones."}
      </p>
    </div>
  );
}

export default RoleSwitcher;

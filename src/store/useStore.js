// Central Zustand store for app state. It holds transactions, role, filters,
// and theme, plus actions for add/update operations and UI preference updates.
import { create } from "zustand";
import { mockTransactions } from "../data/mockData";

const defaultFilters = {
  search: "",
  type: "all",
  category: "all",
  sortBy: "dateDesc",
};

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("dashboard-theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const useStore = create((set) => ({
  transactions: mockTransactions,
  role: "viewer",
  filters: defaultFilters,
  theme: getInitialTheme(),

  addTransaction: (transaction) =>
    set((state) => {
      console.log("Adding transaction:", transaction);

      const nextId = state.transactions.length
        ? Math.max(...state.transactions.map((item) => item.id)) + 1
        : 1;

      return {
        transactions: [...state.transactions, { ...transaction, id: nextId }],
      };
    }),

  updateTransaction: (id, updatedValues) =>
    set((state) => {
      console.log("Updating transaction:", id, updatedValues);

      return {
        transactions: state.transactions.map((item) =>
          item.id === id ? { ...item, ...updatedValues } : item,
        ),
      };
    }),

  setRole: (role) =>
    set(() => {
      console.log("Role changed:", role);
      return { role };
    }),

  setFilter: (key, value) =>
    set((state) => {
      const nextFilters = { ...state.filters, [key]: value };
      console.log("Filter updated:", key, value, nextFilters);
      return { filters: nextFilters };
    }),

  setTheme: (theme) =>
    set(() => {
      console.log("Theme changed:", theme);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("dashboard-theme", theme);
      }
      return { theme };
    }),
}));

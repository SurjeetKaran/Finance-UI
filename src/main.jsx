// React bootstrap file. It mounts the App component into #root and loads
// global styles so Tailwind/theme styles are available application-wide.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

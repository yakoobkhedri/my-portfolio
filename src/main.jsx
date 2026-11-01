// فیلتر کردن هشدار خاص react-swipeable-views
const originalError = console.error;
console.error = (...args) => {
  // چک کردن اینکه آرگومان اول رشته هست و شامل متن هشدار میشه
  if (typeof args[0] === 'string' && args[0].includes('UNSAFE_componentWillReceiveProps')) {
    return;
  }
  // بقیه خطاها رو رد کن به کنسول اصلی
  originalError.apply(console, args);
};
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
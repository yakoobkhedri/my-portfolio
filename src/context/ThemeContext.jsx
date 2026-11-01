import { createContext, useContext, useState, useEffect } from "react";

// ۱. ساخت Context
const ThemeContext = createContext();

// ۲. ساخت Provider
export const ThemeProvider = ({ children }) => {
  // تم رو از localStorage می‌خونیم یا پیش‌فرض "dark" می‌ذاریم
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  // ۳. هر وقت تم عوض شد، توی localStorage ذخیره کن
  useEffect(() => {
    localStorage.setItem("theme", theme);
    
    // ۴. کلاس رو روی <html> اعمال کن
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // ۵. تابع تغییر تم
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ۶. Custom Hook برای استفاده راحت‌تر
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
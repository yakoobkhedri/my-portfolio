import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#10b981", "#f59e0b"];

const CategoryChart = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e1b4b" : "#fff",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
            borderRadius: "8px",
            color: isDark ? "#fff" : "#1f2937",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryChart;